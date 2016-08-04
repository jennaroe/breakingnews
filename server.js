// Initialize Express app
var express = require('express');
var app = express();

// Require request and cheerio. This makes the scraping possible
var request = require('request');
var cheerio = require('cheerio');

// configure our app body parser
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
	extended: false
}));

// static file support with public folder
app.use(express.static('public'));

// mongojs configuration
var mongojs = require('mongojs');
var databaseUrl = "news";
var collections = ["articles", "comments"];

// hook our mongojs config to the db var
var db = mongojs(databaseUrl, collections);
db.on('error', function(err) {
  console.log('Database Error:', err);
});


// Routes
// ======

// simple index route
app.get('/', function(req, res) {
  res.send(index.html);
});

app.get('/data', function(req, res) { 
	request('https://www.buzzfeed.com/', function (error, response, html) {

		var $ = cheerio.load(html);
		var result = [];
		
		$('h2.lede__title').each(function(i, element) {

		console.log(element,"!!!!!");

	      var title = $(this).text();
	      var link = $(this).find('a').attr('href');
	      var content = $(this).find('.p.lede__kicker').text();

	      		

	      if (title !== '') {
	      		result.push({
	       		title: title,
	        	url: link,
	        	content: content,
	        	comments:[]
	      		})
	  		}
	  		
			  db.articles.insert(result, function(err, saved){
			  	if (err){
			  		console.log(err)
			  } else {
			 	res.send(result);
			 	console.log(result);
			 	upsert: true;
			 }	  	
			});
		});
	});
});

// find all articles
app.get('/article', function(req, res) {
  db.articles.find({}, function(err, docs){
    res.json(docs);
    console.log('Sent');
  })
});


// Post a comment to the mongo database
app.post('/submit', function(req, res) {
  
  // save the request body as an object called book
  var comment = req.body;

  // if we want the object to have a boolean value of false, 
  // we have to do it here, because the ajax post will convert it 
  // to a string instead of a boolean
  comment.post = true;

  db.comments.insert(comment, function(err, book){
    if (err) {
      console.log(err);
    } else{
    res.send(comment);
    }
  });
});

app.get('/comment', function(req, res) {
  db.comments.find({}, function(err, docs){
    res.json(docs);
    console.log(docs);
  })
});


// listen on port 3000
app.listen(3000, function() {
  console.log('App running on port 3000!');
});