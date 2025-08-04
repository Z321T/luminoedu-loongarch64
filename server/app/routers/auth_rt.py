from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.schemas.auth_sch import LoginForm, Token
from app.services.auth_svc import login_for_access_token

router = APIRouter(tags=["登录认证"])

@router.post("/login", response_model=Token)
async def login(form_data: LoginForm):
    """
    用户登录接口，根据ID前缀自动识别用户类型，验证用户身份并返回JWT访问令牌

    - 学生ID应以S开头，如S12345
    - 教师ID应以T开头，如T67890
    - 管理员ID应以A开头，如A00001
    """
    return await login_for_access_token(
        user_id=form_data.user_id,
        password=form_data.password,
    )

@router.post("/token", response_model=Token)
async def login_oauth(form_data: OAuth2PasswordRequestForm = Depends()):
    """OAuth2标准登录端点，用于Swagger UI测试"""
    return await login_for_access_token(
        user_id=form_data.username,  # OAuth2表单使用username字段
        password=form_data.password,
    )