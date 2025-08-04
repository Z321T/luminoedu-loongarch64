# tortoise数据库连接-mysql
TORTOISE_ORM = {
    'connections': {
            'default': {
                'engine': 'tortoise.backends.mysql',
                'credentials': {
                    'host': 'localhost',
                    'port': '3306',
                    'user': 'root',
                    'password': 'root',
                    'database': 'luminoedu',
                    'charset': 'utf8mb4',
                }
            }
        },
    'apps': {
            'models':{
                'models': [
                    'app.models',
                    'aerich.models'
                ],
                'default_connection': 'default',
            }
        },
    'use_tortoise_orm': True,
    'timezone': 'Asia/Shanghai',
}