const service = require("./service");

exports.createAstrologer = async (req, res) => {
  try {
    const result = await service.createAstrologer(req.body);

    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.getAstrologers = async (req, res) => {
  try {
    const result = await service.getAstrologers(req.query.page, req.query.limit);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// exports.getAstrologerById = async (req, res) => {
//   try {
//     const result = await service.getAstrologerById(
//       req.params.id
//     );

//     res.json(result);
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message
//     });
//   }
// };

exports.getAstrologerById = async (req, res) => {
  try {
    const userId = req.user?.id || null;  

    const result = await service.getAstrologerById(
      userId,
      req.params.id
    );
 console.log("USER ID:", req.user?.id);
console.log("ASTRO ID:", req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.updateAstrologer = async (req, res) => {
  try {
    const result = await service.updateAstrologer(
      req.params.id,
      req.body
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const result = await service.changeStatus(
      req.params.id,
      req.body.status
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};