require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const pgp = require('pg-promise')();

const dbConnectionOptions = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
};

const db = pgp(dbConnectionOptions);

const expressSanitized = require('express-sanitized');
const { sanitizeBody } = require('express-validator/filter');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSanitized());

app.use(express.static('static'));

app.post('/notes', (req, res) => {
    console.log(req.body);
    db.none('insert into notes (author, content)' +
            'values(${author}, ${content})', req.body)
        .then( () => {
            res.status(200);
        })
        .catch( (err) => { return next(err); });
});

app.get('/notes', (req, res) => {
    db.any('select * from notes')
        .then( (data) => {
            res.json(data);
        });
});

app.listen(3000, () => console.log("Listening on port 3000!"));

