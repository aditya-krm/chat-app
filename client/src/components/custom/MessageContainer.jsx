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
import { Send } from "lucide-react";
import useConversation from "@/store/useConversation";
import useSendMessage from "@/hooks/useSendMessage";
import NoChat from "./NoChat";
import useGetMessages from "@/hooks/useGetMessages";
import { format } from "date-fns";

function MessageContainer({ conversation }) {
  const [message, setMessage] = useState("");
  const { sendMessage } = useSendMessage();
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { messages, loading } = useGetMessages();

  const currentUserId = JSON.parse(localStorage.getItem("authUser"))._id;

  const selectedUser = conversation.find(
    (conv) => conv._id === selectedConversation
  );

  const messagesEndRef = useRef(null);

  useEffect(() => {
    return () => {
      setSelectedConversation(null);
    };
  }, [setSelectedConversation]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    await sendMessage(message);
    setMessage("");
  };

  const formatTime = (timestamp) => {
    return format(new Date(timestamp), "p");
  };

  if (!selectedConversation) return <NoChat />;

  return (
    <Card className="h-full w-full">
      <CardHeader className="border-b-2 h-[12%]">
        <CardTitle>
          {selectedUser?.fullName || "Select a Conversation"}
        </CardTitle>
        <CardDescription>
          {selectedConversation ? "online / typing..." : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[78%] flex flex-col gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-800">
        {loading && <div>Loading messages...</div>}
        {Array.isArray(messages) && messages.length > 0
          ? messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[60%] ${
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
      <CardFooter className="relative">
        <Input
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
