var joinPath = require("path").join;

var sendFile = require("../utils/send").sendFile;

const viewPath = joinPath(__dirname,"../views");
module.exports = function(req,res){

  var view = "index.html";

  var path = joinPath(viewPath,view);

  sendFile(path,res);

};
