import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { LogOut, SearchIcon, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";

function Home() {
  const userList = [
    {
      pic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      name: "John Doe",
    },
    {
      pic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      name: "John Doe",
    },
    {
      pic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      name: "John Doe",
    },
  ];
  return (
    <div className="flex w-full h-screen gap-1 pt-4 px-4">
      <div className="w-[30%]">
        <Card className="h-full">
          <CardHeader className="h-[10%] relative">
            <Input className="pl-8 w-[90%]" placeholder="Search User" />
            <SearchIcon className="cursor-pointer absolute opacity-50 pl-1" />
            {/*  */}
            <DropdownMenu>
              <DropdownMenuTrigger className="w-8 h-8 rounded-full border-2 border-cyan-400/50 absolute right-2 top-5 flex items-center justify-center">
                <User />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Aditya Karmakar</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 cursor-pointer">
                  Logout
                  <span className="ml-1">
                    <LogOut size={17} />
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="h-[90%] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-800">
            {userList.map((user, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-900 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border-2">
                  <img
                    src={user.pic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>{user.name}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      {/* chat box */}
      <div className="w-full">
        <Card className="h-full">
          <CardHeader className="border-b-2 h-[12%]">
            <CardTitle>John Doe</CardTitle>
            <CardDescription>online / typing...</CardDescription>
          </CardHeader>
          <CardContent className="h-[78%] flex flex-col gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-800">
            {/* Received Message */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2">
                <img
                  src="https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?q=80&w=1930&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="max-w-[75%] border-2 p-2 bg-blue-950 text-white rounded-xl">
                Received a message ... Lorem ipsum dolor, sit amet consectetur
                adipisicing elit. Sint porro accusamus amet, quibusdam nisi
                maxime sed, officiis, ipsam error repellat expedita veniam sunt
                saepe voluptatibus incidunt veritatis repellendus inventore
                minima.
              </div>
            </div>

            {/* Sent Message */}
            <div className="flex items-start gap-3 justify-end">
              <div className="max-w-[75%] border-2 p-2 bg-green-900 text-white rounded-xl">
                Sending a message ... Lorem ipsum dolor sit amet, consectetur
                adipisicing elit. Ipsum earum laudantium magnam sit rerum amet
                quis neque assumenda vero sapiente, nam adipisci nostrum sed
                praesentium possimus molestias! Nam, in vitae!
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2">
                <img
                  src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.0.3&q=80&w=400"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="relative">
            <Input placeholder="Type a message" />
            <Button variant="ghost" className="absolute right-6">
              <Send />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Home;
