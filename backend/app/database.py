from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# SQLite URL - database file in this directory or overridden by STUDENT_DB env var
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
default_db_path = os.path.join(BASE_DIR, '../student.db')
DATABASE_URL = os.getenv('STUDENT_DB', f"sqlite:///{default_db_path}")

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
