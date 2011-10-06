// This file will contain the request handlers for every request routed from server.js

var sys = require("sys");
var fs = require("fs");
var util = require("util");
var query = require("querystring");

// MongoDB connection variables
var Db = require('../../mongodb/lib/mongodb').Db,
  Connection = require('../../mongodb/lib/mongodb').Connection,
  Server = require('../../mongodb/lib/mongodb').Server,
  Cursor = require('../../mongodb/lib/mongodb').Cursor;

// Get default host and port
var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;
var db = new Db('rambler', new Server(host, port, {}), {native_parser:true});



function start(res,postdata)
{
	// If the request is to the root --> open the legendary index.html
	res.writeHead(200,{"Content-Type" : "text/html"});
	// Pump the context from a readStream to a writeStream. Simple!
	var rs = fs.createReadStream("./html/index.html");
	util.pump(rs,res);
}

function getRamble(res,postdata)
{
	// Parse the post data and insert into DB
	var rambletext = query.parse(postdata).ramble;
	res.writeHead(200,{"Content-Type" : "text/html"});
	res.write("<html><head><script language=\"Javascript\">setTimeout(\"top.location.href='http://localhost:10000'\",2000)</script></head><body><br><br><br><hr> <h1><center>New Ramble is <font color=navy>"+rambletext+"</font></center></h1><hr></body></html>");

	
	// Db Connection
	db.open(function(err, db){
		// DB Insert
		console.log(err);
		db.collection('rambles',function(err, collection){
			collection.insert({'ramble':rambletext, 'timestamp' : new Date()}); // Inserting the ramble and the time when the ramble was rambled! :D
			db.close();
		});
	});
	res.end();
}

function getAllRambles(res,postdata)
{
	var retstring="";
	// Set the response Content Type
	res.writeHead(200,{"Content-Type":"plain/html"});
	// Db Connection
	db.open(function(err, db){
		// DB Insert
		console.log(err);
		db.collection('rambles',function(err, collection){
			collection.find(function(err, cursor) {
        			cursor.each(function(err, item) {
	          		if(item != null) 
	          		{
	          			retstring="<tr><td width='20%'><center>"+item.timestamp.toLocaleDateString()+"</center></td><td width='10%'><center>"+item.timestamp.toLocaleTimeString()+"</center></td><td><center><font color='navy'>"+item.ramble+"</font></center></td></tr>"+retstring;
	          		}
	          		else
	          		{
		          		db.close();
		          		res.end(retstring);
	          		}
		          	
        			});
     		});
		});
	});
}

exports.start = start;
exports.getRamble = getRamble;
exports.getAllRambles = getAllRambles;
