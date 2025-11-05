const router = require('express').Router(); 
const lodash = require('lodash')
const sqlite3 = require('sqlite3').verbose()  // npm install --save sqlite3 

let json = require('../json/list.json') 
let titles = require('../json/titles.json') 
let keys = Object.keys(titles); 

router.post(['/delete/:index'], (req, res) => {
  const index = parseInt(req.params.index)
  const db = new sqlite3.Database('./database/database_tovari.db')
    
  let querySelect = `DELETE \
      FROM tovari \
      WHERE tovari.id == ${index};
      COMMIT;`
  
  db.all(querySelect, (err, rows) => {

      rows = rows.map(x => {
          return x
      })

      if (err) console.log(err.message);
      res.redirect('/')
  })
  db.close()
  }); 

module.exports = router; 