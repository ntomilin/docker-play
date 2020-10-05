const app = require('express')();
const redis = require('redis');
const client = redis.createClient({host: 'redis'});


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
        return res.send({Hello: 'World!', counter: index});
    });
});

app.listen(5000, () => {
    console.log(`Port is listening on port ${5000}`);
});