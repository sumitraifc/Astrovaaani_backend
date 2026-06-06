const service = require('./service');

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