import os
import httpx
import asyncio
import json

API_KEY = "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"

async def test_nvidia_chat():
    url = "https://integrate.api.nvidia.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "meta/llama-3.1-405b-instruct",
        "messages": [{"role": "user", "content": "Hello NVIDIA! This is a test from Elinity AI. Please respond if you are active."}],
        "temperature": 0.2,
        "max_tokens": 100
    }
    
    print("Testing NVIDIA Chat API...")
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, headers=headers)
            if response.status_code == 200:
                data = response.json()
                print("✅ SUCCESS: Received response from NVIDIA Chat.")
                print(f"Response: {data['choices'][0]['message']['content']}")
            else:
                print(f"❌ FAILED: Status Code {response.status_code}")
                print(f"Error: {response.text}")
        except Exception as e:
            print(f"❌ ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(test_nvidia_chat())
