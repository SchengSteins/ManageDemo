const express = require('express')

//创建一个服务器实例
const app = express()

//跨域
const cors = require('cors')
app.use(cors())

const formidable = require('express-formidable') // 引入
// 解析formdata中间件
app.use(formidable({
    encoding: 'utf-8',
    uploadDir: './uploads',
}));  
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

//token中间件
// const expressJWT = require('express-jwt')
// const config = require('./config')
// app.use(expressJWT({secret: config.jwtSecretKey}).unless({path: [/^\/api/]}))

//路由
const ocrRouter = require('./router/ocr')
app.use('/ocr', ocrRouter)
const userRouter = require('./router/user')
app.use('/user', userRouter)

app.listen(3006, () => {
    console.log('api server running at http://127.0.0.1:3006')
})