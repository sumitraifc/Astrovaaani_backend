const fs = require('fs');
const db = require('../src/config/db');

(async()=>{
  const [rows] = await db.query("SELECT name FROM migrations");
  const done = rows.map(r=>r.name);

  const files = fs.readdirSync(__dirname + '/migrations');

  for(const file of files){
    if(!done.includes(file)){
      console.log('Running:',file);
      const m = require('./migrations/'+file);
      await m.up(db);
      await db.query("INSERT INTO migrations (name) VALUES (?)",[file]);
    }
  }
})();
