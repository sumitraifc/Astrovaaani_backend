const repo = require("./repository");

const { v4: uuidv4 } = require("uuid");

exports.createAstrologer = async (data) => {

  const astrologer = await repo.create({
    uuid: uuidv4(),
    ...data
  });

  return {
    success: true,
    message: "Astrologer created",
    astrologer
  };
};

exports.getAstrologers = async () => {

  const astrologers = await repo.getAll();

  return {
    success: true,
    astrologers
  };
};

// exports.getAstrologerById = async (id) => {

//   const astrologer = await repo.getById(id);

//   return {
//     success: true,
//     astrologer
//   };
// };

exports.getAstrologerById = async (userId, astrologerId) => {
  const astrologer = await repo.getById(userId, astrologerId);

   if (astrologer?.profile_image) {
    astrologer.profile_image =
      `${process.env.BASE_URL}/uploads/${astrologer.profile_image}`;
  }
console.log("astrolager details api :",astrologer);
  return {
    success: true,
    astrologer
  };
  
};

exports.updateAstrologer = async (id, data) => {

  await repo.update(id, data);

  return {
    success: true,
    message: "Astrologer updated"
  };
};

exports.changeStatus = async (id, status) => {

  await repo.changeStatus(id, status);

  return {
    success: true,
    message: "Status updated"
  };
};