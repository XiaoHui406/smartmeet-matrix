import chromadb
from chromadb.api.async_api import AsyncClientAPI


class ChromaDBService:

    def __init__(self) -> None:
        pass

    async def create(self):
        self.chroma_client = await chromadb.AsyncHttpClient(port=8001)
        self.meeting_collection = await self.chroma_client.get_or_create_collection('meeting')
        self.topic_collection = await self.chroma_client.get_or_create_collection('topic')
        return self
