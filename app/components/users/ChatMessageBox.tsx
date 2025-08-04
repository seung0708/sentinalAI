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
    const [ seconds, setSeconds ] = useState(0);
    const [ isRunning, setIsRunning ] = useState(false);
    const [ input, setInput ] = useState("")
    const [ loading, setLoading ] = useState(false)
    const [ hasShownSlow, setHasShownSlow] = useState(false)
    const [hasShownWaking, setHasShownWaking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const thinkingIndexRef = useRef<number>(-1);

    useEffect( () => {
        async function pingServer() {
            if (isChatOpen) {
              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ping`)
              const data = await res.json()
              console.log(data)
            }
        }
        pingServer()
      }, [isChatOpen]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isRunning && seconds > 0) {
            timer = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isRunning, seconds]);

    useEffect(() => {
        if (isRunning && thinkingIndexRef.current !== -1) {
            if (seconds === 6 && !hasShownSlow) {
                setMessage(prev => {
                    const updated = [...prev];
                    updated[thinkingIndexRef.current].text = 'Taking longer than expected...';
                    return updated;
                });
                setHasShownSlow(true);
            }
            if (seconds === 11 && !hasShownWaking) {
                setMessage(prev => {
                    const updated = [...prev];
                    updated[thinkingIndexRef.current].text = 'AI might still be waking up...';
                    return updated;
                });
                setHasShownWaking(true);
            }
        }
    }, [seconds, isRunning, hasShownSlow, hasShownWaking]);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
    
        setLoading(true);
        setInput('');
    
        const userMsg = { sender: 'user', text: input };
        const thinkingMsg = { sender: 'bot', text: 'Thinking...' };
    
        setMessage(prev => {
            const newMessages = [...prev, userMsg];
            thinkingIndexRef.current = newMessages.length; 
            return [...newMessages, thinkingMsg];
        });
    
        setIsRunning(true);
        setSeconds(0);
        setHasShownSlow(false);
        setHasShownWaking(false);
    
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: input, account_id: connectedAccount }),
            });
        
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
        
            const data = await res.json();
            console.log('API data:', data);
        
            setMessage(prev => [...prev, { sender: 'bot', text: data.response }]);
    
        } catch (err) {
            console.error('Fetch error:', err);
            setMessage(prev => [...prev, { sender: 'bot', text: 'Oops! Something went wrong' }]);
        } finally {
            setIsRunning(false);
            thinkingIndexRef.current = -1;
            setLoading(false);
        }
    };

    return (

        <div className="fixed bottom-6 right-2 w-md h-1/2 
            bg-white border border-gray-300 rounded-lg 
            shadow-md z-40 flex flex-col">

            { /* header*/ }
            <h3 className="p-4 text-lg fonr-semibold border-b border-green-700 text-green-700">Chat Window</h3>

           {/** Messages Containerd */}
            <div className="flex-1 overflow-y-scroll px-4 py-2">
            {
                messages.map((msg, index) => (
                    <div key={index} className='grid '>
                        <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className="grid"> 
                                <h5 className="text-green-700">{msg.sender === 'user' ? 'You' : 'Bot'}</h5>
                                <div className='grid'>
                                    <div className='items-center gap-3 inline-flex'>
                                    <p className={`p-6 m-2 text-white bg-green-700 rounded-full`}>{msg.text}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                        disabled={loading}
                        onKeyDown={e => { 
                            if (e.key === 'Enter') handleSend()
                        }}
                    />

                    <button
                        onClick={handleSend}
                        className="bg-green-500 text-white m-1 px-3 py-1 rounded-md text-sm hover:bg-green-600">Send
                    </button>
                </div>
            </div>
        </div> 
    )
}