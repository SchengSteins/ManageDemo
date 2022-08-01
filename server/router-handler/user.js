//导入数据库操作模块
const db = require('../db/index')
//导入bcrypt(加密，验证)
const bcrypt = require('bcryptjs')
//导入生成Token的包
const jwt = require('jsonwebtoken')
const config = require('../config')
const Mock = require('mockjs')

exports.login = (req, res) => {
    const { username, password } = req.body
    // 先判断用户是否存在
    // 判断账号和密码是否对应
    const sql = `select * from env_users where username=?`
    db.query(sql, username, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('用户名错误！')

        //验证
        const compareResult = bcrypt.compareSync(password, results[0].password)
        if (!compareResult) return res.cc('密码错误！')

        //生成token
        const user = { ...results[0], password: '' }
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
        res.send({
            status: 0,
            message: '登录成功！',
            data: {
                menu: [
                    {
                        path: '/home',
                        name: 'home',
                        label: '首页',
                        icon: 's-home',
                        url: 'home/index'
                    },
                    {
                        path: '/mall',
                        name: 'mall',
                        label: '商品管理',
                        icon: 'video-play',
                        url: 'mall/index'
                    },
                    {
                        path: '/ocr',
                        name: 'ocr',
                        label: '文字识别',
                        icon: 'camera',
                        url: 'ocr/index'
                    },
                    {
                        path: '/user',
                        name: 'user',
                        label: '用户管理',
                        icon: 'user',
                        url: 'user/index'
                    },
                    {
                        label: '其他',
                        icon: 'location',
                        children: [
                            {
                                path: '/page1',
                                name: 'page1',
                                label: '页面1',
                                icon: 'setting',
                                url: 'other/pageOne'
                            },
                            {
                                path: '/page2',
                                name: 'page2',
                                label: '页面2',
                                icon: 'setting',
                                url: 'other/pageTwo'
                            }
                        ]
                    }
                ],
                token: tokenStr,
                message: '获取成功'
            }
        })
    })
}

exports.regist = (req, res) => {
    let { username, email, password } = req.body
    //查询sql验证
    const sqlStr = 'select * from env_users where username=?'
    db.query(sqlStr, username, (err, results) => {
        if (err) {
            return res.cc(err)
        }
        if (results.length > 0) {
            return res.cc('用户名被占用')
        }
        //调用bcrypt.hashSync对密码进行加密
        password = bcrypt.hashSync(password, 10);
        let uuid = Mock.Random.guid();

        // 插入新用户
        const sql = 'insert into env_users set ?'
        db.query(sql, { uuid: uuid, username: username, password: password, email: email }, (err, results) => {
            //判断SQL语句是否执行成功
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试！')
            res.cc('注册成功！', 0)
        })
    })
}

exports.auth = (req, res) => {
    let { token } = req.body
    console.log(token);
    // 校验token(错误会抛出异常)
    try {
        let tokenKey = jwt.verify(token, config.jwtSecretKey)
        console.log(tokenKey);
        res.cc('校验成功！', 0)
    } catch {
        res.cc('验证已过期，请重新登录！', 1)
    }

}