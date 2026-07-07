const service     = require("./service");
const db          = require("../../config/db");

/**
 * Create Ticket
 */
exports.createTicket = async (req, res) => {
    try {
        const auth_id = req.user.id;
        const role    = req.body.role;

        if (!role || !['user', 'astrologer'].includes(role)) {
            return res.status(400).json({ success: false, message: 'role required: user or astrologer' });
        }

        // DB se name, phone/mobile, email fetch karo
        let user_name = '', user_phone = '', user_email = '';

        if (role === 'user') {
            const [rows] = await db.query('SELECT name, mobile, email FROM users WHERE id=? LIMIT 1', [auth_id]);
            if (rows[0]) { user_name = rows[0].name || ''; user_phone = rows[0].mobile || ''; user_email = rows[0].email || ''; }
        } else {
            const [rows] = await db.query('SELECT name, phone, email FROM astrologers WHERE id=? LIMIT 1', [auth_id]);
            if (rows[0]) { user_name = rows[0].name || ''; user_phone = rows[0].phone || ''; user_email = rows[0].email || ''; }
        }

        const data = {
            ...req.body,
            raised_by:     role,
            user_id:       role === 'user'       ? auth_id : null,
            astrologer_id: role === 'astrologer' ? auth_id : null,
            user_name,
            user_phone,
            user_email,
            images: req.files && req.files.length > 0
                ? req.files.map(f => `/uploads/support/${f.filename}`)
                : []
        };

        const result = await service.createTicket(data);
        return res.status(200).json(result);

    } catch (error) {
        console.log("CREATE TICKET ERROR => ", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Get Ticket List
 */
exports.getTickets = async (req, res) => {
    try {
        const auth = {
            id:   req.user.id,
            role: req.query.role  // frontend query mein bhejega: ?role=user
        };

        const result = await service.getTickets(req.query, auth);
        return res.status(200).json(result);

    } catch (error) {
        console.log("GET TICKETS ERROR => ", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

/**
 * Get Ticket Detail
 */
exports.getTicketById = async (req, res) => {
    try {

        const id = req.params.id;

        const result = await service.getTicketById(id);

        return res.status(200).json(result);

    } catch (error) {

        console.log("GET TICKET DETAIL ERROR => ", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });

    }
};

/**
 * Reply Ticket (with files)
 */
exports.replyTicket = async (req, res) => {
    try {
        const ticket_id = req.params.id;

        const data = {
            ticket_id,
            from_type:   req.body.role || 'user',  // frontend se aayega
            sender_name: req.body.sender_name || 'User',
            message:     req.body.message
        };

        const result = await service.replyTicket(data, req.files);
        return res.status(200).json(result);

    } catch (error) {
        console.log("REPLY TICKET ERROR => ", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

/**
 * Update Status
 */
exports.updateStatus = async (req, res) => {
    try {

        const ticket_id = req.params.id;
        const { status } = req.body;

        const result = await service.updateStatus(ticket_id, status);

        return res.status(200).json(result);

    } catch (error) {

        console.log("UPDATE STATUS ERROR => ", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });

    }
};

/**
 * Get Attachments
 */
exports.getAttachments = async (req, res) => {
    try {

        const ticket_id = req.params.id;

        const result = await service.getAttachments(ticket_id);

        return res.status(200).json(result);

    } catch (error) {

        console.log("GET ATTACHMENTS ERROR => ", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });

    }
};

/**
 * Delete Attachment
 */
exports.deleteAttachment = async (req, res) => {
    try {

        const id = req.params.id;

        const result = await service.deleteAttachment(id);

        return res.status(200).json(result);

    } catch (error) {

        console.log("DELETE ATTACHMENT ERROR => ", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });

    }
};