const joinPath = require("path").join;
const mime = require("mime");
const sendFile = require("../utils/send").sendFile;
const publicPath = joinPath(__dirname,"../views");
 module.exports = function(req,res){
   var path = joinPath(publicPath,req.params[1]);
   sendFile(path,res);
};

