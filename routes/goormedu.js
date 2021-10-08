var express = require('express');
var router = express.Router();
var request = require('request')
var json2xls = require('json2xls');
var fs = require('fs');
const cheerio = require('cheerio');
var xlsData = [];
var mergedata = [];

router.get('/catalog', function(req, res, next) {
    for(var i = 1; i <= 20; i++){
        xlsData.push(requestAPIUdemy(getTheUrl(i)));
      }
    
      Promise.all(xlsData).then(function(data){ 
        for(var i = 0; i < data.length; i++)
        {
          mergedata = mergedata.concat(data[i]);
        }
        var xls = json2xls(mergedata);
         var exceloutput = Date.now() + "-groomit-output.xlsx"
          fs.writeFileSync(exceloutput, xls, 'binary');
          res.download(exceloutput,(err) =>  {
              if(err){
                  fs.unlinkSync(exceloutput)
                  res.send("Unable to download the excel file")
              }
              fs.unlinkSync(exceloutput)
          });
      }).catch(function(err){ console.log(err) });
    
});

function getTheUrl(data) {
    var url = "https://edu.goorm.io/category/programming?page="+data+"&sort=newest";
    return url
  }

async function requestAPIUdemy(url){
    console.log('oui');

    return new Promise((resolve, reject) => {
        request.get({url: url}, function(err, res, body) {
            if(err)
            {
                console.log(err);
            }
            else
            {
                const arr = [];
                let $ = cheerio.load(body);
                $('div.Aj2j_L>div').each(function(index){
                    const image = $(this).find('div._2hZilU>a._1xnzzp>div._2tXzr4>div._31ylS5>img._3PxZMG').attr('data-src');
                    const title = $(this).find('div._2hZilU>a._1xnzzp>div._2tXzr4>div._3pJh0l>div._3sSCLc').text();
                    const description = $(this).find('div._2hZilU>a._1xnzzp>div._2tXzr4>div.obzTi8>div._34faef').text();
                    const price = $(this).find('div._2hZilU>a._1xnzzp>div._2tXzr4>div.RfUd-z>div.NUcMu0>span._3vh60A').text();
                    const number_pers = $(this).find('div._2hZilU>a._1xnzzp>div._2tXzr4>div._3pJh0l>div._3SzRPA>div._3CQYzi>div._1kTxrO>span').text();
                    const category = $(this).find('div._2hZilU>a._1xnzzp>div._2tXzr4>div._3pJh0l>div._3SzRPA>div.xaJHLa').text();

                    const obj = {
                        image : image,
                        title : title,
                        description: description,
                        price: price,
                        number_pers: number_pers,
                        category: category
                    };
                    arr.push(obj);
                    resolve(arr);
                });
            }
        });
    });
  }



module.exports = router;