const service = require("./service");

exports.reviewStep = async (req, res) => {
  try {
    const { id } = req.params;
    const { step, status, remark } = req.body;

    const result = await service.reviewStep(
      id,
      Number(step),
      status,
      remark
    );z

    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await service.getAll(req.query);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDetail = async (req, res) => {
  try {
    const data = await service.getDetail(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
