from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, Date, Table, Float, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

# Many-to-many relationship table for books and genres
book_genres = Table(
    'book_genres',
    Base.metadata,
    Column('book_id', Integer, ForeignKey('books.id')),
    Column('genre_id', Integer, ForeignKey('genres.id'))
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    borrowed_books = relationship("BookLoan", back_populates="user")
    reviews = relationship("Review", back_populates="user")

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    author = Column(String, index=True)
    isbn = Column(String, unique=True, index=True)
    description = Column(Text)
    cover_image = Column(String)
    published_year = Column(Integer)
    publisher = Column(String)
    available_copies = Column(Integer, default=1)
    total_copies = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_archived = Column(Boolean, default=False)
    
    # Relationships
    genres = relationship("Genre", secondary=book_genres, back_populates="books")
    loans = relationship("BookLoan", back_populates="book")
    reviews = relationship("Review", back_populates="book")

class Genre(Base):
    __tablename__ = "genres"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    
    # Relationships
    books = relationship("Book", secondary=book_genres, back_populates="genres")

class BookLoan(Base):
    __tablename__ = "book_loans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    book_id = Column(Integer, ForeignKey("books.id"))
    borrowed_date = Column(DateTime, default=datetime.utcnow)
    due_date = Column(DateTime)
    returned_date = Column(DateTime, nullable=True)
    is_returned = Column(Boolean, default=False)
    
    # Relationships
    user = relationship("User", back_populates="borrowed_books")
    book = relationship("Book", back_populates="loans")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    book_id = Column(Integer, ForeignKey("books.id"))
    rating = Column(Float)
    comment = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="reviews")
    book = relationship("Book", back_populates="reviews")

class LibrarySettings(Base):
    __tablename__ = "library_settings"

    id = Column(Integer, primary_key=True, index=True)
    library_name = Column(String, default="Libra Mind Library", nullable=False)
    admin_email = Column(String, nullable=True)
    max_books_per_user = Column(Integer, default=5, nullable=False)
    loan_period_days = Column(Integer, default=14, nullable=False)
    allow_reservations = Column(Boolean, default=True, nullable=False)
    auto_renewals_enabled = Column(Boolean, default=False, nullable=False)
    two_factor_required = Column(Boolean, default=False, nullable=False)
    force_password_reset_days = Column(Integer, default=90, nullable=False)
    log_admin_activity = Column(Boolean, default=True, nullable=False)
    session_timeout_minutes = Column(Integer, default=30, nullable=False)
    email_notifications_enabled = Column(Boolean, default=True, nullable=False)
    notification_settings = Column(JSON, default={
        "due_date": True,
        "overdue": True,
        "availability": True,
        "news": False
    }, nullable=False)
    reminder_days = Column(Integer, default=3, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) 