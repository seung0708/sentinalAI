from app import storage_context 
from llama_index.core import load_index_from_storage

from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

llm = ChatOpenAI()

def response_to_user_message(message, chat_history):
    index = load_index_from_storage(storage_context)
    retriever = index.as_retriever()
