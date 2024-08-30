import { useSocketContext } from "@/context/SocketContext";
import useConversation from "@/store/useConversation";
import { useEffect } from "react";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    socket?.on("newMessage", (newmessage) => {
      newmessage.shouldShake = true;
      setMessages([...messages, newmessage]);
    });

    return () => socket?.off("newMessage");
  }, [socket, messages, setMessages]);
};

export default useListenMessages;
