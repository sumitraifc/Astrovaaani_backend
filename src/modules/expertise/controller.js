const service = require("./service");

// exports.getAll = async (req, res) => {
//   try {

//     const result = await service.getAll();

//     res.json(result);

//   } catch (err) {

//     res.status(400).json({
//       success: false,
//       message: err.message
//     });

//   }
// };

exports.getAll = async (req, res) => {
  try {

    const result = await service.getAll();

    result.data = result.data.map(item => ({
      ...item,
      image: item.image
        ? `${process.env.BASE_URL}/uploads/${item.image}`
        : null
    }));

    res.json(result);

  } catch (err) {

    res.status(400).json({
      success: false,
      message: err.message
    });

  }
};