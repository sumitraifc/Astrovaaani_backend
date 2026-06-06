const repo = require('./repository');
exports.getAll       = (q)                                      => repo.getAll(q);
exports.getById      = (id)                                     => repo.getById(id);
exports.updateStatus = (id, status, comment)                    => repo.updateStatus(id, status, comment);
exports.addMessage   = (ticketId, fromType, senderName, msg)    => repo.addMessage(ticketId, fromType, senderName, msg);
exports.addAttachment= (msgId, ticketId, url, name, type)       => repo.addAttachment(msgId, ticketId, url, name, type);
exports.getStats     = ()                                       => repo.getStats();
