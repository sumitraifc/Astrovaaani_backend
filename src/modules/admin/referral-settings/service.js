const repo = require('./repository');

exports.get          = ()       => repo.get();
exports.update       = (data)   => repo.update(data);
exports.getGifts     = ()       => repo.getGifts();
exports.createGift   = (data)   => repo.createGift(data);
exports.updateGift   = (id, d)  => repo.updateGift(id, d);
exports.deleteGift   = (id)     => repo.deleteGift(id);
