import os
import httpx
import asyncio

HF_TOKEN = os.getenv("HF_API_TOKEN")
# The model as the "model" field in OpenAI-style payload
MODEL_ID = "black-forest-labs/FLUX.1-dev"
API_URL = "https://router.huggingface.co/hf-inference/v1/images/generations"

async def test_hf_router_images():
    headers = {
        "Authorization": f"Bearer {HF_TOKEN}",
        "Content-Type": "application/json"
    }
    # OpenAI style payload for images
    payload = {
        "model": MODEL_ID,
        "prompt": "A serene and futuristic digital sanctuary, violet glowing lights, hyper-realistic, 8k resolution",
        "n": 1,
        "size": "1024x1024"
    }

    print(f"Testing HF Router Images API with {MODEL_ID}...")
    async with httpx.AsyncClient(timeout=120.0) as client:
        try:
            response = await client.post(API_URL, headers=headers, json=payload)
            if response.status_code == 200:
                print("✅ SUCCESS: Received response from HF Router.")
                data = response.json()
                print(f"Data: {data}")
            else:
                print(f"❌ FAILED: Status Code {response.status_code}")
                print(f"Error: {response.text}")
        except Exception as e:
            print(f"❌ ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(test_hf_router_images())
