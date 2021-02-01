const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
var mysql = require('mysql')

createDatabase()
// createTable()
// showData()
// insertData()


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
    console.log(`a user connected : socketId : ${socket.id}`)

    showData((call) => {
        const data = {
            data: JSON.parse(call)
        }
        io.to(socket.id).emit('restoreChat', JSON.stringify(data))
        console.log(`restoreChat ${call}`)
    })

    socket.on('newMessage', (data) => {
        console.log(`new message ${data}`)
        const mData = JSON.parse(data)
        const mMessage = mData.chat
        socket.broadcast.emit('message', data)
        insertData(mMessage)
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
        con.query("CREATE DATABASE IF NOT EXISTS mydb", (err, result) => {
            if (err) throw err
            console.log('Database created')
            createTable()
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
        con.query("CREATE TABLE IF NOT EXISTS chatroom (message VARCHAR(255))", (err, result) => {
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
        con.query("SELECT * FROM chatroom", (err, result, fields) => {
            if (err) throw err
            console.log(result)
            var test = JSON.stringify(result)
            call(test)
        })
    })
}

function insertData(message) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "mydb"
    })
    con.connect((err) => {
        if (err) throw err
        console.log('database connected')
        con.query(`INSERT INTO chatroom VALUES ('${message}')`, (err, result, fields) => {
            if (err) throw err
            console.log(result)
        })
    })
}