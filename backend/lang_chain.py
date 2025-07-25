from flask import jsonify
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate

class TransactionChatBot:
    def __init__(self, supabase_client, openai_api_key):
        self.supabase = supabase_client
        self.embed_model = OpenAIEmbeddings(api_key=openai_api_key)
        self.llm = ChatOpenAI(temperature=0, api_key=openai_api_key)
        
    def _get_similar_transactions(self, query_embedding, account_id):
        response = self.supabase.rpc(
            "match_transaction_embeddings",
            {
                "params": {
                    "input_embedding": query_embedding,
                    "account_id": account_id,
                    "match_threshold": 0.1,
                    "match_count": 10,
                    "min_content_length": 20
                }
            }
        ).execute()
        return response.data or []
        
    def _get_full_transactions(self, matched_ids):
        return self.supabase.rpc(
            "get_transactions_parents",
            {"matched_stripe_ids": matched_ids}
        ).execute()
        
    def _format_transaction(self, tx):
        return (
            f"Transaction {tx['stripe_id']}\n"
            f"Made by: {tx['billing_name']}\n"
            f"Amount: {tx['amount']}\n"
            f"Date: {tx['timestamp']}\n"
            f"Status: {tx['status']}\n"
            f"Risk Level: {tx['predicted_risk']}\n"
            "---"
        )
        
    def chat(self, query, account_id):
        try:
            print(f"[LOG] Query received: {query} for account: {account_id}")
            
            # Get query embedding
            query_embedding = self.embed_model.embed_query(query)
            
            # Find similar transactions
            similar_txs = self._get_similar_transactions(query_embedding, account_id)
            print(f"[LOG] Retrieved {len(similar_txs)} matching transactions")
            
            if not similar_txs:
                return {"response": "No relevant transactions found."}
                
            # Get full transaction details
            matched_ids = [tx['id'] for tx in similar_txs]
            full_txs = self._get_full_transactions(matched_ids)
            
            # Format transactions
            transaction_texts = [
                self._format_transaction(tx) 
                for tx in full_txs.data
            ]
            context_str = "\n".join(transaction_texts)
            
            # Create chat prompt
            template = """
            You are a helpful assistant that answers questions about transactions.
            
            Here are some relevant transaction details:
            {context}
            
            Use these details to answer the question:
            {question}
            """
            prompt = ChatPromptTemplate.from_template(template)
            prompt_text = prompt.format_prompt(
                context=context_str, 
                question=query
            ).to_string()
            
            # Generate response
            response = self.llm.invoke(prompt_text)
            print(f"[LOG] LLM response: {response.content}")
            
            return {"response": response.content}
            
        except Exception as e:
            print(f"[ERROR] Exception in chat: {e}")
            return {"error": "Internal error occurred."}, 500
