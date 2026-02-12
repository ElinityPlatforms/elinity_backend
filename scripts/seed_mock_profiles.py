import requests
import json
import random

import os

BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8010")

# Mock Data for various categories
MOCK_USERS = [
    {
        "email": "sarah.romantic@example.com",
        "password": "Password123!",
        "personal_info": {
            "first_name": "Sarah",
            "last_name": "Valentine",
            "age": 28,
            "gender": "female",
            "location": "New York, NY",
            "occupation": "Art Curator",
            "education": "Master of Fine Arts"
        },
        "interests_hobbies": {
            "interests": ["Contemporary Art", "Wine Tasting", "Stargazing", "Poetry"],
            "hobbies": ["Painting", "Yoga", "Blogging"]
        },
        "values_goals": {
            "values": ["Authenticity", "Emotional Depth", "Kindness"],
            "personal_goals": ["Find a soulmate", "Travel to Florence", "Learn Italian"],
            "professional_goals": ["Curate a major exhibition"],
            "beliefs": "Everything happens for a reason."
        },
        "profile_pic": "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        "email": "alex.traveler@example.com",
        "password": "Password123!",
        "personal_info": {
            "first_name": "Alex",
            "last_name": "Nomad",
            "age": 32,
            "gender": "male",
            "location": "Austin, TX",
            "occupation": "Travel Photographer",
            "education": "Bachelor of Communications"
        },
        "interests_hobbies": {
            "interests": ["Adventure Travel", "Street Food", "Hiking", "Sustainable Living"],
            "hobbies": ["Rock Climbing", "Playing Guitar", "Cooking"]
        },
        "values_goals": {
            "values": ["Freedom", "Curiosity", "Sustainability"],
            "personal_goals": ["Visit 50 countries", "Run a marathon", "Build a tiny house"],
            "professional_goals": ["Publish a travel book"],
            "beliefs": "Life is a journey, not a destination."
        },
        "profile_pic": "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        "email": "david.tech@example.com",
        "password": "Password123!",
        "personal_info": {
            "first_name": "David",
            "last_name": "Silicon",
            "age": 35,
            "gender": "male",
            "location": "San Francisco, CA",
            "occupation": "AI Researcher",
            "education": "PhD in Computer Science"
        },
        "interests_hobbies": {
            "interests": ["Artificial Intelligence", "Quantum Physics", "Chess", "Cybernetics"],
            "hobbies": ["Coding Open Source", "Reading Sci-Fi", "Strategy Games"]
        },
        "values_goals": {
            "values": ["Innovation", "Logic", "Efficiency"],
            "personal_goals": ["Publish a groundbreaking paper", "Master Go", "Launch a startup"],
            "professional_goals": ["Win a Turing Award"],
            "beliefs": "Technological progress is key to human flourishing."
        },
        "profile_pic": "https://randomuser.me/api/portraits/men/85.jpg"
    }
]

import time

def seed_user(user_data):
    print(f"--- Seeding User: {user_data['email']} ---")
    
    # 1. Register
    reg_payload = {
        "email": user_data["email"],
        "password": user_data["password"]
    }
    response = requests.post(f"{BASE_URL}/auth/register", json=reg_payload, timeout=30)
    time.sleep(1)
    if response.status_code == 200:
        print("Successfully registered")
        token_data = response.json()
    elif response.status_code == 400 and "already registered" in response.text:
        print("User already exists, logging in...")
        login_payload = {
            "email": user_data["email"],
            "password": user_data["password"]
        }
        response = requests.post(f"{BASE_URL}/auth/login", json=login_payload, timeout=30)
        time.sleep(1)
        token_data = response.json()
    else:
        print(f"Failed to register/login: {response.status_code} - {response.text}")
        return

    headers = {"Authorization": f"Bearer {token_data['access_token']}"}

    # 2. Update Personal Info
    response = requests.put(f"{BASE_URL}/users/me/personal-info", json=user_data["personal_info"], headers=headers, timeout=30)
    time.sleep(1)
    if response.status_code == 200:
        print("Updated Personal Info")
    else:
        print(f"Failed to update Personal Info: {response.status_code} - {response.text}")

    # 3. Update Interests and Hobbies
    response = requests.put(f"{BASE_URL}/users/me/interests-and-hobbies", json=user_data["interests_hobbies"], headers=headers, timeout=30)
    time.sleep(1)
    if response.status_code == 200:
        print("Updated Interests and Hobbies")
    else:
        print(f"Failed to update Interests: {response.status_code} - {response.text}")

    # 4. Update Values and Goals
    response = requests.put(f"{BASE_URL}/users/me/values-beliefs-and-goals", json=user_data["values_goals"], headers=headers, timeout=30)
    time.sleep(1)
    if response.status_code == 200:
        print("Updated Values and Goals")
    else:
        print(f"Failed to update Values: {response.status_code} - {response.text}")

    # 5. Add Profile Picture
    pic_payload = {"url": user_data["profile_pic"]}
    response = requests.post(f"{BASE_URL}/users/me/profile-picture", json=pic_payload, headers=headers, timeout=30)
    time.sleep(1)
    if response.status_code in [200, 201]:
        print("Added Profile Picture")
    else:
        print(f"Failed to add Profile Picture: {response.status_code} - {response.text}")

    print(f"Finished seeding {user_data['email']}\n")

if __name__ == "__main__":
    for user in MOCK_USERS:
        seed_user(user)
    print("Done!")
