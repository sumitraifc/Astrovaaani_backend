const db = require("../../../config/db");

/* ==========================
   DATE FILTER
========================== */

function buildDateFilter(
  from,
  to,
  column = "created_at"
) {

  let sql = "";
  const params = [];

  if (from) {
    sql += ` AND DATE(${column}) >= ?`;
    params.push(from);
  }

  if (to) {
    sql += ` AND DATE(${column}) <= ?`;
    params.push(to);
  }

  return { sql, params };
}

/* ==========================
   SUMMARY
========================== */

exports.getSummary = async (
  astrologerId
) => {

  // const [earningRows] = await db.query(
  //   `
  //   SELECT
  //     COALESCE(SUM(amount),0) total_earning
  //   FROM
  //   (
  //     SELECT amount
  //     FROM call_history
  //     WHERE agent_id = ?

  //     AND status IN (
  //       'answered',
  //       'hangup',
  //       'disconnect'
  //     )

  //     UNION ALL

  //     SELECT amount
  //     FROM chat_conversations
  //     WHERE astrologer_id = ?
  //     AND status = 'ended'
  //   ) earnings
  //   `,
  //   [
  //     astrologerId,
  //     astrologerId
  //   ]
  // );

  const [earningRows] = await db.query(
`
SELECT
  COALESCE(SUM(amount),0) total_earning
FROM
(
  SELECT amount
  FROM call_history
  WHERE agent_id = ?
  AND status IN ('answered','hangup','disconnect')

  UNION ALL

  SELECT amount
  FROM chat_conversations
  WHERE astrologer_id = ?
  AND status = 'ended'

  UNION ALL

  
  SELECT price AS amount
FROM orders
WHERE astrologer_id = ?
AND consultation_type = 'live'
AND status = 'completed'

) earnings
`,
[
  astrologerId,
  astrologerId,
  astrologerId
]
);
  const [withdrawRows] = await db.query(
    `
    SELECT
      COALESCE(SUM(amount),0)
      total_withdrawal
    FROM astrologer_withdrawals
    WHERE astrologer_id = ?
    AND status IN (
      'approved',
      'completed'
    )
    `,
    [astrologerId]
  );

  return {
    total_earning:
      earningRows[0]?.total_earning || 0,

    total_withdrawal:
      withdrawRows[0]?.total_withdrawal || 0
  };
};

/* ==========================
   HISTORY
========================== */

exports.getHistory = async (astrologerId, type = "all", from, to, page, limit) => {
  page  = parseInt(page)  || 1;
  limit = parseInt(limit) || 10;
  const offset = (page - 1) * limit;

  const history = [];

  /* ==========================
     EARNING HISTORY
  ========================== */

  if (
    type === "all" ||
    type === "earning"
  ) {

    const callFilter =
      buildDateFilter(
        from,
        to,
        "created_at"
      );

    const [calls] = await db.query(
      `
      SELECT
        id,
        amount,
        duration,
        call_type,
        status,
        created_at
      FROM call_history
      WHERE agent_id = ?
      AND status IN (
        'answered',
        'hangup',
        'disconnect'
      )
      ${callFilter.sql}
      `,
      [
        astrologerId,
        ...callFilter.params
      ]
    );

    const chatFilter =
      buildDateFilter(
        from,
        to,
        "created_at"
      );

    const [chats] = await db.query(
      `
      SELECT
        id,
        amount,
        duration,
        charge_per_min,
        status,
        created_at
      FROM chat_conversations
      WHERE astrologer_id = ?
      AND status = 'ended'
      ${chatFilter.sql}
      `,
      [
        astrologerId,
        ...chatFilter.params
      ]
    );

const liveFilter = buildDateFilter(
  from,
  to,
  "created_at"
);

const [live] = await db.query(
`
SELECT
  id,
  price,
  status,
  created_at
FROM orders
WHERE astrologer_id = ?
AND consultation_type = 'live'
AND status = 'completed'
${liveFilter.sql}
`,
[
  astrologerId,
  ...liveFilter.params
]
);

    calls.forEach(item => {

      history.push({
        id: item.id,
        type:
          item.call_type === "audio"
            ? "audio_call"
            : "video_call",

        source: "earning",

        amount: Number(item.amount),

        duration: item.duration,

        status: item.status,

        date: item.created_at
      });

    });

    chats.forEach(item => {

      history.push({
        id: item.id,

        type: "chat",

        source: "earning",

        amount: Number(item.amount),

        duration: item.duration,

        charge_per_min:
          Number(
            item.charge_per_min
          ),

        status: item.status,

        date: item.created_at
      });

    });
    live.forEach(item => {
  history.push({
    id: item.id,
    type: "live",
    source: "earning",
    amount: Number(item.price),
    duration: null,
    status: item.status,
    date: item.created_at
  });
});
  }

  /* ==========================
     WITHDRAWAL HISTORY
  ========================== */

  if (
    type === "all" ||
    type === "withdrawal"
  ) {

    const withdrawalFilter =
      buildDateFilter(
        from,
        to,
        "requested_at"
      );

    const [withdrawals] =
      await db.query(
        `
        SELECT
          id,
          amount,
          method,
          utr_number,
          status,
          requested_at
        FROM astrologer_withdrawals
        WHERE astrologer_id = ?
        ${withdrawalFilter.sql}
        `,
        [
          astrologerId,
          ...withdrawalFilter.params
        ]
      );

    withdrawals.forEach(item => {

      history.push({
        id: item.id,

        type: "withdrawal",

        source: "withdrawal",

        amount: Number(item.amount),

        method: item.method,

        utr_number:
          item.utr_number,

        status: item.status,

        date: item.requested_at
      });

    });
  }

  history.sort((a, b) => new Date(b.date) - new Date(a.date));

  const total = history.length;
  const paginated = history.slice(offset, offset + limit);

  return { total, page, limit, data: paginated };
};