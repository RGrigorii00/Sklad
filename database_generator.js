const sqlite3 = require('sqlite3').verbose() // npm install --save sqlite3
const db = new sqlite3.Database('./database/database_tovari.db')
const db_users = new sqlite3.Database('./database/database_users.db')

const createTable = () => {
	db.get("PRAGMA foreign_keys = ON") // включить поддержку внешних ключей
	db_users.get("PRAGMA foreign_keys = ON") // включить поддержку внешних ключей
	let table_kladovshik = 'CREATE TABLE IF NOT EXISTS "kladovshik" ( \
		"id"	INTEGER, \
		"name"	TEXT, \
		"adress" TEXT, \
		PRIMARY KEY("id" AUTOINCREMENT))'
	db.run(table_kladovshik)

	let table_sklad = 'CREATE TABLE IF NOT EXISTS "sklad" ( \
		"id"	INTEGER, \
		"name"	TEXT, \
		"adress"	TEXT, \
		PRIMARY KEY("id" AUTOINCREMENT))'
	db.run(table_sklad)

	let table_users = 'CREATE TABLE IF NOT EXISTS "users" ( \
		"id"	INTEGER, \
		"name"	TEXT, \
		"password"	TEXT, \
		PRIMARY KEY("id" AUTOINCREMENT))'     
	db_users.run(table_users)   

	let table_tovar = 'CREATE TABLE IF NOT EXISTS "tovar" ( \
		"id"	INTEGER, \
		"name"	TEXT, \
		PRIMARY KEY("id" AUTOINCREMENT))'     
	db.run(table_tovar)

	let table_tovari = 'CREATE TABLE IF NOT EXISTS "tovari" ( \
		"id"	INTEGER, \
		"name"	TEXT, \
		"kolichestvo" INTEGER, \
		"kladovshik" TEXT, \
		"number_of_sklad" INTEGER, \
		"date" TEXT, \
		PRIMARY KEY("id" AUTOINCREMENT), \
		FOREIGN KEY(kladovshik) REFERENCES kladovshik(id), \
		FOREIGN KEY(number_of_sklad) REFERENCES sklad(id), \
		FOREIGN KEY(name) REFERENCES tovar(id))'
	db.run(table_tovari)
	db.close()
}

const deleteTable = () => {
	let query = "DROP TABLE IF EXISTS tasks"
	db.run(query)
	db.close()
}

const insertData = () => {
	// let json = require('./json/list.json')
	let kladovshik = `INSERT INTO \ 
		kladovshik ("name", "adress") \ 
		VALUES ('Кектик Дмитрий Олегович', 'ул. Пушкина'), \
		('Захаров Денис Константинович', 'ул. Пушкина'), \
		('Утробин Дмитрий Сергеевич', 'ул. Пушкина')`

	// for (var a of json) {
	// 	let record = [a.name, a.description, a.date, a.start_time, a.status, a.priority, a.new]
	db.run(kladovshik)
	// }

	// json = require('./json/status.json')
	let sklad = `INSERT INTO \ 
		sklad ("name", "adress") \ 
		VALUES ('ООО Склад Расклад', 'Локомотивная 1'), \
		('ООО Ран Склад', 'Папанинцев 4'), \
		('ОАО Складик Пузатик', 'Локомотивная 1')`

	// for (var a of json) {
	// 	let record = [a.name]
		db.run(sklad)
	// }

	// json = require('./json/priority.json')
	let tovar = `INSERT INTO \ 
		tovar ("name") \ 
		VALUES ('Байкал вода'), \
		('Нефть'), \
		('Древесина'), \
		('Золото'), \
		('Песок')`

	// for (var a of json) {
	// 	let record = [a.name]
		db.run(tovar)
	// }

	// json = require('./json/priority.json')
	let tovari = `INSERT INTO \ 
		tovari ("name", "kolichestvo", "kladovshik", "number_of_sklad", "date") \ 
		VALUES (1, 100, 1, 1, "2024-03-03"), \
		(2, 10000, 1, 2, "2024-05-05"), \
		(3, 100, 2, 3, "2024-03-03"), \
		(4, 100, 2, 1, "2024-03-03"), \
		(5, 100, 3, 2, "2024-03-03")`

	// for (var a of json) {
	// 	let record = [a.name]
		db.run(tovari)
	// }
	db.close()

	// json = require('./json/priority.json')
	let users = `INSERT INTO \ 
		users ("name", "password") \ 
		VALUES (1, 100, 1, 1, "2024-03-03"), \
		(2, 10000, 1, 2, "2024-05-05"), \
		(3, 100, 2, 3, "2024-03-03"), \
		(4, 100, 2, 1, "2024-03-03"), \
		(5, 100, 3, 2, "2024-03-03")`

	// for (var a of json) {
	// 	let record = [a.name]
		db_users.run(users)
	// }
	db_users.close()
}

// let tovari = `ROLLBACK`

// 	// for (var a of json) {
// 	// 	let record = [a.name]
// 		db.run(tovari)
// 	// }
// 	db.close()

json = require('./json/users.json')
let users = `INSERT INTO \ 
users ("name", "password") \ 
VALUES (?, ?)`   

for (var a of json) {
	let record = [a.name, a.password]
	db_users.run(users, record)
}
db_users.close()   

// createTable()
// deleteTable()
// insertData()