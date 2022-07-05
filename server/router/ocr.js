const express = require('express')
const router = express.Router()

//导入路由处理模块
const ocr_handler = require('../router-handler/ocr')

//ocr
router.post('/',ocr_handler.ocrRec)

module.exports = router