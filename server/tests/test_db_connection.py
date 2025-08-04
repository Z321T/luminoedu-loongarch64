import asyncio
import pytest
from tortoise import Tortoise, run_async
from tortoise.exceptions import OperationalError
import time


async def test_db_connection():
    """测试数据库连接并执行基本操作"""
    print("开始数据库连接测试...")

    try:
        # 连接到数据库
        print("尝试连接到数据库...")
        await Tortoise.init(
            db_url="mysql://root:root@localhost:3306/luminoedu_test?connect_timeout=30",
            modules={"models": []}  # 不加载模型，纯粹测试连接
        )
        print("数据库连接成功!")

        # 获取连接对象
        conn = Tortoise.get_connection("default")
        print("获取连接对象成功!")

        # 测试简单查询
        print("测试执行SQL查询...")
        result = await conn.execute_query("SELECT 1 as test")
        print(f"查询结果: {result}")

        # 测试创建表
        print("尝试创建测试表...")
        await conn.execute_script("""
        CREATE TABLE IF NOT EXISTS db_connection_test (
            id INT AUTO_INCREMENT PRIMARY KEY,
            test_data VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)

        # 插入测试数据
        print("尝试插入测试数据...")
        await conn.execute_query(
            "INSERT INTO db_connection_test (test_data) VALUES (%s)",
            ["连接测试成功 " + time.strftime("%Y-%m-%d %H:%M:%S")]
        )

        # 查询测试数据
        print("查询测试数据...")
        rows = await conn.execute_query("SELECT * FROM db_connection_test ORDER BY id DESC LIMIT 5")
        for i, row in enumerate(rows[1]):
            print(f"行 {i + 1}: {row}")

        print("\n数据库连接和操作测试全部成功!")
        return True

    except OperationalError as e:
        print(f"数据库操作错误: {e}")
        print("\n常见问题排查:")
        print("1. MySQL服务是否已启动")
        print("2. 用户名/密码是否正确")
        print("3. 数据库'luminoedu_test'是否存在")
        print("4. 连接权限是否正确")
        return False
    except Exception as e:
        print(f"发生未知错误: {e}")
        return False
    finally:
        print("关闭数据库连接...")
        await Tortoise.close_connections()


async def test_concurrent_connections(num_connections=5):
    """测试多个并发连接"""
    print(f"\n测试 {num_connections} 个并发连接...")

    async def single_connection_test(conn_id):
        try:
            # 创建独立连接
            conn_name = f"conn_{conn_id}"
            # 修改此处，直接使用 Tortoise.init 而不是 init_models
            await Tortoise.init(
                db_url="mysql://root:root@localhost:3306/luminoedu_test?connect_timeout=30",
                modules={"models": []}  # 不加载模型，纯粹测试连接
            )

            conn = Tortoise.get_connection("default")
            result = await conn.execute_query(f"SELECT '{conn_name}' as connection_id")
            print(f"连接 {conn_id} 测试成功: {result}")
            return True
        except Exception as e:
            print(f"连接 {conn_id} 测试失败: {e}")
            return False
        finally:
            # 确保关闭连接
            await Tortoise.close_connections()

    # 创建多个并发连接测试
    tasks = [single_connection_test(i) for i in range(num_connections)]
    results = await asyncio.gather(*tasks)

    success_count = results.count(True)
    print(f"\n并发连接测试结果: {success_count}/{num_connections} 成功")
    return success_count == num_connections


# 添加 pytest 标记，使异步函数可被 pytest 执行
@pytest.mark.asyncio
async def test_database_connection():
    """pytest可运行的数据库连接测试"""
    result = await test_db_connection()
    assert result is True, "数据库连接测试失败"


@pytest.mark.asyncio
async def test_multiple_connections():
    """pytest可运行的并发连接测试"""
    # 确保基础连接工作正常
    base_result = await test_db_connection()
    if not base_result:
        pytest.skip("基本连接测试失败，跳过并发测试")

    # 测试并发连接
    result = await test_concurrent_connections(3)
    assert result is True, "并发连接测试失败"


async def main():
    """主测试函数"""
    # 基本连接测试
    if not await test_db_connection():
        print("基本数据库连接测试失败，跳过并发测试")
        return

    # 并发连接测试
    await test_concurrent_connections()


if __name__ == "__main__":
    print("=" * 50)
    print("MySQL 数据库连接测试工具")
    print("=" * 50)
    run_async(main())