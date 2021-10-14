var express = require('express');
var router = express.Router();
var request = require('request')
var json2xls = require('json2xls');
var fs = require('fs');
var xlsData = [];

router.get('/catalog', function(req, res, next) {

    var url = "http://www.kocw.net/home/special/themeCourses/lev.do";
    request.get({url: url}, async function(error, response, body) {
      if (!error && response.statusCode == 200) {
        const json = JSON.parse(body);
        for(var key in json){
            xlsData.push(json[key].levCourseList);
        }
        
       var xls = json2xls(xlsData[0]);
        var exceloutput = Date.now() + "-kocw-output.xlsx"
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