module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("New client connected for auction");

    socket.on("joinAuction", (auctionId) => {
      socket.join(auctionId);
      console.log(`User joined auction room: ${auctionId}`);
    });

    socket.on("newBid", ({ auctionId, bidAmount, bidder }) => {
      io.to(auctionId).emit("bidUpdate", { bidAmount, bidder });
    });

    socket.on("disconnect", () => {
      console.log("Auction client disconnected");
    });
  });
};
