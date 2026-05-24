const repo = require("./repository");
const validator = require("./validator");

/**
 * ADD FAVORITE
 */
exports.addFavorite = async (userId, astrologerId) => {
  validator.validateAstrologerId(astrologerId);

  const exists = await repo.checkExists(userId, astrologerId);

  if (exists) {
    throw new Error("Already added in favorites");
  }

  await repo.addFavorite(userId, astrologerId);

  return {
    success: true,
    message: "Added to favorites"
  };
};

/**
 * GET FAVORITES
 */
exports.getFavorites = async (userId) => {
  const favorites = await repo.getFavorites(userId);

  return {
    success: true,
    total: favorites.length,
    data: favorites
  };
};

/**
 * REMOVE FAVORITE
 */
exports.removeFavorite = async (userId, astrologerId) => {
  validator.validateAstrologerId(astrologerId);

  await repo.removeFavorite(userId, astrologerId);

  return {
    success: true,
    message: "Removed from favorites"
  };
};