const pool = require("../../config/db");

exports.findByDate = async (date) => {
    const [rows] = await pool.query(
        `SELECT * FROM panchang WHERE date = ?`,
        [date]
    );

    return rows[0] || null;
};

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

            third_party_id
        )
        VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
        `,
        data
    );

    return result.insertId;
};

exports.getAll = async () => {

    const [rows] = await pool.query(`
        SELECT *
        FROM panchang
        ORDER BY date DESC
    `);

    return rows;
};

exports.findByDate = async (date) => {
    const [rows] = await pool.query(
        `SELECT * FROM panchang WHERE date = ?`,
        [date]
    );

    return rows[0] || null;
};