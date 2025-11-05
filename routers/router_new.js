const router = require('express').Router(); 
const sqlite3 = require('sqlite3').verbose() // npm install --save sqlite3
const db = new sqlite3.Database('./database/database_tovari.db')


const data = require('./data.js'); 

// let json = require('../json/list.json') 
let titles = require('../json/titles.json') 
// let keys = Object.keys(titles); 

router.get(['/add_task'], (req, res) => {
    const db = new sqlite3.Database('./database/database_tovari.db')

    let tovar = `SELECT * FROM tovar`
    let kladovshik = `SELECT * From kladovshik` 
    let sklad = `SELECT * FROM sklad`

    db.all(tovar, (err, json) => {
        // console.log(rows)
        // console.log(sklad)
        if (err) console.log(err.message);
        db.all(kladovshik, (err, k) => {
            // console.log(rows)
            // console.log(sklad)
            if (err) console.log(err.message);
            db.all(sklad, (err, s) => {
                if (err) console.log(err.message);
                res.render('new_task.ejs', {  
                    tovar: json, 
                    sklad: s,
                    kladovshik: k,
                    sess: req.session
                });
            });
            db.close()
        })
    })
    // res.render('new_task.ejs');
});

router.post(['/add_task'],  (req, res) => {
    let querySelect = `INSERT INTO \ 
        tovari ("name", "kolichestvo", "kladovshik", "number_of_sklad", "date", "new") \ 
        VALUES ("${req.body.tovar}", "${req.body.kolichestvo}", CAST("${req.body.kladovshik}" AS TEXT), CAST("${req.body.sklad}" AS TEXT), CAST("${req.body.date}" AS TEXT), CAST("1" AS TEXT))`
    db.run(querySelect)
    res.redirect('/')
});

module.exports = router; 