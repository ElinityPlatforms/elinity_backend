import os
import httpx
import asyncio

API_KEY = "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"

async def test_nvidia_image_v2():
    # Attempting a different standard NIM path for SDXL
    url = "https://ai.api.nvidia.com/v1/visual/stabilityai/stable-diffusion-xl"
    
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Accept": "application/json",
    }
    
    payload = {
        "prompt": "A peaceful Zen garden in the clouds, digital art style",
        "cfg_scale": 7,
        "height": 1024,
        "width": 1024,
        "samples": 1,
        "steps": 30
    }
    
    print("Testing NVIDIA Image Generation (Visual path)...")
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=payload, headers=headers)
            if response.status_code == 200:
                print("✅ SUCCESS: Received image from NVIDIA NIM (Visual).")
            else:
                print(f"❌ FAILED: Status Code {response.status_code}")
                # Try one more path common in tutorials: /v1/generation/stabilityai/sdxl
                url2 = "https://ai.api.nvidia.com/v1/generation/stabilityai/sdxl"
                response2 = await client.post(url2, json=payload, headers=headers)
                if response2.status_code == 200:
                    print("✅ SUCCESS: Received image from NVIDIA NIM (Generation).")
                else:
                    print(f"❌ FAILED AGAIN: Status Code {response2.status_code}")
                    print(f"Error 1: {response.text}")
                    print(f"Error 2: {response2.text}")
        except Exception as e:
            print(f"❌ ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(test_nvidia_image_v2())
