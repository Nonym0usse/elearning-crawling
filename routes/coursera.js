var express = require('express');
var router = express.Router();
var request = require('request')
var json2xls = require('json2xls');
var fs = require('fs');

router.get('/catalog', function(req, res, next) {

  var url = "https://api.coursera.org/api/courses.v1?subjects=Technology&start=0&limit=8083&fields=title,price,description,parentForumId,order,legacyForumId,forumType,forumQuestionCount,lastAnsweredAt,groupForums.v1(title,price,description,parentForumId,order,forumType)&includes=title,price,description,parentForumId,order,legacyForumId,forumType,forumQuestionCount,lastAnsweredAt,groupForums.v1(title,price,description,parentForumId,order,forumType)";
  request.get({url: url}, async function(error, response, body) {
    if (!error && response.statusCode == 200) {
      const json = JSON.parse(body);
      var xls = json2xls(json.elements);
     var exceloutput = Date.now() + "-coursera-output.xlsx"
      fs.writeFileSync(exceloutput, xls, 'binary');
      res.download(exceloutput,(err) =>  {
          if(err){
              fs.unlinkSync(exceloutput)
              res.send("Unable to download the excel file")
          }
          fs.unlinkSync(exceloutput)
      });
    } else {
     console.log("Number of pages exceed the limit");
    }
  });
  
});


module.exports = router;