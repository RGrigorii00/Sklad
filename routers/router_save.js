const router = require('express').Router(); 
const lodash = require('lodash')
fs = require('fs')

let json = require('../json/list.json') 
let titles = require('../json/titles.json') 
let keys = Object.keys(titles); 

router.get(['/save'], (req, res) => { 
  let json1 = json.map((elem) => {delete elem.new; return elem})
  let keys = Object.keys(titles);
  fs.writeFileSync('./json/list1.json', JSON.stringify(json1, null, 2))
  res.render('index.ejs', {keys, json: json1, titles});
}); 

module.exports = router; 