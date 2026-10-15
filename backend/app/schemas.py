from pydantic import BaseModel, EmailStr, Field, model_validator
from pydantic.config import ConfigDict
from datetime import date, datetime
from typing import Optional

class StudentBase(BaseModel):
    student_id: str = Field(..., min_length=1)
    full_name: str = Field(..., min_length=1)
    date_of_birth: date
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None

    @model_validator(mode='after')
    def at_least_one_contact(cls, values):
        email = values.email
        phone = values.phone
        if not email and not phone:
            raise ValueError('At least one of email or phone must be provided')
        return values

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    full_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None

    @model_validator(mode='after')
    def at_least_one_contact(cls, values):
        email = values.email
        phone = values.phone
        if not email and not phone:
            raise ValueError('At least one of email or phone must be provided')
        return values

class StudentOut(StudentBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)
