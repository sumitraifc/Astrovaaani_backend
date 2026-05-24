exports.validateAstrologerId = (id) => {
  if (!id || isNaN(id)) {
    throw new Error("Valid astrologer id required");
  }
};