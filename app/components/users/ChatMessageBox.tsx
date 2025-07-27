import { useState } from 'react'

type Message = {
    text: string, 
    sender: string
}

type ChatBotProps = {
    isChatOpen: boolean
}

export default function ChatMessageBox(isChatOpen: ChatBotProps){

    const [ messages, setMessage ] = useState<Message[]>([]);
    const [ input, setInput ] = useState("")

    const handleSend = async () => {
        
        if (!input.trim()) return;

        const userMsg = { sender: 'user', text: input};
        setMessage(prev => [...prev, userMsg]);

        try {

            const res = await fetch('http://localhost:8000/chat', {
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({query: input, account_id:"acct_1RJ1te2eqcQXQNB8"}),
            });

            const data = await res.json();
            console.log(data)

            const botMsg = {sender: 'bot', text: data.response};
            setMessage(prev => [...prev, botMsg])

        } catch (err) {
            console.log(err);
            setMessage(prev => [...prev, {sender: 'bot', text: 'Error: Could not reach server.'}])

        }

        setInput('');
    }

    return (

        <div className="fixed bottom-6 right-2 w-md h-1/2 
            bg-white border border-gray-300 rounded-lg 
            shadow-md z-40">

            { /* header*/ }
            <h3 className="p-4 text-lg fonr-semibold border-b border-green-700 text-green-700"> Chat Window</h3>

           {/** Messages Containerd */}
            <div className="chat-box overflow-y-scroll">
            {
                messages.map((msg, index) => (
                    <div key={index} className={msg.sender === 'user' ? 'text-right' : 'text-left'}>
                    <p className="p-2 m-1 rounded-full text-green-700">{msg.text}</p>
                  </div>
                ))
            }
            </div>

            {/** Input */}

            <div>
                <input 
                    type="text"
                    className="w-full border p-2 text-green-700"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}    
                />

                <button
                    onClick={handleSend}
                    className="bg-blue-500 text-white m-1 px-3 py-1 rounded-md text-sm hover:bg-blue-600">Send
                </button>
            </div>
        </div> 
    )
}