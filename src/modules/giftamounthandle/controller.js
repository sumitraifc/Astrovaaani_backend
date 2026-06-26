const Service = require("./service");

exports.getList = async (req, res) => {
  try {

    const data = await Service.getList();

    return res.json({
      success: true,
      message: "Gift list fetched successfully.",
      data
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message
    });

  }
};