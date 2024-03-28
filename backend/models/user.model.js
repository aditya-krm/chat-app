import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        length: 255,
    },
    //name,username,email,password,confirmPassword,gender,profilePicture
    username: {
        type: String,
        required: true,
        unique: true,
        length: 255,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlenght: 8,
    },
    gender:{
        type: String,
        required: true,
        enum : ["male","female"]
    },
    profilePicture: {
        type: String,
        default: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=1921&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
});

const User = mongoose.model("User", userSchema);

export default User;