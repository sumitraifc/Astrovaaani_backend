const repo = require("./repository");

exports.getConfig = async () => {
  const privacy = await repo.findByType("privacy_policy");
  const terms = await repo.findByType("terms_conditions");
  const contact = await repo.findByType("contact_us");

  const faqData = await repo.findByType("faq");

  return {
    privacy_policy: privacy || null,
    terms_conditions: terms || null,
    contact_us: contact || null,

    faq: faqData
      ? {
          ...faqData,
          content: JSON.parse(faqData.content || "[]")
        }
      : null
  };
};

exports.getBanners = async () => {
  return await repo.getBanners();
};