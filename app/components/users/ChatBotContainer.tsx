import React from 'react'

import BottomChatBanner from './BottomChatBanner'
import ChatMessageBox from './ChatMessageBox'

type ChatBotProps = {
    onChatClick: () => void;
    isChatOpen: boolean;
    connectedAccount: string;
}

export default function ChatBotContainer({onChatClick, isChatOpen, connectedAccount}: ChatBotProps){
    return (
        <>
        { isChatOpen ? 

            <>
            <ChatMessageBox isChatOpen={isChatOpen} connectedAccount={connectedAccount}></ChatMessageBox> 
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