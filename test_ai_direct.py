import asyncio
import os
from dotenv import load_dotenv
from services.ai_service import AIService

async def test_ai():
    load_dotenv()
    print("Testing AI connectivity...")
    ai = AIService()
    resp = await ai.chat([
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello, are you online?"}
    ])
    print(f"AI Response: {resp}")

if __name__ == "__main__":
    asyncio.run(test_ai())
