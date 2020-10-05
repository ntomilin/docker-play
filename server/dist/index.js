const app = require('express')();
const redis = require('redis');
const client = redis.createClient({host: 'redis'});

const { Client } = require('pg')
const pgClient = new Client({
    host: 'postgres',
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
});
pgClient.connect()
.then(() => {
    console.log('Connected to PG databasae');
})
.catch((err) => {
    console.error('Error connecting to PG database');
    console.error(err);
    pgClient.query('CREATE DATABASE db', function(err1) {
        if (err1) {
            console.log('ignoring the error'); // ignore if the db is there
            console.error(err1);
            pgClient.end();
        }
        // create a new connection to the new db
        pgClient.connect()
        .then(() => {
            console.log('connected')
        })
        .catch((err3) => {
            console.error('Error connecting 2nd time');
            console.error(err3);
        })
    });
})

client.get('counter', (err, r) => {
    if (!r) {
        client.set("counter", 0);
    }
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
    next();
});

app.get('/', (req, res) => {
    client.get('counter', (err, r) => {
        let index = parseInt(r, 10);
        console.log(`[GET] '/' handled with index [${index}]`)
        client.set('counter', index + 1);

        pgClient.query('SELECT $1::text as message', ['Hello world from Postgres'], (pgErr, result) => {
            if (pgErr) {
                console.error('Error requesting data from PG');
                console.error(pgErr);
                return res.send({Hello: 'World!', counter: index, name: ''});
            }

            const name = result.rows[0].message;
            return res.send({Hello: 'World!', counter: index, name });
        });
    });
 });

app.listen(5000, () => {
    console.log(`Port is listening on port ${5000}`);
});