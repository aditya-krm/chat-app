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

function Signup({ switchToLogin }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Create an account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Input type="text" placeholder="Full Name" />
        <Input type="text" placeholder="Username" />
        <Input type="email" placeholder="email@domain.com" />
        <Input type="password" placeholder="Password" />
        <Input type="password" placeholder="Confirm Password" />
        <div className="flex gap-4 mt-4 mx-auto">
          <label className="flex items-center px-4 py-2 border-2 rounded-xl cursor-pointer">
            <input type="radio" name="gender" value="male" className="mr-2" />
            Male
          </label>
          <label className="flex items-center px-4 py-2 border-2 rounded-xl cursor-pointer">
            <input type="radio" name="gender" value="female" className="mr-2" />
            Female
          </label>
        </div>
        <div>
          <h1 className="text-xs opacity-60 mt-4">
            Alread have an account?
            <span
              onClick={switchToLogin}
              className="ml-1 hover:text-blue-400 cursor-pointer"
            >
              Login
            </span>
          </h1>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" className="w-[40%] mx-auto">
          Sign Up
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Signup;
