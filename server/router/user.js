const express = require('express')
const router = express.Router()
router.use(express.json())

//导入路由处理模块
const user_handler = require('../router-handler/user')

router.post('/login', user_handler.login)
router.post('/regist', user_handler.regist)
router.post('/auth', user_handler.auth)

module.exports = router