const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const path = require('path');
app.use('/',express.static(path.join(__dirname, 'client')));
const knex = require('knex')({
    client: 'pg',
    connection: {
    host : 'ec2-184-72-252-69.compute-1.amazonaws.com',
    user : 'ialeurvhndzsio',
    password : 'e2016813fd4c28db4b657859fdfbcd15bc8039c67dda63b52987a40efa4aca4b',
    database : 'd4mcuuro9s7ol0'
  },
});






app.post('/links', (req,res) => {
res.status(200).send(JSON.stringify(req.body));
	const dummy = {
		url : req.body.url,
    votes: 1,
    lesson_id: 2,
    unit_id: 3,
    sublesson_id: 2
	};
    knex('links')
    .insert(dummy)
    .then(data => {
    console.log(data);
    res.status(200).json(data);
    });
});


app.get('/units', (req,res) => {
	knex('units')
	.select()
	.then(data => {
		res.status(200).json(data);
	});
});

app.get('/links', (req,res) => {
	knex('links')
	.select()
	.then(data => {
		res.status(200).json(data);
	});
});

app.get('/lessons', (req,res) => {
	knex('lessons')
	.select()
	.then(data => {
		res.status(200).json(data);
	});
});

app.get('/sublessons', (req,res) => {
	knex('sublesson')
	.select()
	.then(data => {
		res.status(200).json(data);
	});
});

// steps to make this work
//1 run npm install
//2 push to github
// push to heroku master
// check "open" app on heroku














// DO NOT REMOVE THIS -----EVER ----it is needed
app.listen(process.env.PORT || 8080, () => console.log(
  `Your app is listening on port ${process.env.PORT || 8080 }`));
