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
                    "match_threshold": 0.05,
                    "match_count": 1000,
                    "min_content_length": 0
                }
            }
        ).execute()
        return response.data or []
        
    def _get_full_transactions(self, matched_ids):
        return self.supabase.rpc(
            "get_transactions_parents",
            {"matched_stripe_ids": matched_ids}
        ).execute()

    def _get_total_transaction_count(self, account_id):
        response = self.supabase.rpc(
            "get_total_transactions_count",
            {"account_id": account_id}
        ).execute()
        return response.data[0]['count'] if response.data else 0
        
    def _format_transaction(self, idx, tx, total_count):  
        # format amount comparison
        amount_info = (
            f"Amount: ${tx['amount']} "
            f"(Average: ${tx['avg_amount']:.2f})"
        )
        
        # format address info
        address_info = (
            f"Location: {tx['billing_city']}, {tx['billing_state']} "
            f"({'Changed from previous' if tx['addr_change_score'] > 0 else 'Same as previous'})"
        )
        
        # format frequency info
        total_txs = tx['tx_count_last_1h']
        frequency_info = (
            f"Recent transaction activity:\n"
            f"Total transactions in past hour: {total_txs}\n"
            f"Timing breakdown:\n"
            f"- This transaction occurred at: {tx['timestamp']}\n"
            f"- Number of transactions including this one in the:\n"
            f"Past 5 minutes: {tx['tx_count_last_5min']}\n"
            f"Past 10 minutes: {tx['tx_count_last_10min']}\n"
            f"Past 30 minutes: {tx['tx_count_last_30min']}\n"
            f"Past hour: {total_txs}"
        )
        
        return (
            f"[TRANSACTION {idx+1} of {total_count}: {tx['stripe_id']}]\n"  
            f"Made by: {tx['billing_name']}\n"
            f"When: {tx['timestamp']}\n"
            f"{amount_info}\n"
            f"{address_info}\n"
            f"{frequency_info}\n"
            f"Risk Level: {tx['predicted_risk']}\n"
            f"[END TRANSACTION {idx+1} of {total_count}]\n"  
        )
        
    def chat(self, query, account_id):
        try:
            print(f"[LOG] Query received: {query} for account: {account_id}")

            query_classification_prompt = """
            Classify the following query as either:
            1. "COUNT" - asking about numbers, totals, or summaries of transactions
            2. "SPECIFIC" - asking about specific transactions or details
            
            Query: {query}
            
            Respond with only one word: COUNT or SPECIFIC
            """

            classification = self.llm.invoke(
                query_classification_prompt.format(query=query)
            ).content.strip()
            print(classification)
            # get query embedding
            total_count = self._get_total_transaction_count(account_id)
            print(f"[LOG] Total transactions in database: {total_count}")
            if classification == "COUNT":
                full_txs = self.supabase.table('transactions').select('*').eq('account_id', account_id).execute()
            else:
                query_embedding = self.embed_model.embed_query(query)
                # find similar transactions
                similar_txs = self._get_similar_transactions(query_embedding, account_id)
            
                if not similar_txs:
                    return {"response": "No relevant transactions found."}
                
                # get full transaction details
                matched_ids = [tx['id'] for tx in similar_txs]
                full_txs = self._get_full_transactions(matched_ids)

            high_risk = [tx for tx in full_txs.data if tx['predicted_risk'] == 'high']
            medium_risk = [tx for tx in full_txs.data if tx['predicted_risk'] == 'medium']
            low_risk = [tx for tx in full_txs.data if tx['predicted_risk'] == 'low']

            summary = (
                f"You have a total of {total_count} transactions.\n"
                f"Summary by risk level:\n"
                f"- High Risk: {len(high_risk)} transactions\n"
                f"- Medium Risk: {len(medium_risk)} transactions\n"
                f"- Low Risk: {len(low_risk)} transactions\n\n"
                f"Here are ALL transactions, grouped by risk level (high risk first):\n\n"
            )

            # format transactions
            transaction_texts = (
                [self._format_transaction(idx, tx, total_count) for idx, tx in enumerate(high_risk)] +
                [self._format_transaction(idx + len(high_risk), tx, total_count) for idx, tx in enumerate(medium_risk)] +
                [self._format_transaction(idx + len(high_risk) + len(medium_risk), tx, total_count) for idx, tx in enumerate(low_risk)]
            )
            print(f"[LOG] Formatted transactions: {len(transaction_texts)}")
            
            context_str = summary + "\n".join(transaction_texts)
            
            # create chat prompt
            template = """
            You are an AI fraud detection assistant.
            You have a list of transactions, each classified as low, medium, or high fraud risk.

            Generate a short explanation (2–3 sentences max) for why a transaction was classified as either high or medium fraud risk.
            Focus on the overall behavioral pattern or anomaly that triggered the risk classification (e.g., sudden transaction spikes, unusual location, suspicious timing, or rapid transaction frequency).
            When explaining why a transaction was flagged as high or medium risk, avoid abstract terms such as "risk score" or "probability." Instead, explicitly describe the specific anomaly or unusual pattern in plain language. For example:

            - "The transaction was flagged because 3 purchases were made within 5 minutes, which is unusual for the customer."
            - "The transaction amount of $27.00 was unusually high compared to the customer’s typical behavior."
            - "The billing address included '123 Unknown', which appeared unfamiliar and suspicious."
            - "The transaction occurred at an unusual time compared to the customer’s typical activity."

            When explaining frequency-related anomalies, explicitly state the exact number of transactions and the precise time window. For example, say "3 transactions within 5 minutes" or "4 transactions within 10 minutes." Do not mention frequency risk scores or abstract terms like "high frequency."
            Do not mention any internal metric names such as "frequency risk," "amount risk," "address risk," or numeric probability scores in your response. Focus only on explaining anomalies in plain language.
            Do not explicitly mention internal field names like "billing_line1" — instead, refer to them naturally as "the billing address" or "the transaction location."

            When responding:
            - "If asked about counts (e.g., "how many are high risk?"), respond with the total count and list ALL customers who made transactions of that risk level.
            - If asked for explanations about specific risk levels, generate explanations **only** for those risk levels requested in the question.
            - Do **not** mention numeric probabilities, risk scores, or vague terms like "high risk associated with the address."
            - Instead, describe concrete anomalies based on the transaction data as shown above.
            - For high-risk transactions, emphasize the severity or urgency of the anomaly.
            - For medium-risk transactions, highlight potentially suspicious behavior but acknowledge the transaction may still be legitimate.
            - Keep the tone clear, professional, and easy to understand.

            Do not mention:
            - Internal risk scores or probabilities
            - Technical terms like "frequency_risk" or "amount_risk"
            - System metrics or thresholds
            - Database field names

            If an error occurs, if the question is not clear, or if the question asks about information that is not available, apologize and respond that you do not have enough information to answer the question.

            When asked about a purchase, equate it to a transaction.

            Here are the relevant transactions with their risk assessments:
            {context}

            Answer the question.
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
