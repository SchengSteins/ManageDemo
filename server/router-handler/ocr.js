var fs = require('fs');

var AipOcrClient = require("baidu-aip-sdk").ocr;

// 设置APPID/AK/SK
var APP_ID = "f59179db4c6c411abaec62f7e2faf380";
var API_KEY = "53bb91c4ee244369af7199de7b295db5";
var SECRET_KEY = "22869f80bf17401caf9b3cf97b8c9785";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);

exports.ocrRec = (req, res) => {
    try {
        let path = './public/uploads/' + req.body.file
        var image = fs.readFileSync(path).toString("base64");
        fs.unlink(path, (err) => {
            if (err) throw err;
        })
        client.generalBasic(image).then((result) => {
            res.send(JSON.stringify(result))
        }).catch((err) => {
            // 如果发生网络错误
            throw err
        })
    } catch (error) {
        res.send(error)
    }
}

exports.uploads = (req, res) => {
    res.send(req.body.fileList)
}

exports.uploadTags = (req, res) => {
    let tags = req.body;
    console.log(tags);
    let content = ''
    tags.forEach((tag) => {
        content += tag.filename + "  " + JSON.stringify(tag.info) + '\n'
    })
    fs.writeFile('./public/tags.txt', content, err => {
        if (err) {
            console.error(err)
            return
        }
        //文件写入成功。
        res.send('文件写入成功')
    })
}

exports.deloads = (req, res) => {
    try {
        let path = './public/uploads/' + req.query.filename
        fs.unlink(path, (err) => {
            if (err) res.send(err);
        })
        res.send('ok')
    } catch (error) {
        res.send(error)
    }
}

exports.getImg = (req, res) => {
    const dir = './public/uploads/'
    const files = fs.readdirSync(dir)
    res.send(files.map((file) => {
        return 'http://127.0.0.1:3006/static/' + file
    }))
}