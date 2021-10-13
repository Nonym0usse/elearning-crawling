var express = require('express');
var router = express.Router();
var request = require('request')
var json2xls = require('json2xls');
var fs = require('fs');
var xlsData = [];

router.get('/catalog/:type', function(req, res, next) {

    var url = "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q="+req.params.id+"&key=AIzaSyB1trSl-pBODAbfTgzC_IrxZ2iM20YL-ZM";
    request.get({url: url}, async function(error, response, body) {
      if (!error && response.statusCode == 200) {
        const json = JSON.parse(body);
        for(var key in json.items){
            xlsData.push(json.items[key].snippet);
        }
       var xls = json2xls(xlsData);
        var exceloutput = Date.now() + "-youtube-output.xlsx"
        fs.writeFileSync(exceloutput, xls, 'binary');
        res.download(exceloutput,(err) =>  {
            if(err){
                fs.unlinkSync(exceloutput)
                res.send("Unable to download the excel file")
            }
            fs.unlinkSync(exceloutput)
        });
      } else {
        res.sendStatus(404);
      }
    });
  });



module.exports = router;