const data = () => {
    let json = require('../json/list.json') 
    let titles = require('../json/titles.json') 
    let keys = Object.keys(titles); 
    return obj = {keys, json, titles}
}

module.exports = data; 