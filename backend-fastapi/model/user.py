from database_engine import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, Text
from typing import Optional


class User(Base):
    __tablename__ = "users"

    user_id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )
    user_name: Mapped[str] = mapped_column(String, nullable=False)
    account: Mapped[str] = mapped_column(String(11), nullable=False)
    password: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String)
    interest: Mapped[Optional[str]] = mapped_column(Text)
    user_pic: Mapped[Optional[str]] = mapped_column(String)
