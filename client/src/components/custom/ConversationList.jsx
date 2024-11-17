import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { LogOut, SearchIcon, User } from "lucide-react";
import { useSocketContext } from "@/context/SocketContext";

const ConversationList = ({
  conversation,
  selectedConversation,
  setSelectedConversation,
  authUser,
  logout,
}) => {
  const { onlineUsers } = useSocketContext();

  return (
    <Card className="h-full">
      <CardHeader className="h-[10%] relative">
        <Input className="pl-8 w-[90%]" placeholder="Search User" />
        <SearchIcon className="cursor-pointer absolute opacity-50 pl-1" />
        <DropdownMenu>
          <DropdownMenuTrigger className="w-8 h-8 rounded-full border-2 border-cyan-400/50 absolute right-2 top-5 flex items-center justify-center">
            <User />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{authUser.username}</DropdownMenuItem>
            <DropdownMenuItem>{authUser.email}</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 cursor-pointer">
              Logout
              <span className="ml-1">
                <LogOut size={17} onClick={logout} />
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="h-[90%] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-800">
        {conversation.map((user, index) => {
          const isOnline = onlineUsers.includes(user._id);

          return (
            <div
              key={index}
              onClick={() => setSelectedConversation(user._id)}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                selectedConversation === user._id
                  ? "bg-gray-800"
                  : "hover:bg-gray-900"
              }`}
            >
              <div
                className={`relative w-10 h-10 rounded-full overflow-hidden border-2 ${
                  isOnline ? "border-green-400" : ""
                }`}
              >
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                {/* {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full z-10"></span>
                )} */}
              </div>
              <div>
                <p className="text-white">{user.fullName}</p>
                {isOnline && <p className="text-xs text-green-400">Online</p>}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ConversationList;
