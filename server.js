var express = require("express");
var app = express();
const path = require("path");
const cors = require("cors");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
const { Pool } = require("pg");
var pool;
dotenv.config();

// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 5000;

var whitelist = ["http://localhost:3000"];
var corsOptionsDelegate = function (req, callback) {
	var corsOptions;
	if (whitelist.indexOf(req.header("Origin")) !== -1) {
		corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
	} else {
		corsOptions = { origin: false }; // disable CORS for this request
	}
	callback(null, corsOptions); // callback expects two parameters: error and options
};

const buildPath = path.join(__dirname, "/client/build/");
console.log(buildPath);
app.use(express.static(buildPath));
app.use(cors());
app.use(express.json());

if (process.env.ENVIRONMENT == "production") {
	pool = new Pool({
		connectionString: process.env.DATABASE_URL,
		ssl: {
			rejectUnauthorized: false,
		},
	});
} else {
	pool = new Pool({
		connectionString: process.env.DATABASE_URL,
	});
}

pool.on("error", (err, client) => {
	console.error("Unexpected error on idle client", err);
	process.exit(-1);
});

app.get("/api/item", cors(corsOptionsDelegate), function (req, res) {
	pool.connect((err, client, release) => {
		if (err) res.status(400).send("Error connecting to the database");
		client
			.query("SELECT * from todo LIMIT 100")
			.then((response) => {
				release();
				res.status(200).send(response.rows);
			})
			.catch((e) => {
				release();
				res.status(400).send(e);
			});
	});
});

app.post("/api/item", cors(corsOptionsDelegate), function (req, res) {
	pool.connect((err, client, release) => {
		if (err) res.status(400).send("Error connecting to the database");
		client
			.query("INSERT INTO todo(text, created_at) VALUES($1, $2) RETURNING *", [
				req.body.text,
				req.body.created_at,
			])
			.then((response) => {
				release();
				res.status(200).send(response.rows);
			})
			.catch((e) => {
				release();
				res.status(400).send(e);
			});
	});
});

app.put("/api/item", cors(corsOptionsDelegate), function (req, res) {
	pool.connect((err, client, release) => {
		if (err) res.status(400).send("Error connecting to the database");
		client
			.query("UPDATE todo SET text=$2 WHERE id=$1 RETURNING *", [
				req.body.id,
				req.body.text,
			])
			.then((response) => {
				release();
				res.status(200).send(response.rows);
			})
			.catch((e) => {
				release();
				res.status(400).send(e);
			});
	});
});

app.delete("/api/item", cors(corsOptionsDelegate), function (req, res) {
	pool.connect((err, client, release) => {
		if (err) res.status(400).send("Error connecting to the database");
		client
			.query("DELETE FROM todo WHERE id=$1 RETURNING id", [req.body.id])
			.then((response) => {
				release();
				res.status(200).send(response.rows);
			})
			.catch((e) => {
				release();
				res.status(400).send(e);
			});
	});
});

app.get("*", function (req, res) {
	res.sendFile("index.html", {
		root: path.join(buildPath),
	});
});

app.listen(port, function () {
	console.log("App listening on port " + port);
});
