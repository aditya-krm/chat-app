import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, ArrowLeft, Phone, Video } from "lucide-react";
import useConversation from "@/store/useConversation";
import useSendMessage from "@/hooks/useSendMessage";
import useGetMessages from "@/hooks/useGetMessages";
import { format } from "date-fns";
import useListenMessages from "@/hooks/useListenMessages";
import { useSocketContext } from "@/context/SocketContext"; // Import the context
import { useCallContext } from "@/context/CallContext";

function MessageContainer({ conversation, onBack }) {
  const [message, setMessage] = useState("");
  const { sendMessage } = useSendMessage();
  const { selectedConversation } = useConversation();
  const { messages, loading } = useGetMessages();
  const { onlineUsers, socket } = useSocketContext(); // Access the online users and socket
  const { callUser } = useCallContext();

  const currentUserId = JSON.parse(localStorage.getItem("authUser"))._id;
  const selectedUser = conversation.find(
    (conv) => conv._id === selectedConversation
  );

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message || !socket) return;

    try {
      const response = await sendMessage(message);
      if (response) {
        socket.emit("sendMessage", {
          receiverId: selectedConversation,
          message: message,
          senderId: currentUserId,
          createdAt: new Date().toISOString(),
        });
        setMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  useListenMessages();

  const formatTime = (timestamp) => {
    return format(new Date(timestamp), "p");
  };

  if (!selectedConversation) return null;

  const isOnline = onlineUsers.includes(selectedUser?._id); // Check if the user is online

  return (
    <Card className="h-full w-full">
      <CardHeader className="border-b-2 h-[8%] flex flex-row space-y-0 p-2">
        <div className="max-w-14">
          <Button variant="ghost" className="lg:hidden mr-4" onClick={onBack}>
            <ArrowLeft />
          </Button>
        </div>
        <div>
          <CardTitle>
            {selectedUser?.fullName || "Select a Conversation"}
          </CardTitle>
          <CardDescription>
            {isOnline ? "Online" : "Offline"} {/* Display online status */}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => callUser(selectedConversation, "voice")}
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => callUser(selectedConversation, "video")}
          >
            <Video className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-[84%] flex flex-col gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-800">
        {loading && <div>Loading messages...</div>}
        {Array.isArray(messages) && messages.length > 0
          ? messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] p-2 rounded-lg lg:max-w-[60%] ${
                  msg.senderId === currentUserId
                    ? "bg-blue-500/40 self-end"
                    : "bg-green-900 self-start"
                }`}
              >
                <p>{msg.message}</p>
                <span className="text-xs text-gray-400 text-end">
                  {formatTime(msg.createdAt)}
                </span>
              </div>
            ))
          : !loading && <div>No messages available</div>}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="relative h-[8%]">
        <Input
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button
          onClick={handleSubmit}
          type="submit"
          variant="ghost"
          className="absolute right-6"
        >
          <Send />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default MessageContainer;
