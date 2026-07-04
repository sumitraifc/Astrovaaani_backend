const repository = require("./repository");

exports.getEarningHistory = async (astrologerId, query) => {
  const summary = await repository.getSummary(astrologerId);

  const result = await repository.getHistory(
    astrologerId,
    query.type,
    query.from,
    query.to,
    query.page,
    query.limit
  );

  return {
    total_earning:      Number(summary.total_earning    || 0),
    total_withdrawal:   Number(summary.total_withdrawal || 0),
    available_balance:  Number(summary.total_earning    || 0) - Number(summary.total_withdrawal || 0),
    ...result
  };
};