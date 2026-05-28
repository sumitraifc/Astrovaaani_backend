const connectedUsers = {};

module.exports = (io) => {

    io.on("connection", (socket) => {

        console.log("SOCKET CONNECTED => ", socket.id);

        /**
         * =========================
         * REGISTER USER
         * =========================
         */
        socket.on("register", (userId) => {

            connectedUsers[userId] = socket.id;

            console.log(
                "USER REGISTERED => ",
                userId,
                socket.id
            );
        });

        /**
         * =========================
         * CALL INITIATE
         * =========================
         */
        socket.on("call-initiate", async (data) => {

            try {

                console.log(
                    "CALL INITIATE EVENT => ",
                    data
                );

                const {
                    user_id,
                    astrologer_id,
                    channel_name,
                    call_type,
                    user_details,
                    astrologer_details
                } = data;

                // astrologer socket id
                const astrologerSocketId =
                    connectedUsers[astrologer_id];

                console.log(
                    "ASTROLOGER SOCKET => ",
                    astrologerSocketId
                );

                // send incoming call
                if (astrologerSocketId) {

                    io.to(astrologerSocketId).emit(
                        "call-initiated",
                        {
                            success: true,
                            message: "Incoming Call",
                            data: {
                                user_id,
                                astrologer_id,
                                channel_name,
                                call_type,
                                user_details,
                                astrologer_details
                            }
                        }
                    );

                    console.log(
                        "CALL EVENT SENT"
                    );

                } else {

                    console.log(
                        "ASTROLOGER OFFLINE"
                    );

                    socket.emit(
                        "user-offline",
                        {
                            success: false,
                            message:
                                "Astrologer Offline"
                        }
                    );
                }

            } catch (error) {

                console.log(
                    "CALL SOCKET ERROR => ",
                    error
                );
            }
        });

        /**
         * =========================
         * DISCONNECT
         * =========================
         */
        socket.on("disconnect", () => {

            console.log(
                "SOCKET DISCONNECTED => ",
                socket.id
            );

            for (const userId in connectedUsers) {

                if (
                    connectedUsers[userId] === socket.id
                ) {

                    delete connectedUsers[userId];
                }
            }
        });
    });
};