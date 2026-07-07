const repo = require("./repository");

const BASE_URL = process.env.BASE_URL ;

/**
 * Create Ticket (User / Astrologer)
 */
exports.createTicket = async (data) => {
    try {
        const ticket_id = await repo.generateTicketId();

        const ticketData = {
            ticket_id,
            raised_by:     data.raised_by,
            user_id:       data.user_id       || null,
            astrologer_id: data.astrologer_id || null,
            user_name:     data.user_name,
            user_phone:    data.user_phone,
            user_email:    data.user_email,
            issue:         data.issue,
            description:   data.description,
            category:      data.category || 'technical',
            priority:      data.priority || 'medium'
        };

        const result = await repo.createTicket(ticketData);
        const ticketDbId = result.insertId;

        // First message
        const msgResult = await repo.createMessage({
            ticket_id:   ticketDbId,
            from_type:   data.raised_by,
            sender_name: data.user_name || 'User',
            message:     data.description
        });

        // Image attachment (if uploaded)
        if (data.image) {
            await repo.saveAttachment({
                message_id: msgResult.insertId,
                ticket_id:  ticketDbId,
                file_url:   data.image,
                file_name:  data.image.split('/').pop(),
                file_type:  'image'
            });
        }

        return {
            success: true,
            message: 'Ticket created successfully',
            data: { id: ticketDbId, ticket_id }
        };

    } catch (error) {
        throw error;
    }
};

/**
 * Ticket List (Pagination)
 */
exports.getTickets = async (query, auth) => {
    try {

        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const offset = (page - 1) * limit;

        const raised_by = auth.role; // user / astrologer
        const user_id = auth.role === 'user' ? auth.id : null;
        const astrologer_id = auth.role === 'astrologer' ? auth.id : null;

        const rows = await repo.getTickets(
            raised_by,
            user_id,
            astrologer_id,
            query.status,
            limit,
            offset
        );

        const count = await repo.getTicketCount(
            raised_by,
            user_id,
            astrologer_id,
            query.status
        );

        return {
            success: true,
            message: "Ticket list fetched",
            data: rows,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            }
        };

    } catch (error) {
        throw error;
    }
};

/**
 * Ticket Detail
 */
exports.getTicketById = async (id) => {
    try {

        const ticket = await repo.getTicketById(id);

        if (!ticket) {
            return {
                success: false,
                message: "Ticket not found"
            };
        }

        const messages = await repo.getMessages(id);

        // Attachments URL fix
        const formattedMessages = messages.map(msg => {
            return {
                ...msg,
                attachments: msg.attachments
                    ? JSON.parse(msg.attachments).map(a => ({
                        ...a,
                        file_url: `${BASE_URL}${a.file_url}`
                    }))
                    : []
            };
        });

        return {
            success: true,
            data: {
                ...ticket,
                messages: formattedMessages
            }
        };

    } catch (error) {
        throw error;
    }
};

/**
 * Reply Ticket
 */
exports.replyTicket = async (data, files) => {
    try {

        const result = await repo.replyTicket({
            ticket_id: data.ticket_id,
            from_type: data.from_type,
            sender_name: data.sender_name,
            message: data.message
        });

        const message_id = result.insertId;

        // Attachments (if any)
        if (files && files.length > 0) {

            for (let file of files) {

                const file_url = `/uploads/support/${file.filename}`;

                await repo.saveAttachment({
                    message_id,
                    ticket_id: data.ticket_id,
                    file_url,
                    file_name: file.originalname,
                    file_type: file.mimetype.startsWith("image") ? "image" : "file"
                });
            }
        }

        return {
            success: true,
            message: "Reply sent successfully"
        };

    } catch (error) {
        throw error;
    }
};

/**
 * Update Ticket Status
 */
exports.updateStatus = async (ticket_id, status) => {
    try {

        await repo.updateStatus(ticket_id, status);

        return {
            success: true,
            message: "Status updated"
        };

    } catch (error) {
        throw error;
    }
};

/**
 * Get Attachments
 */
exports.getAttachments = async (ticket_id) => {
    try {

        const rows = await repo.getAttachments(ticket_id);

        const data = rows.map(item => ({
            ...item,
            file_url: `${BASE_URL}${item.file_url}`
        }));

        return {
            success: true,
            data
        };

    } catch (error) {
        throw error;
    }
};

/**
 * Delete Attachment
 */
exports.deleteAttachment = async (id) => {
    try {

        await repo.deleteAttachment(id);

        return {
            success: true,
            message: "Attachment deleted"
        };

    } catch (error) {
        throw error;
    }
};