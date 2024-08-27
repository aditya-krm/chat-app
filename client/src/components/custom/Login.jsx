import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

function Login({ switchToSignup }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Login with credentials</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Input type="text" placeholder="Email or Username" />
        <Input type="password" placeholder="Password" />
        <div>
          <h1 className="text-xs opacity-60 mt-4">
            Don't have an account?
            <span
              onClick={switchToSignup}
              className="ml-1 hover:text-blue-400 cursor-pointer"
            >
              Sign Up
            </span>
          </h1>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" className="w-[40%] mx-auto">
          Login
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Login;
