const service = require("./service");

/**
 * ADD FAVORITE
 */
exports.addFavorite = async (req, res) => {
  try {
    const result = await service.addFavorite(
      req.user.id,
      req.params.astrologerId
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * GET FAVORITES
 */
exports.getFavorites = async (req, res) => {
  try {
    const result = await service.getFavorites(req.user.id, req.query.page, req.query.limit);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * REMOVE FAVORITE
 */
exports.removeFavorite = async (req, res) => {
  try {
    const result = await service.removeFavorite(
      req.user.id,
      req.params.astrologerId
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};