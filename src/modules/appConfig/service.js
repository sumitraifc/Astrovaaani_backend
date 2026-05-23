const repo = require("./repository");

exports.getPrivacyPolicy = async () => {
  return await repo.findByType("privacy_policy");
};

exports.getTerms = async () => {
  return await repo.findByType("terms_conditions");
};

exports.getContactUs = async () => {
  return await repo.findByType("contact_us");
};

exports.getFaqs = async () => {
  const data = await repo.findByType("faq");

  return {
    ...data,
    content: JSON.parse(data.content || "[]")
  };
};

exports.getBanners = async () => {
  return await repo.getBanners();
};