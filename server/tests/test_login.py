import pytest
import pytest_asyncio
from unittest import mock
from fastapi import status, HTTPException
from httpx import AsyncClient, ASGITransport
import types

from app.main import app
from app.models.user_common import UserRole


@pytest_asyncio.fixture
async def async_client():
    """创建异步测试客户端，不初始化数据库"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        with mock.patch("app.services.auth.authenticate_user") as mock_auth:
            setup_auth_mock(mock_auth)
            yield ac


def setup_auth_mock(mock_auth):
    """设置身份验证模拟"""

    async def mock_authenticate(user_id, password, role):
        user_data = None
        if user_id == "2023001" and password == "password123" and role == UserRole.STUDENT:
            user_data = {"id": 1, "username": "学生1", "role": UserRole.STUDENT}
        elif user_id == "T2023001" and password == "password123" and role == UserRole.TEACHER:
            user_data = {"id": 2, "username": "教师1", "role": UserRole.TEACHER}
        elif user_id == "A001" and password == "password123" and role == UserRole.ADMIN:
            user_data = {"id": 3, "username": "管理员1", "role": UserRole.ADMIN}

        if user_data:
            # 将字典转换为 SimpleNamespace 对象
            user_obj = types.SimpleNamespace(**user_data)
            return user_obj
        elif user_id == "2023001" and password == "password123" and role != UserRole.STUDENT:
            # 角色不匹配
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"该{role.value}用户不存在",
            )
        # 用户不存在或密码错误
        else:
            if role == UserRole.STUDENT:
                field_name = "学号"
            elif role == UserRole.TEACHER:
                field_name = "工号"
            else:
                field_name = "管理员编号"

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"该{role.value}用户不存在" if not any(
                    user_id == id for id in ["2023001", "T2023001", "A001"]) else "密码错误",
                headers={"WWW-Authenticate": "Bearer"},
            )

    mock_auth.side_effect = mock_authenticate


@pytest.mark.asyncio
async def test_login_student_success(async_client):
    """测试学生成功登录"""
    response = await async_client.post(
        "/auth/login",
        json={"user_id": "2023001", "password": "password123", "role": "student"}
    )

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user_id"] == "2023001"
    assert data["role"] == UserRole.STUDENT.value
    assert data["username"] == "学生1"


@pytest.mark.asyncio
async def test_login_teacher_success(async_client):
    """测试教师成功登录"""
    response = await async_client.post(
        "/auth/login",
        json={"user_id": "T2023001", "password": "password123", "role": "teacher"}
    )

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user_id"] == "T2023001"
    assert data["role"] == UserRole.TEACHER.value
    assert data["username"] == "教师1"


@pytest.mark.asyncio
async def test_login_admin_success(async_client):
    """测试管理员成功登录"""
    response = await async_client.post(
        "/auth/login",
        json={"user_id": "A001", "password": "password123", "role": "admin"}
    )

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user_id"] == "A001"
    assert data["role"] == UserRole.ADMIN.value
    assert data["username"] == "管理员1"


@pytest.mark.asyncio
async def test_login_role_mismatch(async_client):
    """测试角色不匹配"""
    response = await async_client.post(
        "/auth/login",
        json={"user_id": "2023001", "password": "password123", "role": "teacher"}
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    data = response.json()
    assert "detail" in data
    assert "不存在" in data["detail"]


@pytest.mark.asyncio
async def test_login_invalid_user_id(async_client):
    """测试用户ID错误情况"""
    response = await async_client.post(
        "/auth/login",
        json={"user_id": "9999999", "password": "password123", "role": "student"}
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    data = response.json()
    assert "detail" in data
    assert "不存在" in data["detail"]


@pytest.mark.asyncio
async def test_login_invalid_password(async_client):
    """测试密码错误情况"""
    response = await async_client.post(
        "/auth/login",
        json={"user_id": "2023001", "password": "wrong_password", "role": "student"}
    )

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    data = response.json()
    assert "detail" in data
    assert "密码错误" in data["detail"]


if __name__ == "__main__":
    import pytest

    pytest.main(["-xvs", __file__])