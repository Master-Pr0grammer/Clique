from fastapi import FastAPI, HTTPException, Depends, status, Security
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime, timedelta
import jwt
import bcrypt

from DataBase import (
    connect_to_db,
    insert_user,
    insert_club,
    insert_tag,
    link_club_tag,
    add_club_member,
    insert_club_event
)

app = FastAPI(title="RPI Clubs API")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Modify this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


'''

///////////////// AUTHENTICATION PORTION OF THE APPLICATION. UNCOMMENT WHEN AUTHENTICATION NEEDED ////////////////////

# JWT Configuration
SECRET_KEY = "your-secret-key"  # Change this in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
'''


# Pydantic Models
class UserBase(BaseModel):
    rcs_id: str
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    graduation_year: Optional[int] = None
    major: Optional[str] = None

class UserCreate(UserBase):
    password: str

class ClubBase(BaseModel):
    name: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None
    meeting_location: Optional[str] = None
    meeting_time: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    website_url: Optional[str] = None
    instagram_handle: Optional[str] = None
    discord_link: Optional[str] = None

class EventBase(BaseModel):
    cid: int
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    event_time: datetime

class Token(BaseModel):
    access_token: str
    token_type: str

# Authentication functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        rcs_id: str = payload.get("sub")
        if rcs_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    # Here you would typically query the database to get the user
    # For now, we'll just return the RCS ID
    return rcs_id

# Endpoints
@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    conn = connect_to_db()
    if not conn:
        raise HTTPException(status_code=503, detail="Database connection failed")
    
    try:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT uid, password_hash FROM users WHERE rcs_id = %s",
            (form_data.username,)
        )
        user = cursor.fetchone()
        
        if not user or not bcrypt.checkpw(
            form_data.password.encode('utf-8'),
            user[1].encode('utf-8')
        ):
            raise HTTPException(
                status_code=401,
                detail="Incorrect username or password"
            )
        
        access_token = create_access_token({"sub": form_data.username})
        return {"access_token": access_token, "token_type": "bearer"}
    finally:
        conn.close()

@app.post("/users/", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate):
    conn = connect_to_db()
    if not conn:
        raise HTTPException(status_code=503, detail="Database connection failed")
    
    try:
        user_id = insert_user(conn, user.dict())
        if not user_id:
            raise HTTPException(status_code=400, detail="Could not create user")
        return {"uid": user_id, "message": "User created successfully"}
    finally:
        conn.close()

@app.post("/clubs/", status_code=status.HTTP_201_CREATED)
async def create_club(
    club: ClubBase,
    current_user: str = Depends(get_current_user)
):
    conn = connect_to_db()
    if not conn:
        raise HTTPException(status_code=503, detail="Database connection failed")
    
    try:
        club_id = insert_club(conn, club.dict())
        if not club_id:
            raise HTTPException(status_code=400, detail="Could not create club")
        return {"cid": club_id, "message": "Club created successfully"}
    finally:
        conn.close()

@app.get("/clubs/")
async def get_clubs(
    tag: Optional[str] = None,
    skip: int = 0,
    limit: int = 10
):
    conn = connect_to_db()
    if not conn:
        raise HTTPException(status_code=503, detail="Database connection failed")
    
    try:
        cursor = conn.cursor()
        if tag:
            cursor.execute("""
                SELECT DISTINCT c.* FROM clubs c
                JOIN club_tags ct ON c.cid = ct.cid
                JOIN tags t ON ct.tag_id = t.tag_id
                WHERE t.name = %s AND c.is_active = TRUE
                LIMIT %s OFFSET %s
            """, (tag, limit, skip))
        else:
            cursor.execute("""
                SELECT * FROM clubs
                WHERE is_active = TRUE
                LIMIT %s OFFSET %s
            """, (limit, skip))
        
        clubs = cursor.fetchall()
        return [dict(zip([column[0] for column in cursor.description], club))
                for club in clubs]
    finally:
        conn.close()

@app.post("/clubs/{club_id}/events/", status_code=status.HTTP_201_CREATED)
async def create_event(
    club_id: int,
    event: EventBase,
    current_user: str = Depends(get_current_user)
):
    if event.cid != club_id:
        raise HTTPException(status_code=400, detail="Club ID mismatch")
    
    conn = connect_to_db()
    if not conn:
        raise HTTPException(status_code=503, detail="Database connection failed")
    
    try:
        event_id = insert_club_event(conn, event.dict())
        if not event_id:
            raise HTTPException(status_code=400, detail="Could not create event")
        return {"event_id": event_id, "message": "Event created successfully"}
    finally:
        conn.close()

@app.get("/clubs/{club_id}/events/")
async def get_club_events(
    club_id: int,
    skip: int = 0,
    limit: int = 10
):
    conn = connect_to_db()
    if not conn:
        raise HTTPException(status_code=503, detail="Database connection failed")
    
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT * FROM club_events
            WHERE cid = %s
            ORDER BY event_time
            LIMIT %s OFFSET %s
        """, (club_id, limit, skip))
        
        events = cursor.fetchall()
        return [dict(zip([column[0] for column in cursor.description], event))
                for event in events]
    finally:
        conn.close()

@app.post("/clubs/{club_id}/members/", status_code=status.HTTP_201_CREATED)
async def add_member(
    club_id: int,
    user_id: int,
    role: str = "member",
    current_user: str = Depends(get_current_user)
):
    conn = connect_to_db()
    if not conn:
        raise HTTPException(status_code=503, detail="Database connection failed")
    
    try:
        success = add_club_member(conn, club_id, user_id, role)
        if not success:
            raise HTTPException(status_code=400, detail="Could not add member")
        return {"message": "Member added successfully"}
    finally:
        conn.close()

@app.get("/clubs/{club_id}/members/")
async def get_club_members(
    club_id: int,
    skip: int = 0,
    limit: int = 10
):
    conn = connect_to_db()
    if not conn:
        raise HTTPException(status_code=503, detail="Database connection failed")
    
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT u.uid, u.rcs_id, u.first_name, u.last_name,
                   cm.role, cm.joined_at
            FROM club_members cm
            JOIN users u ON cm.uid = u.uid
            WHERE cm.cid = %s
            LIMIT %s OFFSET %s
        """, (club_id, limit, skip))
        
        members = cursor.fetchall()
        return [dict(zip([column[0] for column in cursor.description], member))
                for member in members]
    finally:
        conn.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)