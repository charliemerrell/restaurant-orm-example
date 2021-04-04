const db = require('./db');

class MenuItem {
    constructor({ id, name, price, menu_id }) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.menu_id = menu_id;
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
            db.run(`UPDATE MenuItem SET name=?, price=?, menu_id=? WHERE id=?`, [this.name, this.price, this.menu_id, this.id], (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    insertInDB() {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO MenuItem(name, price, menu_id) VALUES(?, ?, ?)`, [this.name, this.price, this.menu_id], (err) => {
                if (err) reject(err);
                resolve();
            })
        });
    }

    getID() {
        return this.id ? this.id 
        : new Promise((resolve, reject) => {
            db.get(`SELECT id FROM MenuItem WHERE name=? AND menu_id=?`, [this.name, this.menu_id], (err, row) => {
                if (err) reject(err);
                resolve(row.id);
            });
        });
    }

    load() {
        if (!this.id) throw new Error("can't load without id");
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM MenuItem WHERE id=?`, [this.id], (err, { name, price, menu_id }) => {
                if (err) reject(err);
                this.name = name;
                this.price = price;
                this.menu_id = menu_id;
                resolve();
            });
        });
    }
}

module.exports = MenuItem;