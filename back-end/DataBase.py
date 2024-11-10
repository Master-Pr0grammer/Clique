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



# //////////////

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
                event_time TIMESTAMP,
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
        
        connection.commit()
        print("Tables created successfully")
        
    except Error as e:
        print(f"Error creating tables: {e}")
        connection.rollback()
    finally:
        if cursor:
            cursor.close()

# def insert_user(connection, user_data):
#     """Insert a new user with hashed password"""
#     try:
#         cursor = connection.cursor()
        
#         # Hash the password
#         password_bytes = user_data['password'].encode('utf-8')
#         salt = bcrypt.gensalt()
#         password_hash = bcrypt.hashpw(password_bytes, salt)
        
#         insert_query = """
#             INSERT INTO users (
#                 rcs_id, email, password_hash, first_name, 
#                 last_name, graduation_year, major
#             ) VALUES (
#                 %s, %s, %s, %s, %s, %s, %s
#             ) RETURNING uid;
#         """
        
#         cursor.execute(insert_query, (
#             user_data['rcs_id'],
#             user_data['email'],
#             password_hash.decode('utf-8'),
#             user_data.get('first_name'),
#             user_data.get('last_name'),
#             user_data.get('graduation_year'),
#             user_data.get('major')
#         ))
        
#         user_id = cursor.fetchone()[0]
#         connection.commit()
#         print(f"User inserted successfully with ID: {user_id}")
#         return user_id
        
#     except Error as e:
#         print(f"Error inserting user: {e}")
#         connection.rollback()
#         return None
#     finally:
#         if cursor:
#             cursor.close()

# def insert_club(connection, club_data):
#     """Insert a new club"""
#     try:
#         cursor = connection.cursor()
        
#         insert_query = """
#             INSERT INTO clubs (
#                 name, description, logo_url, banner_url, 
#                 meeting_location, meeting_time, contact_email, 
#                 website_url, instagram_handle, discord_link
#             ) VALUES (
#                 %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
#             ) RETURNING cid;
#         """
        
#         cursor.execute(insert_query, (
#             club_data['name'],
#             club_data['description'],
#             club_data.get('logo_url'),
#             club_data.get('banner_url'),
#             club_data.get('meeting_location'),
#             club_data.get('meeting_time'),
#             club_data.get('contact_email'),
#             club_data.get('website_url'),
#             club_data.get('instagram_handle'),
#             club_data.get('discord_link')
#         ))
        
#         club_id = cursor.fetchone()[0]
#         connection.commit()
#         print(f"Club inserted successfully with ID: {club_id}")
#         return club_id
        
#     except Error as e:
#         print(f"Error inserting club: {e}")
#         connection.rollback()
#         return None
#     finally:
#         if cursor:
#             cursor.close()

# def insert_tag(connection, tag_name):
#     """Insert a new tag or return existing tag ID"""
#     try:
#         cursor = connection.cursor()
        
#         insert_query = """
#             INSERT INTO tags (name)
#             VALUES (%s)
#             ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
#             RETURNING tag_id;
#         """
        
#         cursor.execute(insert_query, (tag_name,))
#         tag_id = cursor.fetchone()[0]
#         connection.commit()
#         return tag_id
        
#     except Error as e:
#         print(f"Error inserting tag: {e}")
#         connection.rollback()
#         return None
#     finally:
#         if cursor:
#             cursor.close()

# def link_club_tag(connection, club_id, tag_id):
#     """Link a club with a tag"""
#     try:
#         cursor = connection.cursor()
        
#         insert_query = """
#             INSERT INTO club_tags (cid, tag_id)
#             VALUES (%s, %s)
#             ON CONFLICT (cid, tag_id) DO NOTHING;
#         """
        
#         cursor.execute(insert_query, (club_id, tag_id))
#         connection.commit()
        
#     except Error as e:
#         print(f"Error linking club and tag: {e}")
#         connection.rollback()
#     finally:
#         if cursor:
#             cursor.close()

# def add_club_member(connection, club_id, user_id, role='member'):
#     """Add a user as a member of a club with specified role"""
#     try:
#         cursor = connection.cursor()
        
#         # Validate role
#         valid_roles = ['admin', 'officer', 'member']
#         if role.lower() not in valid_roles:
#             raise ValueError(f"Invalid role. Must be one of: {', '.join(valid_roles)}")
        
