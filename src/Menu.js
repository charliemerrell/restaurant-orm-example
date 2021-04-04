const db = require('./db');

class Menu {
    constructor({ id, title, restaurant_id }) {
        this.id = id;
        this.title = title;
        this.restaurant_id = restaurant_id;
    }

    async save() {
        if (this.id) {
            await this.update();
        } else {
            await this.insertInDB();
            this.id = await this.getID();
        }
    }

    update() {
        return new Promise((resolve, reject) => {
            db.run(`UPDATE Menu SET title=?, restaurant_id=? WHERE id=?`, [this.title, this.restaurant_id, this.id], (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    insertInDB() {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO Menu(title, restaurant_id) VALUES(?, ?)`, [this.title, this.restaurant_id], (err) => {
                if (err) reject(err);
                resolve();
            })
        });
    }

    getID() {
        return this.id ? this.id 
        : new Promise((resolve, reject) => {
            db.get(`SELECT id FROM Menu WHERE title=? AND restaurant_id=?`, [this.title, this.restaurant_id], (err, row) => {
                if (err) reject(err);
                resolve(row.id);
            });
        });
    }

    load() {
        if (!this.id) throw new Error("can't load without id");
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM Menu WHERE id=?`, [this.id], (err, { title, restaurant_id }) => {
                if (err) reject(err);
                this.title = title;
                this.restaurant_id = restaurant_id;
                resolve();
            });
        });
    }
}

module.exports = Menu;