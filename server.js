var http = require("http");
// Route the incoming requests to the appropriate request handlers.
var url = require("url");

// Let me modularize this thing.
// The route function form the router module is also a parameter.
// In node, the server's work is to call the router with the appropriate request and prepare the postDATA if any and send that too. DOT.
function start(route, handle) {

	server = http.createServer(function(req,res){
		// Get pathname from the request
		var postdata = "";
		var pathname = url.parse(req.url).pathname;
		
		//Prepare the postdata
		req.setEncoding("utf8");
		req.addListener("data",function(postdatachunk) {
			postdata+=postdatachunk;
			});
		req.addListener("end",function(){
			route(pathname,handle,res,postdata);
			});
		
	}).listen(10000);
	console.log("Server started on port 10000");
}

exports.start = start;
