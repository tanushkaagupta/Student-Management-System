"""Student router providing CRUD operations."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import database, models, schemas

router = APIRouter(prefix="/students", tags=["students"])

# Dependency
get_db = database.get_db

@router.post("/", response_model=schemas.StudentOut, status_code=status.HTTP_201_CREATED)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    # check duplicate student_id
    existing = db.query(models.Student).filter(models.Student.student_id == student.student_id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Student ID already exists")
    db_student = models.Student(**student.model_dump())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

@router.get("/", response_model=List[schemas.StudentOut])
def list_students(skip: int = 0, limit: int = 100, search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Student)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (models.Student.full_name.ilike(search_term)) |
            (models.Student.student_id.ilike(search_term)) |
            (models.Student.email.ilike(search_term))
        )
    students = query.offset(skip).limit(limit).all()
    return students

@router.get("/{student_id}", response_model=schemas.StudentOut)
def get_student(student_id: str, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    return student

@router.put("/{student_id}", response_model=schemas.StudentOut)
def update_student(student_id: str, student_update: schemas.StudentUpdate, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    update_data = student_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(student, key, value)
    db.commit()
    db.refresh(student)
    return student

@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(student_id: str, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    db.delete(student)
    db.commit()
    return None
