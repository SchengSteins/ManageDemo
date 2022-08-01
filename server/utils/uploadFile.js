const multer = require("multer");
const path = require("path");

let fullPath = path.resolve("./public/uploads");
let storage = multer.diskStorage({
    //设置文件存储路径
    destination: (req, file, cb) => {
        cb(null, fullPath);
    },
    //设置文件存储名称
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

exports.singe = (req, res, next) => {
    //上传单张图片
    let upload = multer({ storage }).single("file");
    upload(req, res, (err) => {
        if (err) {
            res.send("err:" + err);
        } else {
            //将文件信息赋值到req.body中，继续执行下一步
            req.body.file = req.file.filename;
            next();
        }
    })
}

exports.multiple = (req, res, next) => {
    //上传单张图片
    let upload = multer({ storage }).array('file');
    upload(req, res, (err) => {
        if (err) {
            res.send("err:" + err);
        } else {
            //将文件信息赋值到req.body中，继续执行下一步
            req.body.fileList = []
            let files = req.files //多文件的获取
            files.forEach((file) => {
                req.body.fileList.push(file.originalname);
            })
            next();
        }
    })
}