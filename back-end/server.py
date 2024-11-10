from fastapi import FastAPI, HTTPException, Depends, status, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import bcrypt
import psycopg2
from psycopg2.extras import RealDictCursor
from DataBase import connect_to_db  # Import your existing database connection



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Define the Pydantic model for user creation
class UserCreate(BaseModel):
    rcs_id: str
    email: str
    password: str
    first_name: str
    last_name: str
    graduation_year: int
    major: str
    profile_image: Optional[str] = None  # Optional field for profile image URL

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
    user_email: str
    password: str

class PostCreate(BaseModel):
    club_name: str
    title: str
    description: Optional[str] = None
    image_data: Optional[str] = None
    video_data: Optional[str] = None
    


class ClubTagAddRequest(BaseModel):
    tag_ids: List[str]

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


@app.post("/posts", status_code=status.HTTP_201_CREATED)
async def create_post(
   post: PostCreate,
   db: psycopg2.extensions.connection = Depends(get_db)
):
   try:
       cursor = db.cursor(cursor_factory=RealDictCursor)

       # Look up the club ID based on club_name
       cursor.execute("SELECT cid FROM clubs WHERE name = %s", (post.club_name,))
       club = cursor.fetchone()
       
       if not club:
           raise HTTPException(
               status_code=status.HTTP_404_NOT_FOUND,
               detail="Club not found"
           )

       # Use the found cid for the post
       cid = club['cid']

       # Generate new post ID
       from DataBase import generate_post_id
       pid = generate_post_id()

       cursor.execute("""
           INSERT INTO posts (
               pid,
               cid,
               title,
               description,
               upvote,
               downvote,
               created_at
           ) VALUES (
               %s, %s, %s, %s, %s, %s, 0, 0, CURRENT_TIMESTAMP
           ) RETURNING *
       """, (
           pid,
           cid,
           post.title,
           post.description,
           post.image_data,
           post.video_data
       ))

       db.commit()
       new_post = cursor.fetchone()
       return new_post

   except psycopg2.Error as e:
       db.rollback()
       raise HTTPException(
           status_code=status.HTTP_400_BAD_REQUEST,
           detail=f"Database error: {str(e)}"
       )
   finally:
       cursor.close()


@app.get("/10posts")
async def get_clubs(db: psycopg2.extensions.connection = Depends(get_db)):
    cursor = db.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute("SELECT * FROM posts ORDER BY created_at DESC LIMIT 10")
        posts = cursor.fetchall()

        if not posts:
            return {"message": "No posts found"}

        # Convert image_data to a list format for each post
        for post in posts:
            if post["image_data"]:
                # Assuming image_data is a comma-separated string
                post["image_data"] = post["image_data"].split(",")

        return posts
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

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

# GET http://localhost:8000/clubs/tags?tag_ids=0000001&tag_ids=0000002 format for get request
@app.get("/clubs/tags")
async def get_clubs_by_tags(
    tag_ids: List[str] = Query(...),  # Expecting a list of tag IDs as query parameters
    db: psycopg2.extensions.connection = Depends(get_db)
):
    cursor = db.cursor(cursor_factory=RealDictCursor)
    try:
        # Create a query to find clubs that have all specified tags
        query = """
            SELECT c.* FROM clubs c
            JOIN club_tags ct ON c.cid = ct.cid
            WHERE c.is_active = TRUE
            AND ct.tid = ANY(%s)
            GROUP BY c.cid
            HAVING COUNT(DISTINCT ct.tid) = %s
        """
        cursor.execute(query, (tag_ids, len(tag_ids)))
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

# Create new user endpoint
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
        
        # Insert new user into the database
        cursor.execute("""
            INSERT INTO users (uid, rcs_id, email, password_hash, 
                               firstname, lastname, graduation_year, major, profile_image, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
            RETURNING *
        """, (
            uid, user.rcs_id, user.email, password_hash.decode('utf-8'),
            user.first_name, user.last_name, user.graduation_year, user.major,
            user.profile_image
        ))

        # Fetch and return the newly inserted user data
        new_user = cursor.fetchone()
        db.commit()
        
        return new_user

    except Exception as e:
        db.rollback()
        return {"error": str(e)}
    finally:
        cursor.close()

#Create new club
# would need to do it like this http://localhost:8000/clubs?user_uid=12345
@app.post("/clubs")
async def create_club(
    club: ClubCreate,
    db: psycopg2.extensions.connection = Depends(get_db)
):
    from DataBase import generate_club_member_id
    cursor = db.cursor(cursor_factory=RealDictCursor)
    try:
        # Generate club ID
        from DataBase import generate_club_id
        cid = generate_club_id()

        # Insert the new club into the clubs table
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
        
        cursor.execute(query, values)
        db.commit()
        new_club = cursor.fetchone()

        
        cursor.execute("""
            SELECT uid FROM users
                where email = %s AND password_hash = %s
        """, (club.user_email, club.password))

        result = cursor.fetchone()
        if result:
            uid = result['uid']
            cmid = generate_club_member_id()

            cursor.execute("""
            INSERT INTO club_members (cmid, cid, uid, is_admin)
            VALUES (%s, %s, %s, %s)
            RETURNING *
            """, (cmid, cid, uid, True))  # Set the user as admin
            

        # Create a new club member for the user who created the club (is_admin = True)
        cmid = generate_club_member_id()


        db.commit()
        new_club_member = cursor.fetchone()

        # Return the newly created club and club member (user)
        return {
            "club": new_club,
            "club_member": new_club_member
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating club: {str(e)}"
        )
    finally:
        cursor.close()

@app.post("/clubs/{club_id}/tags")
async def add_tags_to_club(
    club_id: str,  # use club_id from the path
    tag_request: ClubTagAddRequest,
    db: psycopg2.extensions.connection = Depends(get_db)
):
    cursor = db.cursor()
    try:
        # Step 1: Verify each tag ID exists in the tags table
        cursor.execute(
            "SELECT tid FROM tags WHERE tid = ANY(%s)",
            (tag_request.tag_ids,)
        )
        valid_tags = {row[0] for row in cursor.fetchall()}

        # Filter out any tags that don't exist in the tags table
        invalid_tags = set(tag_request.tag_ids) - valid_tags
        if invalid_tags:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid tag IDs: {', '.join(invalid_tags)}"
            )

        # Step 2: Insert valid tags into club_tags, avoiding duplicates
        for tag_id in valid_tags:
            cursor.execute("""
                INSERT INTO club_tags (cid, tid)
                VALUES (%s, %s)
                ON CONFLICT (cid, tid) DO NOTHING
            """, (club_id, tag_id))

        db.commit()
        return {"message": "Tags added successfully"}

    except psycopg2.Error as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    finally:
        cursor.close()

    # Format:
    # "tag_ids": [
    #     "0000001",
    #     "0000002",
    #     "0000003"
    # ]

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