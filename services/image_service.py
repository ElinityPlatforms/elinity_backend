import os
import io
import uuid
from huggingface_hub import InferenceClient
from typing import Optional

class ImageService:
    def __init__(self):
        self.token = os.getenv("HF_API_TOKEN")
        self.model = os.getenv("IMAGE_MODEL", "black-forest-labs/FLUX.1-schnell")
        self.client = InferenceClient(model=self.model, token=self.token) if self.token else None

    async def generate_image(self, prompt: str) -> Optional[bytes]:
        """Generates an image from a prompt and returns the bytes."""
        if not self.client:
            print("HF_API_TOKEN not configured for ImageService.")
            return None
        
        try:
            # Note: text_to_image is synchronous in huggingface_hub 1.3.x for some reason
            # but we'll wrap it if needed or just call it directly as it's an API call.
            image = self.client.text_to_image(prompt)
            img_byte_arr = io.BytesIO()
            image.save(img_byte_arr, format='PNG')
            return img_byte_arr.getvalue()
        except Exception as e:
            print(f"Image generation failed: {e}")
            return None

    def save_to_local(self, image_bytes: bytes, filename: Optional[str] = None) -> str:
        """Saves image bytes locally and returns the path."""
        if not filename:
            filename = f"image_{uuid.uuid4()}.png"
        
        # Ensure static/moodscapes dir exists
        os.makedirs("static/moodscapes", exist_ok=True)
        path = os.path.join("static/moodscapes", filename)
        
        with open(path, "wb") as f:
            f.write(image_bytes)
        
        return path