#         insert_query = """
#             INSERT INTO club_members (cid, uid, role)
#             VALUES (%s, %s, %s)
#             ON CONFLICT (cid, uid) DO UPDATE SET role = EXCLUDED.role;
#         """
        
#         cursor.execute(insert_query, (club_id, user_id, role.lower()))
#         connection.commit()
#         print(f"Added user {user_id} to club {club_id} as {role}")
#         return True
        
#     except Error as e:
#         print(f"Error adding club member: {e}")
#         connection.rollback()
#         return False
#     finally:
#         if cursor:
#             cursor.close()

# def insert_club_event(connection, event_data):
#     """Insert a new club event"""
#     try:
#         cursor = connection.cursor()
        
#         # Validate required fields
#         required_fields = ['cid', 'title', 'event_time']
#         for field in required_fields:
#             if field not in event_data:
#                 raise ValueError(f"Missing required field: {field}")
        
#         insert_query = """
#             INSERT INTO club_events (
#                 cid, title, description, location, event_time
#             ) VALUES (
#                 %s, %s, %s, %s, %s
#             ) RETURNING event_id;
#         """
        
#         cursor.execute(insert_query, (
#             event_data['cid'],
#             event_data['title'],
#             event_data.get('description'),
#             event_data.get('location'),
#             event_data['event_time']
#         ))
        
#         event_id = cursor.fetchone()[0]
#         connection.commit()
#         print(f"Event inserted successfully with ID: {event_id}")
#         return event_id
        
#     except Error as e:
#         print(f"Error inserting event: {e}")
#         connection.rollback()
#         return None
#     finally:
#         if cursor:
#             cursor.close()

# def insert_post(connection, post_data):
#     """
#     Insert a new post with binary image and/or video data
    
#     Args:
#         connection: Database connection
#         post_data: Dictionary containing:
#             - cid: Club ID (required)
#             - title: Post title (required)
#             - description: Post description (optional)
#             - image_data: Binary image data (optional)
#             - video_data: Binary video data (optional)
#             - location: Event location (optional)
#             - event_time: Event datetime (optional)
#     """
#     try:
#         cursor = connection.cursor()
#         post_id = generate_post_id()
        
#         insert_query = """
#             INSERT INTO posts (
#                 pid, cid, title, description, image_data, 
#                 video_data, location, event_time
#             ) VALUES (
#                 %s, %s, %s, %s, %s, %s, %s, %s
#             ) RETURNING pid;
#         """
        
#         # Ensure required fields are present
#         if 'cid' not in post_data or 'title' not in post_data:
#             raise ValueError("Missing required fields: 'cid' and 'title' are required")
            
#         cursor.execute(insert_query, (
#             post_id,
#             post_data['cid'],
#             post_data['title'],
#             post_data.get('description'),
#             post_data.get('image_data'),  # Direct binary data
#             post_data.get('video_data'),  # Direct binary data
#             post_data.get('location'),
#             post_data.get('event_time')
#         ))
        
#         returned_id = cursor.fetchone()[0]
#         connection.commit()
#         print(f"Post inserted successfully with ID: {returned_id}")
#         return returned_id
        
#     except (Error, ValueError) as e:
#         print(f"Error inserting post: {e}")
#         connection.rollback()
#         return None
#     finally:
#         if cursor:
#             cursor.close()

def get_post_media(connection, post_id, media_type='image'):
    """
    Retrieve binary media data for a post
    
    Args:
        connection: Database connection
        post_id: ID of the post
        media_type: Either 'image' or 'video'
    """
    try:
        cursor = connection.cursor()
        
        if media_type not in ['image', 'video']:
            raise ValueError("media_type must be either 'image' or 'video'")
            
        query = f"""
            SELECT {media_type}_data FROM posts WHERE pid = %s
        """
        
        cursor.execute(query, (post_id,))
        result = cursor.fetchone()
        
        if result and result[0]:
            return bytes(result[0])
        return None
        
    except (Error, ValueError) as e:
        print(f"Error retrieving post {media_type}: {e}")
        return None
    finally:
        if cursor:
            cursor.close()

