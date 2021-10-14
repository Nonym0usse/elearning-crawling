var express = require('express');
var router = express.Router();
var request = require('request')
var json2xls = require('json2xls');
var fs = require('fs');

router.get('/catalog', function(req, res, next) {

    var url = "https://fastcampus.co.kr/.api/www/categories/10/page";
    request.get({url: url}, async function(error, response, body) {
      if (!error && response.statusCode == 200) {
        const json = JSON.parse(body);
        
       var xls = json2xls(json.data.categoryInfo.courses);
        var exceloutput = Date.now() + "-fast-campus-output.xlsx"
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