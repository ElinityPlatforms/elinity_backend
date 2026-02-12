
import os
import httpx
import asyncio
from dotenv import load_dotenv

load_dotenv()

async def test_model(model_name):
    api_key = os.getenv("OPENROUTER_API_KEY")
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model_name,
        "messages": [{"role": "user", "content": "Say hello if you are working!"}]
    }
    
    print(f"Testing model: {model_name}...")
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(url, json=payload, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                print(f"Success: {data['choices'][0]['message']['content']}")
            else:
                print(f"Error {resp.status_code}: {resp.text}")
    except Exception as e:
        print(f"Exception: {e}")

async def main():
    await test_model("meta-llama/llama-3.3-70b-instruct:free")
    await test_model("google/gemma-3-27b-it:free")

if __name__ == "__main__":
    asyncio.run(main())
