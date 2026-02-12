from huggingface_hub import InferenceClient
import os

HF_TOKEN = os.getenv("HF_API_TOKEN")
# Try the faster/cheaper one
MODEL_ID = "black-forest-labs/FLUX.1-schnell"

def test_hf_schnell():
    client = InferenceClient(model=MODEL_ID, token=HF_TOKEN)
    
    print(f"Testing HF InferenceClient with {MODEL_ID}...")
    try:
        image = client.text_to_image("A cute robot.")
        print("✅ SUCCESS: Received image from InferenceClient (Schnell).")
        image.save("hf_test_schnell.png")
    except Exception as e:
        print(f"❌ ERROR: {e}")

if __name__ == "__main__":
    test_hf_schnell()
