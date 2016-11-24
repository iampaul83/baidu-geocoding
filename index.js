var request = require('request');
var csv = require('csv');
var fs = require('fs');
var ProgressBar = require('progress');
var bar;

var Q = require('q');
var async = require('async');

var v = require('./values.js');

var errors = [];

readCsv()
  // FOR TEST
  // .then(function (data) { return data.slice(0,10); })
  .then(addProgressBar)
  .then(startBaiduRequests)
  .then(saveCsv)
  .catch(function (error) {
    console.log(error);
  })
  .done(function () {
    console.log(errors);
  });




function addProgressBar(data) {
  bar = new ProgressBar('downloading [:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 30,
    total: data.length
  });
  return data;
}

function readCsv() {
  var deferred = Q.defer();

  var csvParser = csv.parse({delimiter: ',', columns:true});
  var data = [];
  fs.createReadStream(v.CSV_IN)
    .pipe(csvParser)
    .on('data', function(csvrow) {
        data.push(csvrow)
    })
    .on('end', function() {
      deferred.resolve(data);
    });

    return deferred.promise;
}

function saveCsv(data) {
  csv.stringify(data, {delimiter: ','}, function(err, output){
    fs.writeFileSync(v.CSV_OUT, output, 'utf8');
  });
}

function startBaiduRequests(data) {
  var deferred = Q.defer();

  var baiduQueue = async.queue(baiduRequestWorker, v.REQUEST_CONCURRENCY);

  baiduQueue.drain = function() {
    deferred.resolve(data);
  };

  data.forEach(function (d) {
    baiduQueue.push(d, baiduRequestErrorHandle);
  });

  return deferred.promise;
}

function baiduRequestWorker(data, callback) {
  var address = data[v.CSV_ADDR];
  var url = `http://api.map.baidu.com/geocoder/v2/?output=json&ak=${v.BAIDU_APP_KEY}&address=${encodeURI(address)}`;

  request(url, function (error, response, body) {
    bar.tick();
    if (error) {
      callback(error);
      return;
    }
    var geo = JSON.parse(body);
    if (geo.status != 0) {
      callback(geo);
      return;
    }
    var l = geo.result.location;
    data.lng = l.lng;
    data.lat = l.lat;
    callback();
  });

}

function baiduRequestErrorHandle(error) {
  if (error) {
    errors.push(error);
  }
}
