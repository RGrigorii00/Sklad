const express = require('express'),
    app = express(),
    PORT = 3000,
    log = console.log, 
    decache = require('decache'),    
    router_new = require('./routers/router_new'), 
    router_sort = require('./routers/router_sort'), 
    router_filter= require('./routers/router_filter'), 
    router_update = require('./routers/router_update'), 
    router_delete = require('./routers/router_delete'), 
    router_data = require('./routers/data'),  
    sqlite3 = require('sqlite3').verbose(), // npm install --save sqlite3 
    cookieParser = require('cookie-parser'), // npm install cookie-parser
    session = require('express-session'),
    { sha3_512 } = require('js-sha3'),
    fs = require('fs') 
    //sess = { secret: 'mySession', cookie: { } } 

global.sess = { secret: 'mySession', cookie: { } } 
let titles = require('./json/titles.json') 

app.use(express.urlencoded({extended: true})) 
app.use(express.json()) 
decache("./list.json")  
app.use('/css', express.static('css'));
app.use('/images', express.static('images'));
app.set('view engine', 'ejs'); // npm i hbs
app.use(session(sess));
app.use((req, res, next) => {
    log('sess: ' + JSON.stringify(req.session, null, 2)); // посмотреть куки сессии для контроля
    next();
});
app.use(cookieParser());

const getHM = () => {
    let dt = new Date(); // дата и время входа
    let h = dt.getHours().toString().padStart(2, '0');
    let m = dt.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
}

app.get(['/tovari', '/'], (req, res) => {
    console.log(sha3_512('12345жопавзорвалась'))
    const db = new sqlite3.Database('./database/database_tovari.db')
    let querySelect = `SELECT \
        tovari.id, tovar.name as tovar, tovari.kolichestvo, kladovshik.name as kladovshik, sklad.name as sklad, tovari.date, tovari.new \
        FROM tovari \
        INNER JOIN tovar ON tovari.name = tovar.id \
        INNER JOIN kladovshik ON tovari.kladovshik = kladovshik.id \
        INNER JOIN sklad ON tovari.number_of_sklad = sklad.id`

    let name_of_sklad = `SELECT \
        sklad.id, sklad.name \
        FROM sklad`

    db.all(querySelect, (err, json) => {
        if (err) console.log(err.message);

        db.all(name_of_sklad, (err, sklad) => {
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

app.get(['/save'], (req, res) => { 
    const db = new sqlite3.Database('./database/database_tovari.db')
    
    let querySelect = `UPDATE tovari SET new=0; COMMIT;`
    
    db.all(querySelect, (err, rows) => {

        rows = rows.map(x => {
            return x
        })

        if (err) console.log(err.message);
        res.redirect('/')
    })
    db.close()
}); 

app.post('/login', (req, res) => {
    req.session.message = 'login';
    req.session.timeOfEntry = 'time';
    const db_users = new sqlite3.Database('./database/database_users.db')
    let users = `SELECT * FROM users`
    db_users.all(users, (err, u) => {
        if (err) console.log(err.message);
        const need_U = u.find((elem) => (elem['name'] === req.body.login)&&(elem['password'] === sha3_512(req.body.password)))
        console.log(sha3_512(req.body.password))
        if ((req.body.login !== undefined) && ((req.body.password !== undefined))) {
                if (need_U !== undefined) { // или хэши
                    req.session.username = req.body.login;
                    req.session.cookie.maxAge = req.body.login == 'admin'? 30*2*30_000: 30*2*30_000;
                    req.session.password = req.body.password;
                    req.session.message = req.body.login; // для контроля
                    req.session.timeOfEntry = req.session.cookie._expires; // для контроля
                    if (req.body.login == 'admin') {
                        res.cookie('username', req.body.login, {maxAge : 30*2*30_000, httpOnly : true, path : '/'})
                        res.cookie('password', sha3_512(req.body.password), {maxAge : 30*2*30_000, httpOnly : true, path : '/'})
                        res.cookie('kogda', getHM());
                    } else {
                        res.cookie('username', req.body.login, {maxAge : 30*2*30_000, httpOnly : true, path : '/'})
                        res.cookie('password', sha3_512(req.body.password), {maxAge : 30*2*30_000, httpOnly : true, path : '/'})
                        res.cookie('kogda', getHM());
                    }
                    res.redirect('/')
                } else {
                    log('>>> пароль не тот');
                    
                    res.redirect('/'); // пароль не тот 
                }
        } else {
            log('>>> нет такого пользователя');
            res.redirect('/'); // нет такого пользователя
        } 
        // else {
        //     log('>>> не ввёл логин или пароль');
        //     res.redirect('/'); // не ввёл логин или пароль
        // }
    });
    db_users.close()
});

app.get('/login', (req, res) => {
    const username = req.cookies.username
    const password = req.cookies.password
    res.render('login.ejs', {username, password})
});

app.get('/logout', (req, res) => { // logout
    res.clearCookie('username');
    res.clearCookie('password');
    res.clearCookie('kogda');
    req.session.destroy()
    // log('sess: ' + JSON.stringify(req.session, null, 2));
    res.redirect('/');
});

 
// sha3_512('1234')
app.use(router_new); 
app.use(router_sort); 
app.use(router_filter); 
app.use(router_update);
app.use(router_delete);
app.use(router_data);
//    app.use(router_save);


app.listen(PORT, () => log('http://localhost:3000')); 