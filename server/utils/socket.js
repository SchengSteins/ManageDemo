const Koa = require('koa')
const app = new Koa()
var http = require('http')
var server = http.createServer(app.callback())

const SocketIO = require('socket.io')
const io = SocketIO(server, {
    transports: ['websocket']
})
io.on('connection', socket => {
    console.log('连接成功')
    // 发送
    setInterval(() => {
        socket.emit('test1', { 'test': 1 })
    }, 2000)
    // 接收
    socket.on('test2', data => {
        console.log('收到', data)
    })
})

module.exports = io