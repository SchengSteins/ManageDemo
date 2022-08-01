const express = require('express')
const path = require('path')

//创建一个服务器实例
const app = express()

//跨域
const cors = require('cors')
app.use(cors())

//封装res.send
app.use((req, res, next) => {
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

//配置图片资源路径
app.use('/static', express.static(path.join(__dirname, './public/uploads')))

//路由
const ocrRouter = require('./router/ocr')
app.use('/ocr', ocrRouter)
const userRouter = require('./router/user')
app.use('/user', userRouter)

app.listen(3006, () => {
    console.log('api server running at http://127.0.0.1:3006')
})


//websocket
const websocket = require('./utils/socket')
websocket.listen(3000)