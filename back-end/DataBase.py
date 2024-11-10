import psycopg2
from psycopg2 import Error
from datetime import datetime
import bcrypt
import random

# ///////////////////////////////////
# GLOBAL DICTIONARY OF EXISTING ID'S
# ///////////////////////////////////

# CLUB ID'S
global_club_id = 0

# USER ID'S
global_user_id = 0

# CLUB MEMBER ID'S
global_club_member_id = 0

# POST ID'S
global_post_id = 0

# TAG ID'S
global_tag_id = 0

def generate_club_id():
    global global_club_id
    result = str(global_club_id).zfill(7)
    result = f'{global_club_id:07d}'
    result = '{:07d}'.format(global_club_id)

    global_club_id += 1

    return result 

def generate_user_id():
    global global_user_id
    result = str(global_user_id).zfill(7)
    result = f'{global_user_id:07d}'
    result = '{:07d}'.format(global_user_id)

    global_user_id += 1

    return result 

def generate_club_member_id():
    global global_club_member_id
    result = str(global_club_member_id).zfill(7)
    result = f'{global_club_member_id:07d}'
    result = '{:07d}'.format(global_club_member_id)

    global_club_member_id += 1

    return result 

def generate_post_id():
    global global_post_id
    result = str(global_post_id).zfill(7)
    result = f'{global_post_id:07d}'
    result = '{:07d}'.format(global_post_id)

    global_post_id += 1

    return result 

def generate_tag_id():
    global global_tag_id
    result = str(global_tag_id).zfill(7)
    result = f'{global_tag_id:07d}'
    result = '{:07d}'.format(global_tag_id)

    global_tag_id += 1

    return result 

# ///////////////////////////////////
# ///////////////////////////////////
# ///////////////////////////////////







# /////////////////////////////////////////////////////////////////////////////////////////////////////
# ////////////////////////////////////   DATABASE INITIALIZATION   ////////////////////////////////////
# /////////////////////////////////////////////////////////////////////////////////////////////////////


def connect_to_db():
    try:
        connection = psycopg2.connect(
            database="club_database",
            user="postgres",
            password="30020201$/$",
            host="localhost",
            port="5432"
        )
        return connection
    except Error as e:
        print(f"Error connecting to PostgreSQL: {e}")
        return None

def encode_file(file_path):
    """Convert file to binary data"""
    try:
        with open(file_path, 'rb') as file:
            binary_data = file.read()
        return binary_data
    except Exception as e:
        print(f"Error encoding file: {e}")
        return None

def create_tables(connection):
    try:
        cursor = connection.cursor()
        
        # Create users table (unchanged)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                uid VARCHAR(7) PRIMARY KEY,
                rcs_id VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(255) NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                firstname VARCHAR(100),
                lastname VARCHAR(100),
                graduation_year INTEGER,
                major VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP,
                profile_image VARCHAR(255),
                is_admin BOOLEAN
            );
        """)
        
        # Create clubs table (unchanged)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS clubs (
                cid VARCHAR(7) PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                description TEXT,
                logo_url VARCHAR(255),
                banner_url VARCHAR(255),
                meeting_location VARCHAR(255),
                meeting_time VARCHAR(100),
                contact_email VARCHAR(255),
                website_url VARCHAR(255),
                instagram_handle VARCHAR(100),
                discord_link VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT TRUE
            );
        """)
        
        # Create tags table (unchanged)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS tags (
                tid VARCHAR(7) PRIMARY KEY,
                name VARCHAR(50) UNIQUE NOT NULL
            );
        """)
        
        # Create club_tags table (unchanged)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS club_tags (
                cid VARCHAR(7) REFERENCES clubs(cid),
                tid VARCHAR(7) REFERENCES tags(tid),
                PRIMARY KEY (cid, tid)
            );
        """)
        
        # Modified club_members table - make cmid the primary key
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS club_members (
                cmid VARCHAR(7) PRIMARY KEY,
                cid VARCHAR(7) REFERENCES clubs(cid),
                uid VARCHAR(7) REFERENCES users(uid),
                UNIQUE (cid, uid)
            );
        """)
        
        # Create posts table (unchanged)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS posts (
                pid VARCHAR(7) PRIMARY KEY,
                cid VARCHAR(7) REFERENCES clubs(cid),
                title VARCHAR(255) NOT NULL,
                description TEXT,
                image_data BYTEA,
                video_data BYTEA,
                upvote INTEGER DEFAULT 0,
                downvote INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        # Modified user_notifications table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_notifications (
                pid VARCHAR(7) REFERENCES posts(pid),
                cmid VARCHAR(7) REFERENCES club_members(cmid),
                PRIMARY KEY (pid, cmid)
            );
        """)

        # Modified comments table - fixed syntax and made cmid a foreign key
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS comments (
                pid VARCHAR(7) REFERENCES posts(pid),
                cmid VARCHAR(7) REFERENCES club_members(cmid),
                upvotes INTEGER DEFAULT 0,
                downvotes INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (pid)
            );
        """)

        # Insert predefined tags if they don't exist
        predefined_tags = [
            {"tid": "0000001", "name": "Technology"},
            {"tid": "0000002", "name": "Art"},
            {"tid": "0000003", "name": "Sports"},
            {"tid": "0000004", "name": "Science"},
            {"tid": "0000005", "name": "Literature"},
            {"tid": "0000006", "name": "Music"},
            {"tid": "0000007", "name": "Social"},
        ]

        for tag in predefined_tags:
            cursor.execute("""
                INSERT INTO tags (tid, name)
                VALUES (%s, %s)
                ON CONFLICT (name) DO NOTHING
            """, (tag["tid"], tag["name"]))

        connection.commit()
        print("Tables created successfully")
        
    except Error as e:
        print(f"Error creating tables: {e}")
        connection.rollback()
    finally:
        if cursor:
            cursor.close()




# /////////////////////////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////   DATABASE CONNECTION     ////////////////////////////////////
# /////////////////////////////////////////////////////////////////////////////////////////////////////

def main():
    connection = connect_to_db()
    if not connection:
        return

    try:
        # Create all necessary tables
        create_tables(connection)
       
    except Error as e:
        print(f"Error: {e}")

    finally:
        if connection:
            connection.close()


if __name__ == "__main__":
    main()
