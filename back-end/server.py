from fastapi import FastAPI, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import bcrypt
import psycopg2
from psycopg2.extras import RealDictCursor
from DataBase import connect_to_db  # Import your existing database connection

app = FastAPI()

# Pydantic models for request/response validation
class UserCreate(BaseModel):
    rcs_id: str
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    graduation_year: Optional[int] = None
    major: Optional[str] = None

class ClubCreate(BaseModel):
    name: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None
    meeting_location: Optional[str] = None
    meeting_time: Optional[str] = None
    contact_email: Optional[str] = None
    website_url: Optional[str] = None
    instagram_handle: Optional[str] = None
    discord_link: Optional[str] = None

class PostCreate(BaseModel):
    cid: str
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    event_time: Optional[datetime] = None

class ClubMemberCreate(BaseModel):
    cid: str
    uid: str
    role: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Database dependency
async def get_db():
    conn = connect_to_db()
    try:
        yield conn
    finally:
        conn.close()

# Login endpoint
@app.post("/login")
async def login(login_data: LoginRequest, db: psycopg2.extensions.connection = Depends(get_db)):
    cursor = db.cursor(cursor_factory=RealDictCursor)
    try:
        # Get user by email
        cursor.execute(
            "SELECT * FROM users WHERE email = %s",
            (login_data.email,)
        )
        user = cursor.fetchone()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Verify password
        if not bcrypt.checkpw(
            login_data.password.encode('utf-8'),
            user['password_hash'].encode('utf-8')
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect password"
            )
            
        return {"message": "Login successful", "user": user}
        
    finally:
        cursor.close()

# Get all clubs
@app.get("/clubs")
async def get_clubs(db: psycopg2.extensions.connection = Depends(get_db)):
    cursor = db.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute("SELECT * FROM clubs WHERE is_active = TRUE")
        clubs = cursor.fetchall()
        return clubs
    finally:
        cursor.close()

# Get clubs by tags
@app.get("/clubs/tags/{tag_id}")
async def get_clubs_by_tag(
    tag_id: str,
    db: psycopg2.extensions.connection = Depends(get_db)
):
    cursor = db.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute("""
            SELECT c.* FROM clubs c
            JOIN club_tags ct ON c.cid = ct.cid
            WHERE ct.tid = %s AND c.is_active = TRUE
        """, (tag_id,))
        clubs = cursor.fetchall()
        return clubs
    finally:
        cursor.close()

# Get club posts
@app.get("/clubs/{club_id}/posts")
async def get_club_posts(
    club_id: str,
    db: psycopg2.extensions.connection = Depends(get_db)
):
    cursor = db.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute(
            "SELECT * FROM posts WHERE cid = %s ORDER BY created_at DESC",
            (club_id,)
        )
        posts = cursor.fetchall()
        return posts
    finally:
        cursor.close()

# Get club members
@app.get("/clubs/{club_id}/members")
async def get_club_members(
    club_id: str,
    db: psycopg2.extensions.connection = Depends(get_db)
):
    cursor = db.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute("""
            SELECT cm.*, u.first_name, u.last_name, u.rcs_id
            FROM club_members cm
            JOIN users u ON cm.uid = u.uid
            WHERE cm.cid = %s
        """, (club_id,))
        members = cursor.fetchall()
        return members
    finally:
        cursor.close()

# Get club homepage with 10 most recent posts
@app.get("/clubs/{club_id}/homepage")
async def get_club_homepage(
    club_id: str,
    db: psycopg2.extensions.connection = Depends(get_db)
):
    cursor = db.cursor(cursor_factory=RealDictCursor)
    try:
        # Get club info
        cursor.execute("SELECT * FROM clubs WHERE cid = %s", (club_id,))
        club = cursor.fetchone()
        
        if not club:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Club not found"
            )
        
        # Get 10 most recent posts
        cursor.execute("""
            SELECT * FROM posts 
            WHERE cid = %s 
            ORDER BY created_at DESC 
            LIMIT 10
        """, (club_id,))
        recent_posts = cursor.fetchall()
        
        return {
            "club": club,
            "recent_posts": recent_posts
        }
    finally:
        cursor.close()

