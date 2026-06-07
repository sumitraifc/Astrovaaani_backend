const cron = require("node-cron");
const service = require("../modules/horoscope/service");

// DAILY 12 AM
cron.schedule("0 0 * * *", async () => {
  console.log("🌙 DAILY HOROSCOPE SYNC STARTED");

  try {
    await service.syncHoroscope("daily");
    console.log("✅ DAILY DONE");
  } catch (err) {
    console.log("❌ DAILY ERROR:", err.message);
  }
});


// WEEKLY (Sunday 1 AM)
cron.schedule("0 1 * * 0", async () => {
  console.log("📅 WEEKLY SYNC STARTED");

  try {
    await service.syncHoroscope("weekly");
    console.log("✅ WEEKLY DONE");
  } catch (err) {
    console.log("❌ WEEKLY ERROR:", err.message);
  }
});


// MONTHLY (1st day 2 AM)
cron.schedule("0 2 1 * *", async () => {
  console.log("📆 MONTHLY SYNC STARTED");

  try {
    await service.syncHoroscope("monthly");
    console.log("✅ MONTHLY DONE");
  } catch (err) {
    console.log("❌ MONTHLY ERROR:", err.message);
  }
});


// YEARLY (1 Jan 3 AM)
cron.schedule("0 3 1 1 *", async () => {
  console.log("🎉 YEARLY SYNC STARTED");

  try {
    await service.syncHoroscope("yearly");
    console.log("✅ YEARLY DONE");
  } catch (err) {
    console.log("❌ YEARLY ERROR:", err.message);
  }
});