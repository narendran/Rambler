function route(pathname,handle,res,postdata)
{
	if(typeof handle[pathname] == "function")
	{
		handle[pathname](res,postdata);
	}
	else
	{
		res.writeHead(404,{"Content-Type" : "text/html"});
		res.write("<html><head><title>Error Page</title></head><body><font color='red'><h1>Page not found. Please check the URL typed</h1></font></body></html>");
		res.end();
	}
}
exports.route = route;
