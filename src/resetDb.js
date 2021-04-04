const db = require('./db');

function resetDatabase() {
    db.serialize(() => {
        db.run(`DROP TABLE IF EXISTS Restaurant`);
        db.run(`DROP TABLE IF EXISTS Menu`);
        db.run(`DROP TABLE IF EXISTS MenuItem`);

        db.run(`CREATE TABLE Restaurant(
            id INTEGER PRIMARY KEY,
            name TEXT,
            image TEXT
        )`);

        db.run(`CREATE TABLE Menu(
            id INTEGER PRIMARY KEY,
            title TEXT,
            restaurant_id INTEGER,
            FOREIGN KEY(restaurant_id) REFERENCES Restaurant(id)
        )`);

        db.run(`CREATE TABLE MenuItem(
            id INTEGER PRIMARY KEY,
            name TEXT,
            price REAL,
            menu_id INTEGER,
            FOREIGN KEY(menu_id) REFERENCES Menu(id)
        )`);
    });
}

module.exports = resetDatabase;