import React, { useState } from "react";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { formatMessage } from "@/utils/messageFormatter";

const Message = ({ message, isOwnMessage, isDianaMessage }) => {
  const [translatedText, setTranslatedText] = useState("");
  const { translateText, isTranslating } = useTranslation();
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  const handleTranslate = async () => {
    if (!translatedText) {
      const translation = await translateText(message.message);
      if (translation) {
        setTranslatedText(translation);
      }
    }
    setShowTranslation(!showTranslation);
  };

  const displayText = showTranslation ? translatedText : message.message;
  const formattedContent = formatMessage(displayText);

  return (
    <div
      className={`max-w-[80%] p-3 rounded-lg ${
        isOwnMessage
          ? "bg-blue-500/40 self-end"
          : isDianaMessage
          ? "bg-indigo-900/40 self-start"
          : "bg-gray-800 self-start"
      }`}
    >
      {/* Formatted message content */}
      <p
        className="text-sm whitespace-pre-wrap message-content"
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      />

      {/* Translation & timestamp controls */}
      <div className="flex items-center justify-between mt-2 gap-2">
        <div className="flex items-center gap-2">
          {/* Translation button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-gray-400 hover:text-white"
            onClick={handleTranslate}
            disabled={isTranslating}
          >
            {isTranslating ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
                Translating...
              </>
            ) : showTranslation ? (
              "Show original"
            ) : (
              "See translation"
            )}
          </Button>
        </div>
        {/* Timestamp */}
        <span className="text-xs text-gray-400">
          {format(new Date(message.createdAt), "p")}
        </span>
      </div>

      {/* Call Modal (if implemented) */}
      {isCallModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          {/* Add your call UI here */}
        </div>
      )}
    </div>
  );
};

export default Message;
