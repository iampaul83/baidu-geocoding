var request = require('request');
var csv = require('csv');
var fs = require('fs');

var data = [];
var idx = 0;

function readCsv() {
  fs.createReadStream('addr.csv')
      .pipe(csv.parse({delimiter: ',', columns:true}))
      .on('data', function(csvrow) {
          data.push(csvrow)
      })
      .on('end', function() {
        console.log(data.length + " addrs");
        baidu();
      });
}


//http://api.map.baidu.com/geocoder/v2/?output=json&ak=sWvpNiLBk4NsBBgCjHrc6TAo&address=
function baidu() {
  console.log(idx);
  if (idx == data.length) {
    saveCsv(data);
    return;
  }

  var d = data[idx];
  var addr = d.addr;
  idx = idx + 1;

  var url = 'http://api.map.baidu.com/geocoder/v2/?output=json&ak=sWvpNiLBk4NsBBgCjHrc6TAo&address=' + encodeURI(addr);
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var geo = JSON.parse(body);
      if (geo.status == 0) {
        var l = geo.result.location;
        d.lng = l.lng;
        d.lat = l.lat;
      }
    }
    baidu();
  })
}

function saveCsv(data) {
  csv.stringify(data, {delimiter: ','}, function(err, output){
    fs.writeFileSync('output.csv', output, 'utf8');
  });
}

// var errData = data.filter(function (d) {
//   return !d.lng || !d.lat;
// })
