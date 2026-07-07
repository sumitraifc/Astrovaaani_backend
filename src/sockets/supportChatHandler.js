const db = require("../config/db");

/**
 * =========================================
 * ACTIVE ROOMS TRACKER
 * ticket_id => Set of socket.id
 * =========================================
 */
const activeRooms = {};

/**
 * =========================================
 * ROOM NAME HELPER
 * =========================================
 */
const roomName = (ticket_id) => `support_ticket_${ticket_id}`;

/**
 * =========================================
 * SUPPORT CHAT HANDLER
 * =========================================
 */
module.exports = (io, socket) => {

    console.log(`[SupportChat] Socket connected: ${socket.id}`);

    // =========================================
    // JOIN TICKET ROOM
    // emit: join_support_room
    // on:   support_room_joined  (ack)
    // on:   support_room_error   (ack)
    // payload: { ticket_id, sender_type }  sender_type: user | astrologer | admin
    // =========================================
    socket.on("join_support_room", async (data, callback) => {
        try {
            const { ticket_id, sender_type } = data;

            console.log(`[SupportChat] join_support_room => ticket:${ticket_id} sender:${sender_type}`);

            if (!ticket_id || !sender_type) {
                return callback?.({ success: false, message: "ticket_id and sender_type required" });
            }

            // Ticket exist check
            const [rows] = await db.query(
                `SELECT id, ticket_id, status, user_id, astrologer_id, user_name FROM support_tickets WHERE id=? LIMIT 1`,
                [ticket_id]
            );

            if (!rows.length) {
                return callback?.({ success: false, message: "Ticket not found" });
            }

            const ticket = rows[0];

            if (ticket.status === "resolved" || ticket.status === "rejected") {
                return callback?.({ success: false, message: `Ticket is already ${ticket.status}` });
            }

            // Join room
            socket.join(roomName(ticket_id));

            // Track active rooms
            if (!activeRooms[ticket_id]) activeRooms[ticket_id] = new Set();
            activeRooms[ticket_id].add(socket.id);

            // Store on socket for disconnect
            socket.data.support_ticket_id  = ticket_id;
            socket.data.support_sender_type = sender_type;

            // Fetch last 50 messages with attachments
            const [messages] = await db.query(`
                SELECT
                    m.*,
                    (
                        SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id',        a.id,
                                'file_url',  a.file_url,
                                'file_name', a.file_name,
                                'file_type', a.file_type
                            )
                        )
                        FROM support_ticket_attachments a
                        WHERE a.message_id = m.id
                    ) AS attachments
                FROM support_ticket_messages m
                WHERE m.ticket_id = ?
                ORDER BY m.id ASC
                LIMIT 50
            `, [ticket_id]);

            const formatted = messages.map(m => ({
                ...m,
                attachments: m.attachments ? JSON.parse(m.attachments).filter(Boolean) : []
            }));

            // Notify others in room
            socket.to(roomName(ticket_id)).emit("support_user_joined", {
                ticket_id,
                sender_type,
                socket_id: socket.id
            });

            console.log(`[SupportChat] ${sender_type} joined room for ticket:${ticket_id}`);

            callback?.({
                success:  true,
                message:  "Joined support room",
                ticket,
                messages: formatted
            });

        } catch (err) {
            console.error(`[SupportChat] join_support_room error:`, err.message);
            callback?.({ success: false, message: err.message });
        }
    });

    // =========================================
    // SEND MESSAGE (text)
    // emit: support_send_message
    // on:   support_receive_message  (broadcast)
    // on:   support_message_ack      (ack to sender)
    // payload: { ticket_id, sender_type, sender_name, message }
    // =========================================
    socket.on("support_send_message", async (data, callback) => {
        try {
            const { ticket_id, sender_type, sender_name, message } = data;

            console.log(`[SupportChat] support_send_message => ticket:${ticket_id} from:${sender_type}`);

            if (!ticket_id || !sender_type || !message?.trim()) {
                return callback?.({ success: false, message: "ticket_id, sender_type, message required" });
            }

            // Ticket status check
            const [ticketRows] = await db.query(
                `SELECT status FROM support_tickets WHERE id=? LIMIT 1`,
                [ticket_id]
            );

            if (!ticketRows.length) {
                return callback?.({ success: false, message: "Ticket not found" });
            }

            if (ticketRows[0].status === "resolved" || ticketRows[0].status === "rejected") {
                return callback?.({ success: false, message: "Ticket is closed" });
            }

            // Save message
            const [result] = await db.query(`
                INSERT INTO support_ticket_messages (ticket_id, from_type, sender_name, message)
                VALUES (?, ?, ?, ?)
            `, [ticket_id, sender_type, sender_name || sender_type, message.trim()]);

            const [msgRows] = await db.query(
                `SELECT * FROM support_ticket_messages WHERE id=? LIMIT 1`,
                [result.insertId]
            );

            const savedMsg = { ...msgRows[0], attachments: [] };

            // Broadcast to all in room including sender
            io.to(roomName(ticket_id)).emit("support_receive_message", savedMsg);

            console.log(`[SupportChat] Message saved id:${result.insertId} ticket:${ticket_id}`);

            callback?.({ success: true, message: "Message sent", data: savedMsg });

        } catch (err) {
            console.error(`[SupportChat] support_send_message error:`, err.message);
            callback?.({ success: false, message: err.message });
        }
    });

    // =========================================
    // SEND IMAGE MESSAGE
    // emit: support_send_image
    // on:   support_receive_message  (broadcast)
    // on:   ack callback
    // payload: { ticket_id, sender_type, sender_name, file_url, file_name, file_type }
    // file_url: REST API /chat/upload-file se upload karo pehle, phir url yahan bhejo
    // =========================================
    socket.on("support_send_image", async (data, callback) => {
        try {
            const { ticket_id, sender_type, sender_name, file_url, file_name, file_type } = data;

            console.log(`[SupportChat] support_send_image => ticket:${ticket_id} from:${sender_type}`);

            if (!ticket_id || !sender_type || !file_url) {
                return callback?.({ success: false, message: "ticket_id, sender_type, file_url required" });
            }

            // Ticket status check
            const [ticketRows] = await db.query(
                `SELECT status FROM support_tickets WHERE id=? LIMIT 1`,
                [ticket_id]
            );

            if (!ticketRows.length) {
                return callback?.({ success: false, message: "Ticket not found" });
            }

            if (ticketRows[0].status === "resolved" || ticketRows[0].status === "rejected") {
                return callback?.({ success: false, message: "Ticket is closed" });
            }

            // Save message row
            const [msgResult] = await db.query(`
                INSERT INTO support_ticket_messages (ticket_id, from_type, sender_name, message)
                VALUES (?, ?, ?, ?)
            `, [ticket_id, sender_type, sender_name || sender_type, "[image]"]);

            const message_id = msgResult.insertId;

            // Save attachment
            await db.query(`
                INSERT INTO support_ticket_attachments (message_id, ticket_id, file_url, file_name, file_type)
                VALUES (?, ?, ?, ?, ?)
            `, [
                message_id,
                ticket_id,
                file_url,
                file_name || "image",
                file_type || "image"
            ]);

            const savedMsg = {
                id:          message_id,
                ticket_id,
                from_type:   sender_type,
                sender_name: sender_name || sender_type,
                message:     "[image]",
                sent_at:     new Date(),
                attachments: [{
                    file_url:  file_url,
                    file_name: file_name || "image",
                    file_type: file_type || "image"
                }]
            };

            io.to(roomName(ticket_id)).emit("support_receive_message", savedMsg);

            console.log(`[SupportChat] Image saved message_id:${message_id} ticket:${ticket_id}`);

            callback?.({ success: true, message: "Image sent", data: savedMsg });

        } catch (err) {
            console.error(`[SupportChat] support_send_image error:`, err.message);
            callback?.({ success: false, message: err.message });
        }
    });

    // =========================================
    // TYPING
    // emit: support_typing
    // on:   support_typing  (broadcast to others)
    // payload: { ticket_id, sender_type, sender_name }
    // =========================================
    socket.on("support_typing", (data) => {
        const { ticket_id, sender_type, sender_name } = data;
        console.log(`[SupportChat] typing => ticket:${ticket_id} from:${sender_type}`);
        socket.to(roomName(ticket_id)).emit("support_typing", { ticket_id, sender_type, sender_name });
    });

    // =========================================
    // STOP TYPING
    // emit: support_stop_typing
    // on:   support_stop_typing  (broadcast to others)
    // payload: { ticket_id, sender_type }
    // =========================================
    socket.on("support_stop_typing", (data) => {
        const { ticket_id, sender_type } = data;
        socket.to(roomName(ticket_id)).emit("support_stop_typing", { ticket_id, sender_type });
    });

    // =========================================
    // MARK MESSAGES READ
    // emit: support_mark_read
    // on:   support_messages_read  (broadcast)
    // payload: { ticket_id, sender_type }
    // =========================================
    socket.on("support_mark_read", async (data, callback) => {
        try {
            const { ticket_id, sender_type } = data;

            console.log(`[SupportChat] support_mark_read => ticket:${ticket_id} by:${sender_type}`);

            await db.query(
                `UPDATE support_ticket_messages SET is_read=1 WHERE ticket_id=? AND from_type != ?`,
                [ticket_id, sender_type]
            );

            io.to(roomName(ticket_id)).emit("support_messages_read", { ticket_id, sender_type });

            callback?.({ success: true });

        } catch (err) {
            console.error(`[SupportChat] support_mark_read error:`, err.message);
            callback?.({ success: false, message: err.message });
        }
    });

    // =========================================
    // UPDATE TICKET STATUS (admin only)
    // emit: support_update_status
    // on:   support_status_updated  (broadcast)
    // payload: { ticket_id, status, admin_comment }
    // =========================================
    socket.on("support_update_status", async (data, callback) => {
        try {
            const { ticket_id, status, admin_comment } = data;

            console.log(`[SupportChat] support_update_status => ticket:${ticket_id} status:${status}`);

            const allowed = ["open", "in_review", "resolved", "rejected"];
            if (!allowed.includes(status)) {
                return callback?.({ success: false, message: `Invalid status. Allowed: ${allowed.join(", ")}` });
            }

            await db.query(
                `UPDATE support_tickets SET status=?, admin_comment=COALESCE(?, admin_comment) WHERE id=?`,
                [status, admin_comment || null, ticket_id]
            );

            io.to(roomName(ticket_id)).emit("support_status_updated", {
                ticket_id,
                status,
                admin_comment: admin_comment || null
            });

            console.log(`[SupportChat] Status updated ticket:${ticket_id} => ${status}`);

            callback?.({ success: true, message: `Status updated to ${status}` });

        } catch (err) {
            console.error(`[SupportChat] support_update_status error:`, err.message);
            callback?.({ success: false, message: err.message });
        }
    });

    // =========================================
    // LEAVE ROOM
    // emit: leave_support_room
    // on:   support_user_left  (broadcast)
    // payload: { ticket_id, sender_type }
    // =========================================
    socket.on("leave_support_room", (data, callback) => {
        try {
            const { ticket_id, sender_type } = data;

            console.log(`[SupportChat] leave_support_room => ticket:${ticket_id} sender:${sender_type}`);

            socket.leave(roomName(ticket_id));

            if (activeRooms[ticket_id]) {
                activeRooms[ticket_id].delete(socket.id);
                if (activeRooms[ticket_id].size === 0) delete activeRooms[ticket_id];
            }

            socket.to(roomName(ticket_id)).emit("support_user_left", { ticket_id, sender_type });

            callback?.({ success: true });

        } catch (err) {
            console.error(`[SupportChat] leave_support_room error:`, err.message);
            callback?.({ success: false, message: err.message });
        }
    });

    // =========================================
    // DISCONNECT HANDLER
    // =========================================
    const handleSupportDisconnect = () => {
        try {
            const ticket_id   = socket.data.support_ticket_id;
            const sender_type = socket.data.support_sender_type;

            if (!ticket_id) return;

            console.log(`[SupportChat] disconnect => ticket:${ticket_id} sender:${sender_type}`);

            if (activeRooms[ticket_id]) {
                activeRooms[ticket_id].delete(socket.id);
                if (activeRooms[ticket_id].size === 0) delete activeRooms[ticket_id];
            }

            socket.to(roomName(ticket_id)).emit("support_user_left", {
                ticket_id,
                sender_type,
                reason: "disconnected"
            });

        } catch (err) {
            console.error(`[SupportChat] disconnect error:`, err.message);
        }
    };

    return { handleSupportDisconnect };
};
