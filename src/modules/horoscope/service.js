const { default: axios } = require("axios");
const repo = require("./repository");

const rashiMap = {
Aries: "Mesh",
Taurus: "Vrishabh",
Gemini: "Mithun",
Cancer: "Kark",
Leo: "Singh",
Virgo: "Kanya",
Libra: "Tula",
Scorpio: "Vrishchik",
Sagittarius: "Dhanu",
Capricorn: "Makar",
Aquarius: "Kumbh",
Pisces: "Meen"
};

const timeframeMap = {
daily: "today",
weekly: "week",
yearly: "year"
};

exports.getZodiacs = async () => {
return await repo.getZodiacs();
};

exports.getHoroscope = async (zodiacId, type) => {
return await repo.getHoroscope(zodiacId, type);
};

exports.getById = async (id) => {
return await repo.getById(id);
};

exports.create = async (data) => {
return await repo.create(data);
};

exports.update = async (id, data) => {
return await repo.update(id, data);
};

exports.syncHoroscope = async (type = "daily") => {
console.log(`\n🚀 ${type.toUpperCase()} HOROSCOPE SYNC STARTED\n`);

const zodiacs = await repo.getZodiacs();

for (const zodiac of zodiacs) {
try {
const rashi = rashiMap[zodiac.name];


  if (!rashi) {
    console.log(`❌ Mapping not found for ${zodiac.name}`);
    continue;
  }

  console.log(`🔄 Fetching ${rashi} (${type})`);

  const response = await axios.post(
    "https://fctechbackend.shop/api/horoscope/get",
    {
      rashi,
      timeframe: timeframeMap[type]
    }
  );

  const apiData = response.data.data;
  const horoscope = apiData.horoscope;

  const existing = await repo.findByDate(
    zodiac.id,
    apiData.date,
    type
  );

  if (existing) {
    console.log(
      `⚠️ Already exists -> ${zodiac.name} (${type})`
    );
    continue;
  }

  await repo.createHoroscope({
    zodiac_id: zodiac.id,
    date: apiData.date,
    type,

    lucky_number: horoscope.luckyNumber,
    lucky_color: horoscope.luckyColor,
    lucky_time: horoscope.luckyTime,

    love: horoscope.love?.description || null,
    career: horoscope.career?.description || null,
    money: horoscope.finance?.description || null,
    health: horoscope.health?.description || null,
    personal_growth:
      horoscope.personalGrowth?.description || null
  });

  console.log(
    `✅ Saved ${zodiac.name} (${type})`
  );

} catch (error) {
  console.log(
    `❌ Error in ${zodiac.name}:`,
    error.message
  );
}


}

console.log(`\n✅ ${type.toUpperCase()} SYNC COMPLETED\n`);

return true;
};