# Create new user
@app.post("/users")
async def create_user(
    user: UserCreate,
    db: psycopg2.extensions.connection = Depends(get_db)
):
    cursor = db.cursor(cursor_factory=RealDictCursor)
    try:
        # Hash password
        password_bytes = user.password.encode('utf-8')
        salt = bcrypt.gensalt()
        password_hash = bcrypt.hashpw(password_bytes, salt)
        
        # Generate user ID using your existing function
        from DataBase import generate_user_id
        uid = generate_user_id()
        
        cursor.execute("""
            INSERT INTO users (uid, rcs_id, email, password_hash, 
                             first_name, last_name, graduation_year, major)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (
            uid, user.rcs_id, user.email, password_hash.decode('utf-8'),
            user.first_name, user.last_name, user.graduation_year, user.major
        ))
        
        db.commit()
        new_user = cursor.fetchone()
        return new_user
    except psycopg2.Error as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    finally:
        cursor.close()

# Create new club
@app.post("/clubs")
async def create_club(
    club: ClubCreate,
    db: psycopg2.extensions.connection = Depends(get_db)
):
    cursor = db.cursor(cursor_factory=RealDictCursor)
    try:
        from DataBase import generate_club_id
        cid = generate_club_id()
        
        cursor.execute("""
            INSERT INTO clubs (cid, name, description, logo_url, banner_url,
                             meeting_location, meeting_time, contact_email,
                             website_url, instagram_handle, discord_link)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (
            cid, club.name, club.description, club.logo_url, club.banner_url,
            club.meeting_location, club.meeting_time, club.contact_email,
            club.website_url, club.instagram_handle, club.discord_link
        ))
        
        db.commit()
        new_club = cursor.fetchone()
        return new_club
    except psycopg2.Error as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    finally:
        cursor.close()

@app.post("/clubs")
async def create_club(
    club: ClubCreate,
    db: psycopg2.extensions.connection = Depends(get_db)
):
    print("Attempting to create club:", club.dict())  # Add debug logging
    cursor = db.cursor(cursor_factory=RealDictCursor)
    try:
        from DataBase import generate_club_id
        cid = generate_club_id()
        print("Generated CID:", cid)  # Add debug logging
        
        query = """
            INSERT INTO clubs (cid, name, description, logo_url, banner_url,
                             meeting_location, meeting_time, contact_email,
                             website_url, instagram_handle, discord_link)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """
        values = (
            cid, club.name, club.description, club.logo_url, club.banner_url,
            club.meeting_location, club.meeting_time, club.contact_email,
            club.website_url, club.instagram_handle, club.discord_link
        )
        print("Executing query with values:", values)  # Add debug logging
        
        cursor.execute(query, values)
        db.commit()
        new_club = cursor.fetchone()
        return new_club
    except Exception as e:  # Catch all exceptions for debugging
        print(f"Error creating club: {str(e)}")  # Add debug logging
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    finally:
        cursor.close()

# Add club member
@app.post("/clubs/members")
async def add_club_member(
    member: ClubMemberCreate,
    db: psycopg2.extensions.connection = Depends(get_db)
):
    cursor = db.cursor(cursor_factory=RealDictCursor)
    try:
        from DataBase import generate_club_member_id
        cmid = generate_club_member_id()
        
        cursor.execute("""
            INSERT INTO club_members (cmid, cid, uid, role)
            VALUES (%s, %s, %s, %s)
            RETURNING *
        """, (cmid, member.cid, member.uid, member.role))
        
        db.commit()
        new_member = cursor.fetchone()
        return new_member
    except psycopg2.Error as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    finally:
        cursor.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)