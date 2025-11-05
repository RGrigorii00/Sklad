const router = require('express').Router(); 
const lodash = require('lodash') 
const sqlite3 = require('sqlite3').verbose()  // npm install --save sqlite3 

let json = require('../json/list.json') 
let titles = require('../json/titles.json') 
let keys = Object.keys(titles); 

router.get(['/update_task/:index'], (req, res) => {
    let id = parseInt(req.params.index)
    const db = new sqlite3.Database('./database/database_tovari.db')

    let querySelect = `SELECT \
    tovari.id, tovari.name as name, tovari.kolichestvo, tovari.kladovshik as kladovshik, tovari.number_of_sklad as sklad, tovari.date, tovari.new \
    FROM tovari \
    WHERE tovari.id == ${id}`
    // console.log(querySelect)
    let tovar = `SELECT * FROM tovar`
    let kladovshik = `SELECT * From kladovshik` 
    let sklad = `SELECT * FROM sklad`
    db.all(tovar, (err, json) => {

        // console.log(rows)
        if (err) console.log(err.message);
        db.all(kladovshik, (err, k) => {
            // console.log(rows)
            // console.log(sklad)
            if (err) console.log(err.message);
            db.all(sklad, (err, s) => {
                if (err) console.log(err.message);
                db.all(querySelect, (err, qs) => {
                    if (err) console.log(err.message);
                    res.render('edit_task.ejs', {  
                        tovar: json, 
                        sklad: s,
                        qS: qs,
                        kladovshik: k,
                        sess: req.session
                    });
                });
                db.close()
            });
        })
    })
  }); 
  //"<%= if (item.id == qs.id) { ? 'selected' : ''%"
router.post(['/update_task/:index'], (req, res) => {
    const data = req.body 
    const index = parseInt(req.params.index) 
    const db = new sqlite3.Database('./database/database_tovari.db')

    let querySelect = `UPDATE \
        tovari \
        SET name = "${data.tovar}", kolichestvo = "${data.kolichestvo}", kladovshik = CAST("${data.kladovshik}" AS TEXT), number_of_sklad = "${data.sklad}", date = CAST("${data.date}" AS TEXT), new = CAST("2" AS TEXT) \
        WHERE tovari.id == ${index}; \
        --UPDATE sqlite_sequence SET seq = (SELECT COUNT(*) FROM tovari); \
        COMMIT;`
    console.log(querySelect)
    db.all(querySelect, (err, json) => {

        json = json.map(x => {
            return x
        })

        if (err) console.log(err.message);
        res.redirect('/')
    })
    db.close()
    // res.render('index.ejs', {keys, json, titles}); 
}); 

// UPDATE sqlite_sequence SET seq = (SELECT COUNT(*)+1 FROM tasks) WHERE name = "tasks";


module.exports = router; 