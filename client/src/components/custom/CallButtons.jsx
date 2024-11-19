import React from "react";
import { Button } from "../ui/button";
import { Phone, Video } from "lucide-react";
import { toast } from "sonner";
import { useCallContext } from "@/context/CallContext";

const CallButtons = ({ isOnline, receiverId }) => {
  const { callUser } = useCallContext();

  const handleVoiceCall = () => {
    if (!isOnline) {
      toast.error("User is offline");
      return;
    }
    callUser(receiverId, "audio");
  };

  const handleVideoCall = () => {
    if (!isOnline) {
      toast.error("User is offline");
      return;
    }
    callUser(receiverId, "video");
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleVoiceCall}
        variant="ghost"
        size="icon"
        className="hover:bg-gray-800"
        title="Voice Call"
      >
        <Phone className="h-5 w-5" />
      </Button>
      <Button
        onClick={handleVideoCall}
        variant="ghost"
        size="icon"
        className="hover:bg-gray-800"
        title="Video Call"
      >
        <Video className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default CallButtons;
