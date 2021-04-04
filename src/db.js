const { Database } = require('sqlite3').verbose();

const location = process.env.NODE_ENV === 'test' ? ':memory:' : './db.sqlite';

module.exports = new Database(location);