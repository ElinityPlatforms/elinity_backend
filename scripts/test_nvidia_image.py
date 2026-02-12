import os
import httpx
import asyncio
import base64

API_KEY = "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"

async def test_nvidia_image():
    # Attempting the SDXL Turbo endpoint
    url = "https://ai.api.nvidia.com/v1/genai/stabilityai/sdxl-turbo"
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Accept": "application/json",
    }
    
    payload = {
        "text_prompts": [{"text": "A futuristic digital sanctuary with glowing violet lights and high-tech meditation pods, high quality, cinematic lighting"}],
        "seed": 0,
        "sampler": "K_EULER_ANCESTRAL",
        "steps": 2, # Turbo is fast
    }
    
    print("Testing NVIDIA Image Generation (SDXL Turbo)...")
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, headers=headers)
            if response.status_code == 200:
                print("✅ SUCCESS: Received image from NVIDIA NIM.")
                data = response.json()
                # Image is usually in artifacts[0].base64 or similar depending on NIM version
                # Let's just check the keys
                print(f"Response Keys: {data.keys()}")
                if 'artifacts' in data:
                    print(f"Generated {len(data['artifacts'])} images.")
            else:
                print(f"❌ FAILED: Status Code {response.status_code}")
                print(f"Error: {response.text}")
        except Exception as e:
            print(f"❌ ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(test_nvidia_image())
