const express = require('express')
const router = express.Router()

//formdata
const muter = require('../utils/uploadFile')

//导入路由处理模块
const ocr_handler = require('../router-handler/ocr')

//ocr
router.post('/', muter.singe, ocr_handler.ocrRec)
router.post('/uploadTags', express.json(), ocr_handler.uploadTags)
router.post('/uploads', muter.multiple, ocr_handler.uploads)
router.get('/deloads', ocr_handler.deloads)
router.get('/getImg', ocr_handler.getImg)

module.exports = router