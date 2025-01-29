module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("New client connected for messaging");

    // Listen for a user joining their own room (user-specific)
    socket.on("joinRoom", (userId) => {
      socket.join(userId);
      console.log(`User joined room: ${userId}`);
    });

    // Listen for new message notifications
    socket.on("sendMessage", ({ recipientId, content, from }) => {
      io.to(recipientId).emit("newMessage", { content, from });
    });

    socket.on("disconnect", () => {
      console.log("Messaging client disconnected");
    });
  });
};
