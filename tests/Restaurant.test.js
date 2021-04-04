const Restaurant = require('../src/Restaurant');
const resetDb = require('../src/resetDb');
const db = require('../src/db');

describe('basic restaurant tests', () => {

    beforeAll(resetDb);

    test('restaurant can have a name', () => {
        const restaurant = new Restaurant({name: 'Rocpool'});
        expect(restaurant.name).toEqual('Rocpool');
    });

    test('restaurant can have an image', () => {
        const restaurant = new Restaurant({image: 'Rocpool picture'});
        expect(restaurant.image).toEqual('Rocpool picture');
    });

    test('restaurant can have an id', () => {
        const restaurant = new Restaurant({id: 17});
        expect(restaurant.id).toEqual(17);
    });
});

describe('restaurant database tests', () => {

    beforeAll(resetDb);

    test('can save a new restaurant', async (done) => {
        const restaurant = new Restaurant({
            name: 'Rocpool',
            image: 'Rocpool pic'
        });
        await restaurant.save();
        expect(restaurant.id).toBeDefined();
        db.get(`SELECT name, image FROM Restaurant WHERE id=?`, 
        [restaurant.id], (err, row) => {
            if (err) throw new Error(err);
            expect(row.name).toEqual(restaurant.name);
            expect(row.image).toEqual(restaurant.image);
            done();
        });
    });

    test('can update an existing restaurant', async (done) => {
        const restaurant = new Restaurant({
            name: 'Rocpool',
            image: 'Rocpool pic'
        });
        await restaurant.save();
        const id = restaurant.id;
        restaurant.name = 'Mustard Seed';
        await restaurant.save();
        expect(id).toEqual(restaurant.id);
        db.get(`SELECT name, image FROM Restaurant WHERE id=?`, 
        [restaurant.id], (err, row) => {
            if (err) throw new Error(err);
            expect(row.name).toEqual(restaurant.name);
            expect(row.image).toEqual(restaurant.image);
            done();
        });
    });

    test('can load an existing restaurant', async () => {
        const restaurant = new Restaurant({
            name: 'Rocpool',
            image: 'Rocpool pic'
        });
        await restaurant.save();
        const same_restaurant = new Restaurant({
            id: restaurant.id
        });
        await same_restaurant.load();
        expect(same_restaurant.name).toEqual(restaurant.name);
        expect(same_restaurant.image).toEqual(restaurant.image);
        expect(same_restaurant.id).toEqual(restaurant.id);
    });

    test('can create a menu', async () => {
        const restaurant = new Restaurant({
            name: 'Rocpool',
            image: 'Rocpool pic'
        });
        await restaurant.save();
        const menu = await restaurant.createMenu({
            title: 'Starters'
        });
        expect(restaurant.menus).toEqual([menu]);
    });
});