var express = require('express');
var router = express.Router();
var request = require('request')
var json2xls = require('json2xls');
var fs = require('fs');
var Crawling = require('../models/Crawling.js')
const cheerio = require('cheerio');
var xlsData = [];
var mergedata = [];

router.get('/catalog/:number', function(req, res, next) {
    for(var i = 1; i <= req.params.number; i++){
        xlsData.push(requestAPI(getTheUrl(i)));
      }
    
      Promise.all(xlsData).then(function(data){ 
        for(var i = 0; i < data.length; i++)
        {
          mergedata = mergedata.concat(data[i]);
        }
        var xls = json2xls(mergedata);
         var exceloutput = Date.now() + "-goormedu-output.xlsx"
          fs.writeFileSync(exceloutput, xls, 'binary');
          res.download(exceloutput,(err) =>  {
              if(err){
                  fs.unlinkSync(exceloutput)
                  res.send("Unable to download the excel file")
              }
              fs.unlinkSync(exceloutput)
          });
      }).catch(function(){  res.sendStatus(404) });
    
});

function getTheUrl(data) {
    var url = "https://edu.goorm.io/category/programming?page="+data+"&sort=newest";
    return url
  }

async function requestAPI(url){
    return new Promise((resolve, reject) => {
        request.get({url: url}, function(err, res, body) {
            if(err)
            {
                reject(err);
            }
            else
            {
                const arr = [];
                let $ = cheerio.load(body);
                $('div.Aj2j_L>div').each(function(){
                    const image = $(this).find('div._2hZilU>a._1xnzzp>div._2tXzr4>div._31ylS5>img._3PxZMG').attr('data-src');
                    const title = $(this).find('div._2hZilU>a._1xnzzp>div._2tXzr4>div._3pJh0l>div._3sSCLc').text();
                    const description = $(this).find('div._2hZilU>a._1xnzzp>div._2tXzr4>div.obzTi8>div._34faef').text();
                    const price = $(this).find('div._2hZilU>a._1xnzzp>div._2tXzr4>div.RfUd-z>div.NUcMu0>span._3vh60A').text();
                    const number_pers = $(this).find('div._2hZilU>a._1xnzzp>div._2tXzr4>div._3pJh0l>div._3SzRPA>div._3CQYzi>div._1kTxrO>span').text();
                    const category = $(this).find('div._2hZilU>a._1xnzzp>div._2tXzr4>div._3pJh0l>div._3SzRPA>div.xaJHLa').text();

                    var crawling = new Crawling(title, image, price, description, number_pers, category);
                    crawling.setTitle(title);
                    crawling.setImg(image);
                    crawling.setPrice(price);
                    crawling.setDescription(description);
                    crawling.setPersonNumber(number_pers);
                    crawling.setCategory(category)

                    arr.push(crawling);
                    resolve(arr);
                });
            }
        });
    });
  }



module.exports = router;