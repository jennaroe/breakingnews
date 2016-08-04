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
var db = mongojs(process.argv.MONGODB_URI);
// var db = mongojs(databaseUrl, collections);
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

			  db.articles.insert({upsert: true}, result, function(err, saved){
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
  db.articles.find({}).limit(2, function(err, docs){
    res.json(docs);
    console.log('received');
  })
});

app.get('/next', function(req, res){
	var id = req.query.id
})


// Post a comment to the mongo database
// app.post('/submit', function(req, res) {
//   var comment = req.body;
//   comment.post = true;

//   db.comments.insert(comment, function(err, book){
//     if (err) throw err
//     res.send(comment);
//     }
//   });
// });

	app.get('/comment', function(req, res) {
	  db.articles.find({comments:''}, function(err, docs){
	    res.json(docs);
	    console.log(docs);
	  })
	});


	app.post('/submit', function(req, res){
		var comment = req.body;
		comment.post = true; 

    	db.articles.update({_id: mongojs.ObjectId(req.body.id)}, 

    		{$push: {comments: [req.body.comments]}
    			}, 
    	function (err, comment) {
    		if (err) {
    			console.log(err);
    			res.send(err);
    	} else{
    		res.send(comment);
    		}
    	})
	});
// listen on port 3000
app.listen(3000, function() {
  console.log('App running on port 3000!');
});

// MONGODB_URI: mongodb://heroku_ghcb8mbj:lcc3nf8fs9aq2mam4fccjd6kqa@ds145395.mlab.com:45395/heroku_ghcb8mbj
