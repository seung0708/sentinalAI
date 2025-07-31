import React from 'react'


type BottomNavProps = {
    onChatClick: () => void;
    isChatOpen: boolean;
}

export default function BottomChatBanner({ onChatClick, isChatOpen }: BottomNavProps) {

    return (
        <div className="fixed bottom-0 right-2 border-1 w-md text-center z-60 rounded-full shadow-lg bg-[#163936]"
             onClick={onChatClick}>
            
            <span className="font-semibold">{ isChatOpen ? 'Hide Chat' : 'Chat with Sentinel AI' }</span>
        </div>
    )
}
