from pydantic import BaseModel, EmailStr, constr
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: constr(min_length=8)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: constr(min_length=8)

class UserProfile(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    active_loans_count: int
    total_loans_count: int

    class Config:
        from_attributes = True

class User(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    active_loans_count: Optional[int] = 0
    is_verified: bool = True
    role: str = "user"

    class Config:
        from_attributes = True

class GenreBase(BaseModel):
    name: str

class Genre(GenreBase):
    id: int

    class Config:
        from_attributes = True

class BookBase(BaseModel):
    title: str
    author: str
    isbn: str
    description: str
    cover_image: Optional[str] = None
    published_year: int
    publisher: str
    available_copies: int
    total_copies: int

class BookCreate(BookBase):
    genre_ids: List[int]

class Book(BookBase):
    id: int
    created_at: datetime
    genres: List[Genre]
    available: bool = True

    class Config:
        from_attributes = True

class ReviewBase(BaseModel):
    rating: float
    comment: str

class ReviewCreate(ReviewBase):
    book_id: int

class Review(ReviewBase):
    id: int
    user_id: int
    book_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class BookLoanBase(BaseModel):
    book_id: int

class BookLoanCreate(BookLoanBase):
    pass

class BookLoan(BookLoanBase):
    id: int
    user_id: int
    borrowed_date: datetime
    due_date: datetime
    returned_date: Optional[datetime]
    is_returned: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class LibrarySettings(BaseModel):
    library_name: str = "Libra Mind Library"
    admin_email: Optional[EmailStr] = None
    max_books_per_user: int = 5
    loan_period_days: int = 14
    allow_reservations: bool = True
    auto_renewals_enabled: bool = False
    two_factor_required: bool = False
    force_password_reset_days: int = 90
    log_admin_activity: bool = True
    session_timeout_minutes: int = 30
    email_notifications_enabled: bool = True
    notification_settings: dict = {
        "due_date": True,
        "overdue": True,
        "availability": True,
        "news": False
    }
    reminder_days: int = 3

    class Config:
        from_attributes = True

class UpdateLibrarySettings(BaseModel):
    library_name: Optional[str] = None
    admin_email: Optional[EmailStr] = None
    max_books_per_user: Optional[int] = None
    loan_period_days: Optional[int] = None
    allow_reservations: Optional[bool] = None
    auto_renewals_enabled: Optional[bool] = None
    two_factor_required: Optional[bool] = None
    force_password_reset_days: Optional[int] = None
    log_admin_activity: Optional[bool] = None
    session_timeout_minutes: Optional[int] = None
    email_notifications_enabled: Optional[bool] = None
    notification_settings: Optional[dict] = None
    reminder_days: Optional[int] = None 