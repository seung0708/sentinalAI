import React from 'react'

import BottomChatBanner from './BottomChatBanner'
import ChatMessageBox from './ChatMessageBox'

type ChatBotProps = {
    onChatClick: () => void;
    isChatOpen: boolean;
}

export default function ChatBotContainer({onChatClick, isChatOpen}: ChatBotProps){

    return (
        <>
        { isChatOpen ? 

            <>
            <ChatMessageBox isChatOpen={isChatOpen}></ChatMessageBox> 
            <BottomChatBanner isChatOpen={isChatOpen} onChatClick={onChatClick}></BottomChatBanner> 
            </>
            : 

            <>
            <BottomChatBanner isChatOpen={isChatOpen} onChatClick={onChatClick}></BottomChatBanner>
            </>
            
        }
        </>
        
    )

}