import os
from dotenv import load_dotenv
from azure.storage.blob import BlobServiceClient, ContentSettings
import mimetypes

load_dotenv(override=True)

class AzureStorageClient:
    """
    Azure Blob Storage Client with Safe Fallback for Local/Dev.
    """
    def __init__(self) -> None:
        self.connection_string = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
        self.container_name = os.getenv("AZURE_CONTAINER_NAME", "elinity-assets")
        
        if self.connection_string:
            try:
                self.blob_service_client = BlobServiceClient.from_connection_string(self.connection_string)
                self.container_client = self.blob_service_client.get_container_client(self.container_name)
                # Ensure container exists
                if not self.container_client.exists():
                    self.container_client.create_container()
                print(f"Azure Storage Connected: Container '{self.container_name}'")
            except Exception as e:
                print(f"Azure Storage Init Failed: {e}")
                self.blob_service_client = None
        else:
            print("Azure Storage Connection String missing. Falling back to Local Storage.")
            self.blob_service_client = None

    def upload_file(self, file_or_bytes, filename: str, tenant_id: str) -> str:
        """
        Uploads to Azure if configured, else saves locally in dev.
        """
        if not self.blob_service_client:
            print(f"DEBUG: Local storage fallback for {filename}")
            upload_dir = os.path.join("static", "uploads")
            if not os.path.exists(upload_dir):
                os.makedirs(upload_dir, exist_ok=True)
            
            # Simple sanitization and unique naming
            import time
            timestamp = int(time.time())
            safe_filename = "".join([c for c in filename if c.isalnum() or c in "._-"]).strip()
            unique_filename = f"{tenant_id}_{timestamp}_{safe_filename}"
            filepath = os.path.join(upload_dir, unique_filename)

            try:
                if isinstance(file_or_bytes, (bytes, bytearray)):
                    with open(filepath, "wb") as f:
                        f.write(file_or_bytes)
                elif isinstance(file_or_bytes, str) and os.path.isfile(file_or_bytes):
                    import shutil
                    shutil.copy(file_or_bytes, filepath)
                else:
                    # Fallback if unhandled type
                    return f"https://mock-storage.local/{tenant_id}/{filename}"
                
                # Return accessible local URL
                # Use environment variable or default to localhost:8000
                backend_url = os.getenv("BACKEND_URL", "http://localhost:8000")
                return f"{backend_url}/static/uploads/{unique_filename}"
            except Exception as e:
                print(f"Local upload failed: {e}")
                return f"https://mock-storage.local/{tenant_id}/{filename}"

        # Generate blob name (folder structure: tenant_id/filename)
        blob_name = f"{tenant_id}/{filename}"
        blob_client = self.container_client.get_blob_client(blob_name)

        # Detect content type
        content_type = "application/octet-stream"
        if isinstance(file_or_bytes, str):
            content_type, _ = mimetypes.guess_type(file_or_bytes)
        
        if not content_type:
            content_type = "application/octet-stream"

        try:
            settings = ContentSettings(content_type=content_type)
            if isinstance(file_or_bytes, (bytes, bytearray)):
                blob_client.upload_blob(file_or_bytes, overwrite=True, content_settings=settings)
            elif isinstance(file_or_bytes, str) and os.path.isfile(file_or_bytes):
                with open(file_or_bytes, "rb") as data:
                    blob_client.upload_blob(data, overwrite=True, content_settings=settings)
            else:
                raise ValueError("file_or_bytes must be bytes or valid file path.")
            
            return blob_client.url
        except Exception as e:
            print(f"Upload failed: {e}")
            raise e

# For backward compatibility with existing code that might import FirebaseStorageClient
# we alias it, though calls should eventually start using AzureStorageClient
FirebaseStorageClient = AzureStorageClient
