const service = require("./service");

/**
 * Create Ticket
 */
exports.createTicket = async (req, res) => {
    try {
        const auth_id = req.user.id;  // JWT se sirf id lenge
        const role    = req.body.role; // frontend se aayega: "user" ya "astrologer"

        if (!role || !['user', 'astrologer'].includes(role)) {
            return res.status(400).json({ success: false, message: 'role required: user or astrologer' });
        }

        const data = {
            ...req.body,
            raised_by:     role,
            user_id:       role === 'user'       ? auth_id : null,
            astrologer_id: role === 'astrologer' ? auth_id : null,
            user_name:     req.body.user_name  || '',
            user_phone:    req.body.user_phone || '',
            user_email:    req.body.user_email || '',
            image:         req.file ? `/uploads/support/${req.file.filename}` : null
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