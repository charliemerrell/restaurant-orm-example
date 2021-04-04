const Menu = require('../src/Menu');
const db = require('../src/db');
const resetDb = require('../src/resetDb');

describe('basic menu tests', () => {

    beforeAll(resetDb);

    test('menu can have a title', () => {
        const menu = new Menu({ title: 'Spice Merchant' });
        expect(menu.title).toEqual('Spice Merchant');
    });

    test('menu can have a restaurant id', () => {
        const menu = new Menu({ restaurant_id: 16 });
        expect(menu.restaurant_id).toEqual(16);
    });
});

describe('menu database tests', () => {

    beforeAll(resetDb);

    test('can save a new menu', async (done) => {
        const menu = new Menu({
            title: 'Drinks',
            restaurant_id: 4
        });
        await menu.save();
        expect(menu.id).toBeDefined();
        db.get(`SELECT title, restaurant_id FROM Menu WHERE id=?`, 
        [menu.id], (err, row) => {
            if (err) throw new Error(err);
            expect(menu.title).toEqual(row.title);
            expect(menu.restaurant_id).toEqual(row.restaurant_id);
            done();
        });
    });

    test('can update an existing menu', async (done) => {
        const menu = new Menu({
            title: 'Drinks',
            restaurant_id: 4
        });
        await menu.save();
        const id = menu.id;
        menu.restaurant_id = 6;
        menu.title = 'Starters';
        await menu.save();
        expect(menu.id).toEqual(id);
        db.get(`SELECT title, restaurant_id FROM Menu WHERE id=?`, 
        [menu.id], (err, row) => {
            if (err) throw new Error(err);
            expect(menu.title).toEqual(row.title);
            expect(menu.restaurant_id).toEqual(row.restaurant_id);
            done();
        });
    });

    test('can load an existing menu', async () => {
        const menu = new Menu({
            title: 'Drinks',
            restaurant_id: 4
        });
        await menu.save();
        const same_menu = new Menu({ id: menu.id });
        await same_menu.load();
        expect(menu.title).toEqual('Drinks');
        expect(menu.restaurant_id).toEqual(4);
    });
});