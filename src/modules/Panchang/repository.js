const pool = require("../../config/db");

/**
 * FIND PANCHANG BY DATE
 */
exports.findByDate = async (date) => {

    const [rows] = await pool.query(
        `SELECT * FROM panchang WHERE date = ?`,
        [date]
    );

    return rows[0] || null;
};


/**
 * CREATE PANCHANG
 */
exports.create = async (data) => {

    const [result] = await pool.query(
        `
        INSERT INTO panchang (

            date,
            day,

            tithi_name,
            tithi_description,
            tithi_status,

            nakshatra_name,
            nakshatra_description,
            nakshatra_status,

            yoga_name,
            yoga_description,
            yoga_status,

            karan_name,
            karan_description,
            karan_status,

            rahu_kaal_time,
            rahu_kaal_status,

            abhijit_muhurat_time,
            abhijit_muhurat_status,

            amrit_kaal_time,
            amrit_kaal_status,

            auspicious,
            overall_day_status,
            overall_description,

            sunrise,
            sunset,
            moonrise,
            moonset,

            paksha,
            hindu_month,
            month,
            year,

            festivals,
            vrat,
            shubh_works,
            avoid_works,

            third_party_id,

            month_overall_energy,
            total_days_in_month,
            total_festivals,
            important_festivals,
            best_days

        )
        VALUES (

            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?

        )
        `,
        data
    );

    return result.insertId;
};


/**
 * INSERT MONTH DATE
 */
exports.insertMonthDate = async (data) => {

    await pool.query(
        `
        INSERT INTO panchang_month_dates (

            panchang_date,
            date,
            day,
            tithi,
            nakshatra,
            festival,
            vrat,
            auspicious,
            is_selected_date

        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        data
    );
};


/**
 * GET MONTH DATES
 */
exports.getMonthDates = async (panchangDate) => {

    const [rows] = await pool.query(
        `
        SELECT *
        FROM panchang_month_dates
        WHERE panchang_date = ?
        ORDER BY date ASC
        `,
        [panchangDate]
    );

    return rows;
};


/**
 * GET ALL PANCHANG
 */
exports.getAll = async () => {

    const [rows] = await pool.query(
        `
        SELECT *
        FROM panchang
        ORDER BY date DESC
        `
    );

    return rows;
};

