const router = require('express').Router(); 
const lodash = require('lodash')
const sqlite3 = require('sqlite3').verbose() // npm install --save sqlite3 

let json = require('../json/list.json') 
let titles = require('../json/titles.json') 
let keys = Object.keys(titles); 

router.get(['/sort'], (req, res) => { 
  const db = new sqlite3.Database('./database/database_tovari.db')
    let sortirovka = req.query.sortirovka
    let querySelect = `SELECT \
        tovari.id, tovar.name as tovar, tovari.kolichestvo, kladovshik.name as kladovshik, sklad.name as sklad, tovari.date, tovari.new \
        FROM tovari \
        INNER JOIN tovar ON tovari.name = tovar.id \
        INNER JOIN kladovshik ON tovari.kladovshik = kladovshik.id \
        INNER JOIN sklad ON tovari.number_of_sklad = sklad.id
        ORDER BY tovari.id ${sortirovka}`

    let name_of_sklad = `SELECT \
        sklad.id, sklad.name \
        FROM sklad`
    


    let sklad = db.all(name_of_sklad, (err, rows) => {rows = rows.map(x => {
        return x
    })})
    console.log(sklad)
    db.all(querySelect, (err, json) => {
        // console.log(rows)
        // console.log(sklad)
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
  }); 
  
router.get(['/date_sort'], (req, res) => { 
    let keys_q = req.query.date  
     console.log(`${keys_q.slice(0, 4)}-${keys_q.slice(5, 7)}-${keys_q.slice(8, 10)}`)
     let Date1 = new Date(keys_q)
    const db = new sqlite3.Database('./database/database_tovari.db')
    let sortirovka = req.query.sortirovka
    let querySelect = `SELECT \
        tovari.id, tovar.name as tovar, tovari.kolichestvo, kladovshik.name as kladovshik, sklad.name as sklad, tovari.date, tovari.new \
        FROM tovari \
        INNER JOIN tovar ON tovari.name = tovar.id \
        INNER JOIN kladovshik ON tovari.kladovshik = kladovshik.id \
        INNER JOIN sklad ON tovari.number_of_sklad = sklad.id
        WHERE tovari.date = '${keys_q.slice(0, 4)}-${keys_q.slice(5, 7)}-${keys_q.slice(8, 10)}'`

        // console.log(querySelect)
    let name_of_sklad = `SELECT \
        sklad.id, sklad.name \
        FROM sklad`
    


    let sklad = db.all(name_of_sklad, (err, rows) => {rows = rows.map(x => {
        return x
    })})
    console.log(sklad)
    db.all(querySelect, (err, json) => {
        // console.log(rows)
        // console.log(sklad)
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
}); 

// ${keys_q.slice(0, 4)}-${keys_q.slice(5, 7)}-${keys_q.slice(8, 10)}   

module.exports = router; 