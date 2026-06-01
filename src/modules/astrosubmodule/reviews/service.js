const repo = require("./repository");

exports.addReview = async (userId, data) => {
  return await repo.addReview(userId, data);
};

exports.getReviews = async (astrologerId, query) => {
  return await repo.getReviews(astrologerId, query);
};