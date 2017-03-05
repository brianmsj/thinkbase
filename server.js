const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const pg = require('pg');
const NestHydrationJS = require('nesthydrationjs')();
const exphbs = require('express-handlebars');
pg.defaults.ssl = true;

app.engine('handlebars', exphbs({defaultLayout: 'main'})); 
app.set('view engine', 'handlebars');

const knex = require('knex')({
    client: 'pg',
    connection: {
			host : 'ec2-184-72-252-69.compute-1.amazonaws.com',
			user : 'ialeurvhndzsio',
			password : 'e2016813fd4c28db4b657859fdfbcd15bc8039c67dda63b52987a40efa4aca4b',
			database : 'd4mcuuro9s7ol0'
  }
});

var definition = [{
	unit_name: 'unit_name',
	lessons: [{
		lesson_name: 'lesson_name',
		sublessons: [{
			sublesson_name: 'sublesson_name',
			links: [{
				url: 'link_url'
			}]
		}]
	}]
}];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/',express.static(path.join(__dirname, 'client')));

//===================================================================****ENPOINTS****

app.get('/library', (req, res) => {
	knex
	.from('lessons')
	.join('units', 'units.id', 'lessons.unit_id')
	.join('sublesson', 'lessons.id', 'sublesson.lesson_id')
	.leftOuterJoin('links', 'sublesson.id', 'links.sublesson_id')
	.select('units.name as unit_name', 'lessons.name as lesson_name', 'sublesson.name as sublesson_name', 'links.url as link_url')
	.then(data => NestHydrationJS.nest(data, definition))
	.then(units => {
		//res.sendFile(path.join(__dirname+'/client/library.html')).json(results);
		console.log(units);
		res.render('library', {units});
		//res.status(200).json(results);
	});
});

app.post('/links', (req,res) => {
res.status(200).send(JSON.stringify(req.body));
	const dummy = {
		url : req.body.url,
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

///-----------------------------AUTHENTICATION -----------------------------











// DO NOT REMOVE THIS -----EVER ----it is needed
app.listen(process.env.PORT || 8080, () => console.log(
  `Your app is listening on port ${process.env.PORT || 8080 }`));
