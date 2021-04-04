const db = require('./db');
const Menu = require('./Menu')

class Restaurant {
    constructor({ id, name, image}) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.menus = [];
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
            db.run(`UPDATE Restaurant SET name=?, image=? WHERE id=?`, [this.name, this.image, this.id], (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }

    insertInDB() {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO Restaurant(name, image) VALUES(?, ?)`, [this.name, this.image], (err) => {
                if (err) reject(err);
                resolve();
            })
        });
    }

    getID() {
        return this.id ? this.id 
        : new Promise((resolve, reject) => {
            db.get(`SELECT id FROM Restaurant WHERE name=? AND image=?`, [this.name, this.image], (err, row) => {
                if (err) reject(err);
                resolve(row.id);
            });
        });
    }

    load() {
        if (!this.id) throw new Error("can't load without id");
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM Restaurant WHERE id=?`, [this.id], (err, { name, image }) => {
                if (err) reject(err);
                this.name = name;
                this.image = image;
                resolve();
            });
        });
    }

    async createMenu({ id, title }) {
        const restaurant_id = await this.getID();
        const menu = new Menu({ id, title, restaurant_id });
        this.menus.push(menu);
        return menu;
    }
}

module.exports = Restaurant;