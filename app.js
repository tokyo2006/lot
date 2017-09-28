//this is a test file
var http = require('http');
var parse = require('url').parse;
var controllers = require('./controllers');

//针对不同的处理情况调用不同的处理函数
var rules = [
    {path: '/', controller: controllers.home},
    {path: /^\/(.*)/, controller: controllers.static}
];
function notFoundController(req, res) {
    res.end('Not Found!');
}
function find(rules, match) {
    for (var i in rules) {
        if (match(rules[i])) return rules[i];
    }
};
var server = http.createServer(function (req, res) {
    var parseInfo = parse(req.url);
    console.log("req.url", req.param);
    var pathName = parseInfo.pathname;
    console.log('pathName', pathName);
    var rule = find(rules, function (rule) {
        if(rule.method){
            if(rule.method.toLowerCase !== req.method.toLowerCase){
                return false;
            }
        }
        var result;
        if (rule.path instanceof RegExp) {
            result = pathName.match(rule.path);
            req.params = result;
            return result;
        }
        return pathName == rule.path;
    });
    var controller = rule && rule.controller || notFoundController;
    controller(req, res);
});

server.listen(3000, 'localhost');


