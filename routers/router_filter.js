const router = require('express').Router(); 
const lodash = require('lodash')
const sqlite3 = require('sqlite3').verbose() // npm install --save sqlite3 


let json = require('../json/list.json') 
let titles = require('../json/titles.json') 
let keys = Object.keys(titles); 

router.get(['/filter'], (req, res) => {
  const db = new sqlite3.Database('./database/database_tovari.db')
  let querySelect = `SELECT \
    tovari.id, tovar.name as tovar, tovari.kolichestvo, kladovshik.name as kladovshik, sklad.name as sklad, tovari.date, tovari.new \
    FROM tovari \
    INNER JOIN tovar ON tovari.name = tovar.id \
    INNER JOIN kladovshik ON tovari.kladovshik = kladovshik.id \
    INNER JOIN sklad ON tovari.number_of_sklad = sklad.id \
    WHERE sklad.id = '${req.query.sklad}'`
  let name_of_sklad = `SELECT \
    sklad.id, sklad.name \
    FROM sklad`
    db.all(querySelect, (err, json) => {

        if (err) console.log(err.message);
        db.all(name_of_sklad, (err, sklad) => {
          // console.log(rows)
          // console.log(sklad)
          if (err) console.log(err.message);
          res.render('index.ejs', { 
              titles: titles, 
              json: json, 
              sklad: sklad,
              keys: Object.keys(titles),
              sess: req.session
          });
      })
      db.close()
    })
  // arr_filtered = lodash.orderBy(arr_filtered, [sortField], [`${sortirovka}`]);  
  // res.render('index.ejs', { keys, json: arr_filtered, titles }); 
}); 

module.exports = router; 