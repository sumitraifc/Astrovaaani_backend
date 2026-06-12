const axios = require("axios");
const repo = require("./repository");

exports.storePanchang = async (date) => {

    const existing = await repo.findByDate(date);

    if (existing) {
        return {
            status: true,
            message: "Panchang already exists",
            data: existing
        };
    }

    const response = await axios.post(
        "https://fctechbackend.shop/api/panchang/date",
        { date }
    );

    const p = response.data.data;

    const payload = [

        p.date,
        p.day,

        p.tithi?.name,
        p.tithi?.description,
        p.tithi?.status,

        p.nakshatra?.name,
        p.nakshatra?.description,
        p.nakshatra?.status,

        p.yoga?.name,
        p.yoga?.description,
        p.yoga?.status,

        p.karan?.name,
        p.karan?.description,
        p.karan?.status,

        p.rahu_kaal?.time,
        p.rahu_kaal?.status,

        p.abhijit_muhurat?.time,
        p.abhijit_muhurat?.status,

        p.amrit_kaal?.time,
        p.amrit_kaal?.status,

        p.auspicious,
        p.overall_day_status,
        p.overall_description,

        p.sunrise,
        p.sunset,
        p.moonrise,
        p.moonset,

        p.paksha,
        p.hindu_month,
        p.month,
        p.year,

        JSON.stringify(p.festivals || []),
        JSON.stringify(p.vrat || []),
        JSON.stringify(p.shubh_works || []),
        JSON.stringify(p.avoid_works || []),

        p._id
    ];

    const id = await repo.create(payload);

    return {
        status: true,
        message: "Panchang stored successfully",
        id
    };
};

exports.getAll = async () => {
    return repo.getAll();
};