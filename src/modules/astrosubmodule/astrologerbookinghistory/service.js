const repo = require("./repository");

exports.getBookingHistory = async (astrologerId, query) => {
  const summary = await repo.getSummary(astrologerId);
  const result  = await repo.getHistory(astrologerId, query);
  return { summary, ...result };
};

exports.getBookingDetail = async (astrologerId, id, source) => {
  return await repo.getBookingDetail(astrologerId, id, source);
};