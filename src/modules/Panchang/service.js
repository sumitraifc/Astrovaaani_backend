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
        "https://fctechbackend.shop/api/panchang/panchang/date-with-month",
        { date }
    );

    const p = response.data.date_detail;
    const month = response.data.month_detail;

    /**
     * MAIN PANCHANG TABLE PAYLOAD
     */
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

        p._id,

        month?.month_overview?.overall_energy,
        month?.month_overview?.total_days_in_month,
        month?.month_overview?.total_festivals,
        JSON.stringify(month?.month_overview?.important_festivals || []),
        JSON.stringify(month?.month_overview?.best_days || [])
    ];

    /**
     * SAVE MAIN PANCHANG
     */
    const id = await repo.create(payload);

    /**
     * SAVE MONTH DATES
     */
    if (month?.dates?.length) {

        for (const item of month.dates) {

            await repo.insertMonthDate([

                p.date,                  // panchang_date
                item.date,
                item.day,
                item.tithi,
                item.nakshatra,
                item.festival,
                item.vrat,
                item.auspicious,
                item.is_selected_date ? 1 : 0

            ]);
        }
    }

    return {
        status: true,
        message: "Panchang stored successfully",
        id
    };
};


exports.getAll = async () => {
    return repo.getAll();
};


exports.getPanchangByDate = async (date) => {

    let data = await repo.findByDate(date);

    if (!data) {
        await exports.storePanchang(date);
        data = await repo.findByDate(date);
    }

    // month dates table se lao
    const monthDates = await repo.getMonthDates(date);

    return {
        status: true,

        date_detail: {

            tithi: {
                name: data.tithi_name,
                description: data.tithi_description,
                status: data.tithi_status
            },

            nakshatra: {
                name: data.nakshatra_name,
                description: data.nakshatra_description,
                status: data.nakshatra_status
            },

            yoga: {
                name: data.yoga_name,
                description: data.yoga_description,
                status: data.yoga_status
            },

            karan: {
                name: data.karan_name,
                description: data.karan_description,
                status: data.karan_status
            },

            rahu_kaal: {
                time: data.rahu_kaal_time,
                status: data.rahu_kaal_status
            },

            abhijit_muhurat: {
                time: data.abhijit_muhurat_time,
                status: data.abhijit_muhurat_status
            },

            amrit_kaal: {
                time: data.amrit_kaal_time,
                status: data.amrit_kaal_status
            },

            _id: data.third_party_id,

            date: data.date,
            day: data.day,

            auspicious: data.auspicious,

            overall_day_status: data.overall_day_status,
            overall_description: data.overall_description,

            sunrise: data.sunrise,
            sunset: data.sunset,
            moonrise: data.moonrise,
            moonset: data.moonset,

            paksha: data.paksha,
            hindu_month: data.hindu_month,
            month: data.month,
            year: data.year,

            festivals: JSON.parse(data.festivals || "[]"),
            vrat: JSON.parse(data.vrat || "[]"),
            shubh_works: JSON.parse(data.shubh_works || "[]"),
            avoid_works: JSON.parse(data.avoid_works || "[]")
        },

        month_detail: {

            month_overview: {

                month: data.month,
                year: data.year,
                hindu_month: data.hindu_month,

                total_days_in_month: data.total_days_in_month,
                total_festivals: data.total_festivals,

                important_festivals: JSON.parse(
                    data.important_festivals || "[]"
                ),

                overall_energy: data.month_overall_energy,

                best_days: JSON.parse(
                    data.best_days || "[]"
                )
            },

            dates: monthDates.map(item => ({
                date: item.date,
                day: item.day,
                tithi: item.tithi,
                nakshatra: item.nakshatra,
                festival: item.festival,
                vrat: item.vrat,
                auspicious: item.auspicious,
                is_selected_date: !!item.is_selected_date
            }))
        }
    };
};