const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const controller = require("./controller");
const auth = require("../../middlewares/auth");

const uploadPath = path.join(process.cwd(), "uploads", "support");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename:    (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`)
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg','image/png','image/jpg','image/webp','application/pdf'];
        allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only images and PDF allowed'));
    }
});

// Create Ticket (with optional image)
router.post("/tickets", auth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), controller.createTicket);

// Get Ticket List
router.get("/tickets", auth, controller.getTickets);

// Get Ticket Detail
router.get("/tickets/:id", auth, controller.getTicketById);

// Reply to Ticket (with optional attachments)
router.post("/tickets/:id/reply", auth, upload.array("files", 5), controller.replyTicket);

// Update Ticket Status
router.patch("/tickets/:id/status", auth, controller.updateStatus);

// Get Attachments of Ticket
router.get("/tickets/:id/attachments", auth, controller.getAttachments);

// Delete Attachment
router.delete("/attachments/:id", auth, controller.deleteAttachment);

module.exports = router;