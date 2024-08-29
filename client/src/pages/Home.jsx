import React, { useEffect } from "react";
import useLogout from "@/hooks/useLogout";
import useGetConversation from "@/hooks/usegetConversation";
import useConversation from "@/store/useConversation";
import ConversationList from "@/components/custom/ConversationList";
import MessageContainer from "@/components/custom/MessageContainer";

function Home() {
  const { loading, conversation } = useGetConversation();
  const { logout } = useLogout();
  const {
    selectedConversation,
    setSelectedConversation,
    messages,
    setMessages,
  } = useConversation();

  useEffect(() => {
    if (selectedConversation !== null) {
      const selectedMessages = conversation.find(
        (conv) => conv.id === selectedConversation
      )?.messages;
      setMessages(selectedMessages || []);
    }
  }, [selectedConversation, conversation, setMessages]);

  const authUser = JSON.parse(localStorage.getItem("authUser"));

  return (
    <div className="flex w-full h-screen gap-1 pt-4 px-4">
      <div className="w-[30%]">
        <ConversationList
          conversation={conversation}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
          authUser={authUser}
          logout={logout}
        />
      </div>
      <div className="w-full flex items-center justify-center">
        <MessageContainer
          conversation={conversation}
          selectedConversation={selectedConversation}
          messages={messages}
        />
      </div>
    </div>
  );
}

export default Home;
