const repo = require("./repository");

exports.reviewStep = async (astrologerId, step, status, remark) => {
  const astro = await repo.findById(astrologerId);

  if (!astro) throw new Error("Astrologer not found");

  if (step < 1 || step > 5) throw new Error("Invalid step");

  const validStatuses = ["approved", "rejected"];
  if (!validStatuses.includes(status))
    throw new Error("Status must be approved or rejected");

  await repo.updateStep(astrologerId, step, status, remark);

  return { success: true };
};

exports.getAll = async (query) => {
  return await repo.getAll(query);
};

exports.getDetail = async (id) => {
  return await repo.findById(id);
};
