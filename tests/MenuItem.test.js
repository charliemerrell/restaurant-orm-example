const MenuItem = require('../src/MenuItem');
const db = require('../src/db');
const resetDb = require('../src/resetDb');

describe('basic MenuItem tests', () => {

    beforeAll(resetDb);

    test('MenuItem can have a name', () => {
        const menuitem = new MenuItem({ name: 'Buffalo Wings' });
        expect(menuitem.name).toEqual('Buffalo Wings');
    });

    test('MenuItem can have a price', () => {
        const menuitem = new MenuItem({ price: 2.99 });
        expect(menuitem.price).toEqual(2.99);
    });

    test('MenuItem can have a menu id', () => {
        const menuitem = new MenuItem({ menu_id: 16 });
        expect(menuitem.menu_id).toEqual(16);
    });
});

describe('MenuItem database tests', () => {

    beforeAll(resetDb);

    test('can save a new MenuItem', async (done) => {
        const menuItem = new MenuItem({
            name: 'Prawn Crackers',
            price: 1.99,
            menu_id: 4
        });
        await menuItem.save();
        expect(menuItem.id).toBeDefined();
        db.get(`SELECT name, price, menu_id FROM MenuItem WHERE id=?`, 
        [menuItem.id], (err, row) => {
            if (err) throw new Error(err);
            expect(menuItem.name).toEqual(row.name);
            expect(menuItem.price).toEqual(row.price);
            expect(menuItem.menu_id).toEqual(row.menu_id);
            done();
        });
    });

    test('can update an existing MenuItem', async (done) => {
        const menuItem = new MenuItem({
            name: 'Prawn Crackers',
            price: 1.99,
            menu_id: 4
        });
        await menuItem.save();
        const id = menuItem.id;
        menuItem.price = 1.50;
        await menuItem.save();
        expect(menuItem.id).toEqual(id)
        db.get(`SELECT name, price, menu_id FROM MenuItem WHERE id=?`, 
        [menuItem.id], (err, row) => {
            if (err) throw new Error(err);
            expect(menuItem.name).toEqual(row.name);
            expect(menuItem.price).toEqual(row.price);
            expect(menuItem.menu_id).toEqual(row.menu_id);
            done();
        });
    });
});