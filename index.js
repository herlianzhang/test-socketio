const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
var mysql = require('mysql')

// createTable()
// showData()
// insertData()


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
    console.log(`a user connected : socketId : ${socket.id}`)

    showData((call) => {
        socket.emit('test', call)
    })

    socket.on('newMessage', (data) => {
        console.log(`new message ${data}`);
        socket.broadcast.emit('test', data)
    })

    socket.on('disconnect', () => {
        console.log('One of sockets disconnected from our server')
    })
})

http.listen(3000, () => {   
    console.log('listening on *:3000')
})

function createDatabase() {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: ""
    })
    con.connect((err) => {
        if (err) throw err
        console.log('database connected')
        con.query("CREATE DATABASE mydb", (err, result) => {
            if (err) throw err
            console.log('Database created')
        })
    })
}

function createTable() {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "mydb"
    })
    con.connect((err) => {
        if (err) throw err
        console.log('database connected')
        con.query("CREATE TABLE testchat (chat VARCHAR(255))", (err, result) => {
            if (err) throw err
            console.log('Table created')
        })
    })
}

function showData(call) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "mydb"
    })
    con.connect((err) => {
        if (err) throw err
        console.log('database connected')
        con.query("SELECT * FROM testchat", (err, result, fields) => {
            if (err) throw err
            console.log(result)
            var test = JSON.stringify(result)
            console.log(`masuk result pak eko ${test}`)
            console.log(call)
            call(test)
        })
    })
}

function insertData() {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "mydb"
    })
    con.connect((err) => {
        if (err) throw err
        console.log('database connected')
        con.query("INSERT INTO testchat VALUES ('hahahahhaha')", (err, result, fields) => {
            if (err) throw err
            console.log(result)
        })
    })
}