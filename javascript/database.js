var sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE, (err) =>{
    if (err) return console.error(err.message)
});

db.run(`CREATE TABLE IF NOT EXISTS animaltree(animal_id INTEGER PRIMARY KEY AUTOINCREMENT, parent_id INTEGER CHECK (parent_id >= 0), label TEXT)`, function(err) {
    if (err) return console.error(err.message)
});  

module.exports = db