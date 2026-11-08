from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class SessionModel(BaseModel):
    id: str
    userId: str
    token: str
    ipAddress: str
    userAgent: str
    createdAt: datetime
    updatedAt: datetime
    expiresAt: datetime


class UserModel(BaseModel):
    id: str
    name: str
    email: EmailStr
    emailVerified: bool
    image: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime


class Ctx(BaseModel):
    user: UserModel
    session: SessionModel
