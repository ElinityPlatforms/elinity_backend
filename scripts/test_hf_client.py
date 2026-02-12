from huggingface_hub import InferenceClient
import os

HF_TOKEN = os.getenv("HF_API_TOKEN")
# The model as requested
MODEL_ID = "black-forest-labs/FLUX.1-dev"

def test_hf_client():
    client = InferenceClient(model=MODEL_ID, token=HF_TOKEN)
    
    print(f"Testing HF InferenceClient with {MODEL_ID}...")
    try:
        # Generate image
        image = client.text_to_image("A serene and futuristic digital sanctuary, violet glowing lights, hyper-realistic, 8k resolution")
        
        print("✅ SUCCESS: Received image from InferenceClient.")
        print(f"Image type: {type(image)}")
        # Save locally to verify
        image.save("hf_test_image.png")
        print("Image saved as hf_test_image.png")
        
    except Exception as e:
        print(f"❌ ERROR: {e}")

if __name__ == "__main__":
    test_hf_client()
