import { useState, useRef, useEffect } from 'react'

type Message = {
    text: string, 
    sender: string
}

type ChatBotProps = {
    isChatOpen: boolean
    connectedAccount: string
}

export default function ChatMessageBox({isChatOpen, connectedAccount}: ChatBotProps){
    const [ messages, setMessage ] = useState<Message[]>([]);
    const [ input, setInput ] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null);
    console.log('ChatBox', connectedAccount)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { sender: 'user', text: input};
        setInput('');
        setMessage(prev => [...prev, userMsg]);

        try {

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({query: input, account_id: connectedAccount}),
            });

            const data = await res.json();
            console.log(data)

            const botMsg = {sender: 'bot', text: data.response};
            setMessage(prev => [...prev, botMsg])

        } catch (err) {
            console.log(err);
            setMessage(prev => [...prev, {sender: 'bot', text: 'Error: Could not reach server.'}])

        }

    }

    return (

        <div className="fixed bottom-6 right-2 w-md h-1/2 
            bg-white border border-gray-300 rounded-lg 
            shadow-md z-40 flex flex-col">

            { /* header*/ }
            <h3 className="p-4 text-lg fonr-semibold border-b border-green-700 text-green-700"> Chat Window</h3>

           {/** Messages Containerd */}
            <div className="flex-1 overflow-y-scroll px-4 py-2">
            {
                messages.map((msg, index) => (
                    <div key={index} className={msg.sender === 'user' ? 'text-right' : 'text-left'}>
                    <p className="p-2 m-1 rounded-full text-green-700">{msg.text}</p>
                  </div>
                ))
            }
            <div ref={messagesEndRef}></div>
            </div>

            {/** Input */}

            <div className="p-2 border-t border-gray-300">
                <div className="flex">
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
        </div> 
    )
}