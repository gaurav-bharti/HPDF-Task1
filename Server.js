var express = require('express');
var morgan = require('morgan');
var path = require('path');
var request = require("request")
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/setcookie', function (req, res) {
	var cookieName = req.cookies['name'];
	var cookieAge = req.cookies['age'];
	//If cookies are not set, set them or ignore otherwise
	if(cookieName === undefined || cookieAge === undefined) {
		res.cookie('name', 'Gaurav', {maxAge: 1000*60*15});
		res.cookie('age', '23', {maxAge: 1000*60*15});
		res.send("Cookies set successfully");
	}
	else
		res.send("Cookies already set");
	
});

app.get('/getcookies', function (req, res) {
	var cookieName = req.cookies['name'];
	var cookieAge = req.cookies['age'];
	if(cookieName === undefined && cookieAge === undefined) {
		res.send("Cookies not set");
	}
	else {
		res.send("Cookie(s) found  : "+JSON.stringify(req.cookies));
	}
});

//Example.html contains a textbox to get input from the user
app.get('/input', function (req, res) {
	res.sendFile(path.join(__dirname, 'Example.html'));
});

//Script associated with Example.html
app.get('/script.js', function (req, res) {
	res.sendFile(path.join(__dirname, 'script.js'));
});

//Endpoint to receive data
app.post('/output', function (req, res) {
	//Get data from the body
	var data = req.body.data;
	console.log(data);
	res.sendStatus(204);
});

//Deny requests to robot.txt
app.get('/robots.txt', function (req, res) {
	res.status(403).send("You shouldn't be here");
});

//Render HTML
app.get('/html', function (req, res) {
	res.send(getHtmlToRender());
});

app.get('/authors', function (req, res) {
	//Request authors
	request('http://jsonplaceholder.typicode.com/users', function (error, response, body) {
		if(!error) {
			var authors = JSON.parse(body);
			//Request posts
			request('http://jsonplaceholder.typicode.com/posts', function (error, response, body) {
				if(!error) {
					var posts = JSON.parse(body);
					//Send authors with the count of their posts
					res.send(countPosts(authors, posts));
				}
				else
					res.status(404).send("Not found");
			});
		}
		else
			res.status(404).send("Not found");
	});
});

//Returns the name of the authors with the count of their no. of posts.
function countPosts(authors, posts) {
	//HTML template for the table
	var data = `<!DOCTYPE html>
				<html>
				<head>
				<style>
					table
					{
						width:100%;
						border: 1px solid black;
						border-collapse: collapse;
					}
					th, td 
					{
						padding: 5px;
						text-align: left;
					}
					th
					{
						background-color: black;
						color: white;
					}
				</style>
				</head>
				<body>
					<table>
						<tr>
							<th>Name of the author</th>
							<th>Number of posts</th>
						</tr>`

	var countOfPosts = {};
	var i;
	
	//Initialize every author's post count to 0
	for(i=0; i<authors.length; i++) {
		if(countOfPosts[authors[i].id] === undefined)
			countOfPosts[authors[i].id] = 0;
	}
	
	//Check which post belongs to which author and increment it accordingly
	for(i=0; i<posts.length; i++) {
		if(!(countOfPosts[posts[i].userId] === undefined)) {
			countOfPosts[posts[i].userId]++;
		}
	}
	
	//Insert the data into the template
	for(i=0; i<authors.length; i++) {
		if(!(countOfPosts[authors[i].id] === undefined)) {
			//Insert as new table row
			data += '<tr><td>'+`${authors[i].name}`+'</td><td>'+countOfPosts[authors[i].id]+'</td></tr>';
		}
	}
	
	data += '</table></body></html>';
	return data;
}

//Returns an HTML template
function getHtmlToRender() {
	var data = `<!DOCTYPE html>
				<html>
				<head>
				<title>Sample HTML</title>
				</head>
				<body>
					<h1>This is a Heading</h1>
					<p>This is a paragraph.</p>
				</body>
				</html>`;
	return data;
}

app.get('/', function (req, res) {
  res.send("Hello World - Gaurav");
});

var port = 8080
app.listen(port, function () {
  console.log(`App listening on port ${port}`);
});