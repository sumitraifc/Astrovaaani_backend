const service = require('./service');
const db = require('../../config/db');
exports.generateLiveToken = async (req, res) => {

  console.log("============= LIVE TOKEN API HIT =============");
  console.log("REQUEST BODY => ", req.body);

  try {
    const { astrologer_id, title } = req.body;

    if (!astrologer_id) {
      return res.status(400).json({
        success: false,
        message: 'astrologer_id required'
      });
    }

    const response = await service.generateLiveToken(req.body);

    return res.status(200).json({
      success: true,
      data: response
    });

  } catch (error) {
    console.log("LIVE CONTROLLER ERROR => ", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getViewerToken = async (req, res) => {

  console.log("============= VIEWER TOKEN API HIT =============");
  console.log("REQUEST BODY => ", req.body);

  try {
    const { user_id, stream_id } = req.body;

    if (!user_id || !stream_id) {
      return res.status(400).json({
        success: false,
        message: 'user_id and stream_id required'
      });
    }

    const response = await service.generateViewerToken(req.body);

    return res.status(200).json({
      success: true,
      data: response
    });

  } catch (error) {
    console.log("VIEWER TOKEN ERROR => ", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getActiveLives = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        ls.id AS stream_id,
        ls.astrologer_id,
        ls.title,
        ls.viewer_count,
        ls.total_likes,
        ls.started_at,
        a.name AS astrologer_name,
        a.profile_image AS astrologer_image,
        a.expertise
      FROM live_streams ls
      JOIN astrologers a ON a.id = ls.astrologer_id
      WHERE ls.status = 'live'
      ORDER BY ls.viewer_count DESC`
    );

    // profile image URL format
    const data = rows.map(row => ({
      ...row,
      astrologer_image: row.astrologer_image
        ? `${process.env.BASE_URL}/uploads/${row.astrologer_image}`
        : null
    }));

    return res.status(200).json({
      success: true,
      total: data.length,
      data
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};