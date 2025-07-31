import React from 'react'


export default function BottomNav({ onChatClick }: { onChatClick: () => void }) {

    return (
        <nav className="fixed bottom-0 right-2 border-1 w-md text-center">
            <button onClick={onChatClick}>Open Chat</button>
        </nav>
    )
}
