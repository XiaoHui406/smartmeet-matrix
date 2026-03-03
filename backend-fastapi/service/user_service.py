from database_engine import get_db
from model.user import User
from sqlalchemy import select
from typing import Optional


class UserService:
    @staticmethod
    async def get_user_by_id(user_id: int) -> Optional[User]:
        """根据用户ID获取用户信息"""
        async with get_db() as db:
            result = await db.execute(select(User).where(User.user_id == user_id))
            return result.scalar_one_or_none()

    @staticmethod
    async def get_user_interest(user_id: int) -> Optional[str]:
        """获取用户的 interest（兴趣）属性"""
        async with get_db() as db:
            result = await db.execute(
                select(User.interest).where(User.user_id == user_id)
            )
            return result.scalar_one_or_none()
