var express = require('express');
var router = express.Router();
var request = require('request')
var json2xls = require('json2xls');
var fs = require('fs');
const cheerio = require('cheerio');

router.get('/catalog', function(req, res, next) {
    requestAPIUdemy().then(function(data){
        console.log(data);
       var xls = json2xls(data);
        var exceloutput = Date.now() + "-team-nova-light-output.xlsx"
         fs.writeFileSync(exceloutput, xls, 'binary');
         res.download(exceloutput,(err) =>  {
             if(err){
                 fs.unlinkSync(exceloutput)
                 res.send("Unable to download the excel file")
             }
             fs.unlinkSync(exceloutput)
         });
    });
    
});

async function requestAPIUdemy(){
    const URL = "https://www.teamnovalight.co.kr/lecture_list.php";

    return new Promise((resolve, reject) => {
        request.get({url: URL}, function(err, res, body) {
            console.log('ok');
            if(err)
            {
                console.log(err);
            }
            else
            {
                const arr = [];
                let $ = cheerio.load(body);
                $('div.single-grid-view>div').each(function(index){
                    const image = "https://www.teamnovalight.co.kr/" + $(this).find('div.col-md-4>div.category>div.ht__cat__thumb>a>img').attr('src');
                    const title = $(this).find('div.col-md-4>div.category>div.fr__product__inner>h4').text();
                    const price = $(this).find('div.col-md-4>div.category>div.fr__product__inner>ul.fr__pro__prize>li').text();
    
                    const obj = {
                        image: image,
                        title : title,
                        price: price,
                    };
                    arr.push(obj);
                    resolve(arr);
                });
            }
        });
    });
  }



module.exports = router;