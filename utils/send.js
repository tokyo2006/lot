var joinPath = require("path").join;
var mime = require("mime");
var fs = require("fs");
//将path 指定的文件通过res 传递出去
exports.sendFile = function(path,res){

    fs.readFile(path, function(err,data){
        if(err){
            if(err.code === 'ENOENT'){
                res.writeHead(404);
                res.end("Not Found");
                return;
            }
            res.writeHead(500);
            res.end(err.message);
            return;
        }
        var mimetype = mime.lookup(path);
        var charset = mime.charsets.lookup(mimetype);
        res.setHeader("Content-Type",mimetype + (charset ? ';charset = ' + charset : ''));
        res.end(data);
    });
};

exports.redirect = function(location,res,statusCode){
   statusCode = statusCode || 302;
    res.writeHead(statusCode,{
        "Location":location
    });
    res.end();
};
