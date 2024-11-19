import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://chat-app-0b1m.onrender.com"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = {};
const activeCallsMap = new Map(); // Track active calls

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId !== undefined) userSocketMap[userId] = socket.id;

  // Broadcast online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Chat message handling
  socket.on("sendMessage", (message) => {
    const receiverSocketId = getReceiverSocketId(message.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", message);
    }
  });

  // Call signaling
  socket.on("initiateCall", ({ userToCall, from, callType, offer }) => {
    const receiverSocketId = getReceiverSocketId(userToCall);
    console.log("Call initiation from:", from, "to:", userToCall);

    // Check if receiver is online
    if (!receiverSocketId) {
      socket.emit("callError", { message: "User is offline" });
      return;
    }

    // Check if receiver is already in a call
    if (activeCallsMap.has(userToCall)) {
      socket.emit("callError", { message: "User is busy in another call" });
      return;
    }

    // Create call session
    const callId = `${from}-${userToCall}`;
    activeCallsMap.set(userToCall, {
      callId,
      caller: from,
      receiver: userToCall,
      type: callType,
    });

    // Notify receiver of incoming call with the offer
    io.to(receiverSocketId).emit("incomingCall", {
      callId,
      from,
      callType,
      offer, // Include the offer
    });

    // Set timeout for call answer
    setTimeout(() => {
      if (activeCallsMap.has(userToCall)) {
        const call = activeCallsMap.get(userToCall);
        if (!call.accepted) {
          activeCallsMap.delete(userToCall);
          io.to(socket.id).emit("callEnded", { reason: "no_answer" });
          io.to(receiverSocketId).emit("callEnded", { reason: "no_answer" });
        }
      }
    }, 30000); // 30 seconds timeout
  });

  socket.on("callAnswer", ({ callId, to, answer }) => {
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      const call = activeCallsMap.get(userId);
      if (call) {
        call.accepted = true;
        activeCallsMap.set(userId, call);
      }
      io.to(receiverSocketId).emit("callAccepted", { callId, answer });
    }
  });

  socket.on("iceCandidate", ({ callId, candidate, to }) => {
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("iceCandidate", { callId, candidate });
    }
  });

  socket.on("negotiationNeeded", ({ callId, offer, to }) => {
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("negotiationNeeded", { callId, offer });
    }
  });

  socket.on("endCall", ({ callId, to }) => {
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      activeCallsMap.delete(to);
      activeCallsMap.delete(userId);
      io.to(receiverSocketId).emit("callEnded", { reason: "ended" });
    }
  });

  socket.on("rejectCall", ({ callId, to }) => {
    const receiverSocketId = getReceiverSocketId(to);
    if (receiverSocketId) {
      activeCallsMap.delete(userId);
      io.to(receiverSocketId).emit("callRejected", { callId });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // End any active calls for this user
    if (activeCallsMap.has(userId)) {
      const call = activeCallsMap.get(userId);
      const otherParty = call.caller === userId ? call.receiver : call.caller;
      const otherPartySocketId = getReceiverSocketId(otherParty);

      if (otherPartySocketId) {
        io.to(otherPartySocketId).emit("callEnded", {
          reason: "user_disconnected",
        });
      }

      activeCallsMap.delete(userId);
    }

    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
