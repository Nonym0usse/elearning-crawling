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
         var exceloutput = Date.now() + "-inflearn.xlsx"
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
    var url = "https://www.inflearn.com/courses/it-programming?order=seq&page="+data;
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
                $('div.columns>div').each(function(){
                    const image = $(this).find('div.column>div.card>a.course_card_front>div.card-image>figure.image>img').attr('data-src');
                    const title = $(this).find('div.column>div.card>div.course_card_back>a>p.course_title').text();
                    const description = $(this).find('div.column>div.card>div.course_card_back>a>p.course_description').text();
                    const price = $(this).find('div.column>div.card>a.course_card_front>div.card-content>div.price').text();
                    const number_pers = $(this).find('div.column>div.card>a.course_card_front>div.card-content>div.tags>span').text();

                    var crawling = new Crawling(title, image, price, description, number_pers);
                    crawling.setTitle(title);
                    crawling.setImg(image);
                    crawling.setPrice(price);
                    crawling.setDescription(description);
                    crawling.setPersonNumber(number_pers);

                    arr.push(crawling);
                    resolve(arr);
                });
            }
        });
    });
  }

module.exports = router;