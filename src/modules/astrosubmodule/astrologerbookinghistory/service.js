const repo = require("./repository");

exports.getBookingHistory = async (astrologerId, query) => {

  const summary = await repo.getSummary(astrologerId);

  const history = await repo.getHistory(astrologerId, query);

  return {
    summary,
    history
  };
};

exports.getBookingDetail = async (astrologerId, id, source) => {
  return await repo.getBookingDetail(astrologerId, id, source);
};