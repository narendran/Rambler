var server = require("./server");
var router = require("./router");
var reqhand = require("./requesthandlers");

// Map requests to request handler
var handle = {};
handle["/"] = reqhand.start;
handle["/getRamble"] = reqhand.getRamble;
handle["/getAllRambles"] = reqhand.getAllRambles;

server.start(router.route,handle);
