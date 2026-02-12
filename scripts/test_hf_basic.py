import os
import httpx
import asyncio

HF_TOKEN = os.getenv("HF_API_TOKEN")
# A smaller model that is almost always available in serverless
MODEL_ID = "runwayml/stable-diffusion-v1-5"
API_URL = f"https://api-inference.huggingface.co/models/{MODEL_ID}"

async def test_hf_basic():
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    payload = {"inputs": "A simple cat."}

    print(f"Testing Basic HF API with {MODEL_ID}...")
    async with httpx.AsyncClient(timeout=120.0) as client:
        try:
            response = await client.post(API_URL, headers=headers, json=payload)
            if response.status_code == 200:
                print("✅ SUCCESS: The HF Token is VALID and serverless is WORKING.")
            else:
                print(f"❌ FAILED: Status Code {response.status_code}")
                print(f"Error: {response.text}")
        except Exception as e:
            print(f"❌ ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(test_hf_basic())
