from sqlalchemy.ext.asyncio import create_async_engine, AsyncAttrs, async_sessionmaker
from contextlib import asynccontextmanager
from sqlalchemy.orm.decl_api import DeclarativeBase
from dotenv import load_dotenv
import os


load_dotenv()
mysql_username: str | None = os.getenv('MYSQL_USERNAME')
mysql_password: str | None = os.getenv('MYSQL_PASSWORD')

if not mysql_username or not mysql_password:
    raise ValueError("MYSQL_USERNAME 或 MYSQLPASSWORD 为空，请在.env配置")


class Base(DeclarativeBase, AsyncAttrs):
    pass


engine = create_async_engine(
    f'mysql+asyncmy://{mysql_username}:{mysql_password}@127.0.0.1:3306/meeting'
)
async_session = async_sessionmaker(bind=engine)


@asynccontextmanager
async def get_db():
    db = async_session()
    try:
        yield db
    finally:
        await db.close()
