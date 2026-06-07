const service = require("./service");

exports.getZodiacs = async (req, res) => {
  try {
    const data = await service.getZodiacs();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getHoroscope = async (req, res) => {
  try {
    const { zodiacId } = req.params;
    const { type } = req.query;

    const data = await service.getHoroscope(
      zodiacId,
      type || "daily"
    );

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await service.getById(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await service.create(req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await service.update(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.syncHoroscope = async (req, res) => {
try {


const { type = "daily" } = req.body;

console.log("\n==============================");
console.log("HOROSCOPE SYNC API HIT");
console.log("TYPE :", type);
console.log("==============================\n");

const data = await service.syncHoroscope(type);

res.json({
  success: true,
  message: `${type} horoscope synced successfully`,
  data
});


} catch (err) {


console.log("\n❌ HOROSCOPE SYNC ERROR");
console.log(err);

res.status(500).json({
  success: false,
  message: err.message
});


}
};
