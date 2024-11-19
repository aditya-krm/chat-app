import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import Message from "./Message";
import { ArrowLeft, Send } from "lucide-react";
import useSendMessage from "@/hooks/useSendMessage";
import useGetMessages from "@/hooks/useGetMessages";
import { useSocketContext } from "@/context/SocketContext";
import useConversation from "@/store/useConversation";
import { isAIAssistant } from "@/config/aiAssistants";
import AISelector from "./AISelector";
import useDianaChat from "@/hooks/useDianaChat";
import CallButtons from "./CallButtons";

function MessageContainer({ conversation, onBack }) {
  const [message, setMessage] = useState("");
  const { sendMessage: sendUserMessage } = useSendMessage();
  const { selectedConversation, messages: dbMessages } = useConversation();
  const { loading } = useGetMessages();
  const { socket, onlineUsers } = useSocketContext();
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [currentModel, setCurrentModel] = useState("gemini");

  const {
    sendMessage: sendDianaMessage,
    isLoading: isAITyping,
    chatMessages,
    clearChat,
  } = useDianaChat();

  const currentUserId = JSON.parse(localStorage.getItem("authUser"))._id;

  // Listen for online users
  useEffect(() => {
    if (!socket) return;

    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(new Set(users));
    });

    return () => socket.off("getOnlineUsers");
  }, [socket]);

  // Get selected user details
  const selectedUser = conversation.find(
    (conv) => conv._id === selectedConversation
  ) || {
    _id: "diana_bot",
    fullName: "Diana AI Assistant",
    isBot: true,
  };

  const isUserOnline = isAIAssistant(selectedConversation)
    ? true
    : onlineUsers.includes(selectedConversation);

  useEffect(() => {
    // Clear AI chat when switching conversations
    if (isAIAssistant(selectedConversation)) {
      clearChat();
    }
  }, [selectedConversation]);

  useEffect(() => {
    // Scroll to bottom on new messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, dbMessages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      // Limit max height to ~4-5 lines (adjust 160px as needed)
      textareaRef.current.style.height = `${Math.min(scrollHeight, 160)}px`;
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const currentMsg = message.trim();
    setMessage("");

    if (isAIAssistant(selectedConversation)) {
      await sendDianaMessage(currentMsg, currentModel);
    } else {
      try {
        const response = await sendUserMessage(currentMsg);
        if (response) {
          socket?.emit("sendMessage", {
            receiverId: selectedConversation,
            message: currentMsg,
            senderId: currentUserId,
            createdAt: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Determine which messages to show based on conversation type
  const displayMessages = isAIAssistant(selectedConversation)
    ? chatMessages
    : dbMessages || [];

  return (
    <Card className="h-full w-full flex flex-col">
      <div className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button onClick={onBack} size="icon" variant="ghost">
            <ArrowLeft />
          </Button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold">{selectedUser?.fullName}</span>
              <div
                className={`w-2 h-2 rounded-full ${
                  isUserOnline ? "bg-green-500" : "bg-gray-500"
                }`}
                title={isUserOnline ? "Online" : "Offline"}
              />
            </div>
            {!isAIAssistant(selectedConversation) && (
              <span className="text-xs text-gray-400">
                {isUserOnline ? "Online" : "Offline"}
              </span>
            )}
          </div>
        </div>

        {!isAIAssistant(selectedConversation) && (
          <CallButtons
            isOnline={isUserOnline}
            username={selectedUser?.fullName}
          />
        )}
      </div>

      <CardContent className="flex-1 flex flex-col gap-4 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-800">
        {loading && !isAIAssistant(selectedConversation) ? (
          <div className="text-center">Loading messages...</div>
        ) : displayMessages.length > 0 ? (
          displayMessages.map((msg) => (
            <Message
              key={msg._id}
              message={msg}
              isOwnMessage={msg.senderId === currentUserId}
              isDianaMessage={msg.senderId === "diana_bot"}
            />
          ))
        ) : (
          <div className="text-center text-gray-400">
            {isAIAssistant(selectedConversation)
              ? "Start chatting with Diana AI Assistant"
              : "No messages yet"}
          </div>
        )}
        {isAITyping && (
          <div className="self-start bg-indigo-900/40 p-3 rounded-lg">
            Diana is thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="p-2 border-t">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 w-full bg-gray-900 rounded-lg p-2"
        >
          {isAIAssistant(selectedConversation) && (
            <AISelector
              currentModel={currentModel}
              onModelSelect={setCurrentModel}
            />
          )}
          <Textarea
            ref={textareaRef}
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 bg-transparent border-none focus-visible:ring-0 resize-none p-2 input-scrollbar overflow-y-auto"
            style={{
              maxHeight: "160px", // Matches the limit in useEffect
              minHeight: "40px", // Height for single line
            }}
          />
          <Button
            type="submit"
            size="icon"
            className={`rounded-full ${
              !message.trim() || isAITyping
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={!message.trim() || isAITyping}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

export default MessageContainer;
