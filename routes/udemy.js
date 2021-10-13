var express = require('express');
var router = express.Router();
var request = require('request')
var json2xls = require('json2xls');
var fs = require('fs');

var xlsData = [];
var mergedata = [];


router.get('/catalog/:number', function(req, res, next) {
  for(var i = 1; i <= req.params.number; i++){
    xlsData.push(requestUrl(getTheUrl(i)));
  }

  Promise.all(xlsData).then(function(data){ 
    for(var i = 0; i < data.length; i++)
    {
      mergedata = mergedata.concat(data[i]);
    }
    var xls = json2xls(mergedata);
     var exceloutput = Date.now() + "-udemy-output.xlsx"
      fs.writeFileSync(exceloutput, xls, 'binary');
      res.download(exceloutput,(err) =>  {
          if(err){
              fs.unlinkSync(exceloutput)
              res.send("Unable to download the excel file")
          }
          fs.unlinkSync(exceloutput)
      });

  }).catch(function(){ res.sendStatus(404) });
});


function getTheUrl(data) {
  var url = "https://www.udemy.com/api-2.0/courses/?page_size=100&page="+data+"&category=Development";
  return url
}

async function requestUrl(url){
  var auth = 'Basic ' + new Buffer.from("0a8TTztD0AWTxhJzcYvfytXXy1cOV4rHSmxiDBfZ:d6A9A7VM4exknwp0TnpsrGQyzt9FLRxZR5l3e8DT4p4zQxT0Nf7xfIiFigps1mhOI6zkp6M2YNeLoz7KaR3NwHtkWA6bHgS8kdnKW9SQbk4hJ4vswuZd0GcOd6gPTkqT").toString('base64');
  return new Promise((resolve, reject) => {
    request.get({url: url, headers: {"Authorization": auth}}, async function(error, response, body) {
      if (!error && response.statusCode == 200) {
        const json = JSON.parse(body);
        resolve(json.results);
      } else {
        reject('error');
      }
    });
  });
}

module.exports = router;