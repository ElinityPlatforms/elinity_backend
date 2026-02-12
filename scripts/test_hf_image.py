import os
import httpx
import asyncio

HF_TOKEN = os.getenv("HF_API_TOKEN")
# The model the user requested
MODEL_ID = "black-forest-labs/FLUX.1-dev"
# New router endpoint according to search/error
API_URL = f"https://router.huggingface.co/hf-inference/models/{MODEL_ID}"

async def test_hf_image():
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    payload = {
        "inputs": "A serene and futuristic digital sanctuary, violet glowing lights, hyper-realistic, 8k resolution",
    }

    print(f"Testing Hugging Face Router API with {MODEL_ID}...")
    async with httpx.AsyncClient(timeout=120.0) as client:
        try:
            response = await client.post(API_URL, headers=headers, json=payload)
            if response.status_code == 200:
                print("✅ SUCCESS: Received image data from Hugging Face Router.")
                print(f"Content-Type: {response.headers.get('content-type')}")
                print(f"Received {len(response.content)} bytes.")
            else:
                print(f"❌ FAILED: Status Code {response.status_code}")
                print(f"Error: {response.text}")
                
                # Try simple v1/generation if model name works as provider
                alt_url = f"https://router.huggingface.co/black-forest-labs/v1/image-generation"
                print(f"Trying alternative URL: {alt_url}")
                # This is just a guess based on OpenAI compatibility mentioned
                
        except Exception as e:
            print(f"❌ ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(test_hf_image())
