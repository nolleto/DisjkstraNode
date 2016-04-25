var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser')
var Disjkstra = require('./server/Disjkstra');

// view engine setup
app.set('views', path.join(__dirname, './build/'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static('build'));
//app.use(express.static(process.cwd() + '/public'));

app.use(bodyParser.json({ limit: '10mb' })); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function (req, res) {
  res.render('html/index', { title: 'Express' });
});

app.post('/Execute', function(req, res) {
  Disjkstra.calcule(req.body.nodos, function(result) {
    res.end(JSON.stringify(result));
  });
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
