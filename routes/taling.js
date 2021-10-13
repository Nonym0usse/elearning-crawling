var express = require('express');
var router = express.Router();
var request = require('request')
var Crawling = require('../models/Crawling.js')
const cheerio = require('cheerio');
var xlsData = [];
var mergedata = [];

router.get('/catalog/:number', function(req, res, next) {
    for(var i = 1; i <= req.params.number; i++){
        xlsData.push(requestApi(getTheUrl(i)));
      }
    
      Promise.all(xlsData).then(function(data){ 
        for(var i = 0; i < data.length; i++)
        {
          mergedata = mergedata.concat(data[i]);
        }
      }).catch(function(){ res.sendStatus(404)});
    
});

function getTheUrl(data) {
    var url = "https://taling.me/Home/Search/?page="+data+"&cateMain=&cateSub=54&region=&orderIdx=&query=&code=&org=&day=&time=&tType=&region=&regionMain=";
    return url
  }

async function requestApi(url){

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
                $('div.cont2_box>div').each(function(){
                    const image = $(this).find('div.cont2_class>a>div.image').attr('style');
                    const title = $(this).find('div.cont2_class>a>div.title').text();
                    const price = $(this).find('div.cont2_class>a>div.price>div.price2>span>span').text();
                    const number_pers = $(this).find('div.cont2_class>a>div.image>div.d_day').text();

                    var crawling = new Crawling(title, image, price, number_pers);
                    crawling.setTitle(title);
                    crawling.setImg(image);
                    crawling.setPrice(price);
                    crawling.setPersonNumber(number_pers);

                    arr.push(crawling);
                    resolve(arr);
                });
            }
        });
    });
  }
module.exports = router;