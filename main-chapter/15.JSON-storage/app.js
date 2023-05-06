"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var port = 3000;
var app = express();
app.use(bodyParser.json());
var dataStore = {};
app.post('/:route', function (req, res) {
    var route = req.params.route;
    var body = req.body;
    dataStore[route] = body;
    res.send("Data saved successfully\nGo to route: 'http://localhost:".concat(port, "/").concat(route, "'"));
});
app.get('/:route', function (req, res) {
    var route = req.params.route;
    var data = dataStore[route];
    if (data) {
        res.json(data);
    }
    else {
        res.status(404).send('Data not found');
    }
});
app.listen(port, function () {
    console.log("Server is running on port ".concat(port));
});