def update_post_media(connection, post_id, file_path, media_type='image'):
    """Update the media file for an existing post
    
    Args:
        connection: Database connection
        post_id: ID of the post
        file_path: Path to the new media file
        media_type: Either 'image' or 'video'
    """
    try:
        cursor = connection.cursor()
        
        # Convert new media file to binary
        media_data = encode_file(file_path)
        if not media_data:
            return False
            
        update_query = """
            UPDATE posts 
            SET {} = %s
            WHERE pid = %s
            RETURNING pid;
        """.format('image_data' if media_type == 'image' else 'video_data')
        
        cursor.execute(update_query, (media_data, post_id))
        
        if cursor.fetchone():
            connection.commit()
            print(f"Post {media_type} updated successfully for ID: {post_id}")
            return True
        return False
        
    except Error as e:
        print(f"Error updating post {media_type}: {e}")
        connection.rollback()
        return False
    finally:
        if cursor:
            cursor.close()

# Example usage with RPI-specific data
def main():
    connection = connect_to_db()
    if not connection:
        return

    try:
        # Create all necessary tables
        create_tables(connection)
        
        # # Example RPI club
        # club_data = {
        #     'name': 'RCOS',
        #     'description': 'Rensselaer Center for Open Source - A community of Open Source developers.',
        #     'meeting_location': 'DCC 308',
        #     'meeting_time': 'Tuesday/Friday 4:00 PM - 5:15 PM',
        #     'contact_email': 'coordinators@rcos.io',
        #     'website_url': 'https://rcos.io',
        #     'discord_link': 'https://discord.gg/rcos'
        # }
        
        # # Insert club
        # club_id = insert_club(connection, club_data)
        
        # # Add relevant tags
        # tags = ['Open Source', 'Software Development', 'Programming', 'Technology']
        # for tag_name in tags:
        #     tag_id = insert_tag(connection, tag_name)
        #     if tag_id:
        #         link_club_tag(connection, club_id, tag_id)
        
        # # Example user (student)
        # user_data = {
        #     'rcs_id': 'smithj',
        #     'email': 'smithj@rpi.edu',
        #     'password': 'securepassword123',  # Will be hashed
        #     'first_name': 'John',
        #     'last_name': 'Smith',
        #     'graduation_year': 2025,
        #     'major': 'Computer Science'
        # }
        
        # # Insert user
        # user_id = insert_user(connection, user_data)
        
        # # Add user as club member
        # if user_id and club_id:
        #     add_club_member(connection, club_id, user_id, 'member')
        
        # # Add example event
        # event_data = {
        #     'cid': club_id,
        #     'title': 'RCOS First Meeting',
        #     'description': 'Introduction to RCOS and project presentations',
        #     'location': 'DCC 308',
        #     'event_time': datetime(2024, 1, 23, 16, 0)  # 4:00 PM on Jan 23, 2024
        # }
        
        # event_id = insert_club_event(connection, event_data)

        #        # Example post with both image and video
        # post_data = {
        #     'cid': '0000001',  # Example club ID
        #     'title': 'RCOS Project Showcase',
        #     'description': 'Check out our latest open source projects!',
        #     'image_path': '/path/to/showcase.jpg',  # Local image file path
        #     'video_path': '/path/to/demo.mp4',      # Local video file path
        #     'location': 'DCC 308',
        #     'event_time': datetime.now()
        # }
        
        # # Insert post with media
        # post_id = insert_post(connection, post_data)
        
        # # Retrieve the media files later
        # if post_id:
        #     # Get and save image
        #     image_data = get_post_media(connection, post_id, 'image')
        #     if image_data:
        #         with open('retrieved_showcase.jpg', 'wb') as file:
        #             file.write(image_data)
            
        #     # Get and save video
        #     video_data = get_post_media(connection, post_id, 'video')
        #     if video_data:
        #         with open('retrieved_demo.mp4', 'wb') as file:
        #             file.write(video_data)
                    
        #     # Update media files
        #     update_post_media(connection, post_id, '/path/to/new_showcase.jpg', 'image')
        #     update_post_media(connection, post_id, '/path/to/new_demo.mp4', 'video')

    except Error as e:
        print(f"Error: {e}")
    finally:
        if connection:
            connection.close()


if __name__ == "__main__":
    main()
