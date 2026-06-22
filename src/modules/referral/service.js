const repo = require("./repository");

exports.getStats = async (astrologerId) => {
    return await repo.getStats(astrologerId);
};

exports.getHistory = async (astrologerId) => {
    return await repo.getHistory(astrologerId);
};