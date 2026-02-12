from pymilvus import MilvusClient
from dotenv import load_dotenv
from pymilvus import model
import os 

load_dotenv()


class MilvusDB: 
    def __init__(self, collection_name="tenants", dim=768):
        self._uri = os.getenv("MILVUS_URI")
        self._token = os.getenv("MILVUS_TOKEN")
        self.dim = dim
        self.collection_name = collection_name
        self.client = None
        
        if not self._uri or not self._token: 
            print("WARNING: MILVUS_URI or MILVUS_TOKEN not found. Milvus client will be disabled.")
            return

        try:
            from pymilvus import model
            self.embedding_fn = model.DefaultEmbeddingFunction()
            self.client = MilvusClient(uri=self._uri, token=self._token)
            if not self.client.has_collection(collection_name=self.collection_name):
                self.client.create_collection(
                    collection_name=self.collection_name,
                    dimension=self.dim,
                )
        except Exception as e:
            print(f"Error initializing Milvus: {e}")
            self.client = None
    def embed_docs(self,docs):  
        return self.embedding_fn.encode_documents(docs)
        
    def upsert(self,data):
        res = self.client.insert(collection_name=self.collection_name,data=data)
        return res
    
    def query(self,query): 
        return self.client.query(query)
        
milvus_client = MilvusDB()