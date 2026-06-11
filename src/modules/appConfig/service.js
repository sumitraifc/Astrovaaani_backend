const repo = require("./repository");

exports.getConfig = async () => {
  const privacy = await repo.findByType("privacy_policy");
  const terms = await repo.findByType("terms_conditions");
  const contact = await repo.findByType("contact_us");
  const faqData = await repo.findByType("faq");

  const support = await repo.getSupportLinks();

  return {
    privacy_policy: privacy || null,
    terms_conditions: terms || null,
    contact_us: contact || null,

    faq: faqData
      ? {
          ...faqData,
          content: JSON.parse(faqData.content || "[]")
        }
      : null,

    // ✅ NEW SUPPORT FORMAT
    support: support.map(item => ({
      key: item.meta_key,
      title: item.title,
      url: item.content,
      image: item.image
  ? `${process.env.BASE_URL}/uploads/${item.image}`
  : null
    }))
  };
};

exports.getBanners = async () => {
  return await repo.getBanners();
};