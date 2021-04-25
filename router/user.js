const express = require('express')
const userModel = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()

// 회원정보
router.get('/', (req, res) => {

    userModel
        .find()
        .then(users => {
            res.json({
                msg : "total get user",
                count : users.length,
                userInfo : users.map(user => {
                    return{
                        id : user._id,
                        name : user.name,
                        email : user.email,
                        password : user.password
                    }
                })
            })
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

// 회원가입
router.post('/signup', (req, res) => {
    // password 암호화 => 이메일 유무 check => user model 생성 => save
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err){
            return res.status(500).json({
                msg : err.message
            })
        }
        else{
            userModel
                .findOne({email : req.body.userEmail})
                .then(user => {
                    if(user){
                        return res.json({
                            msg : "user exited, please other email"
                        })
                    }
                    else{
                        const newUser = new userModel(
                            {
                                name : req.body.userName,
                                email : req.body.userEmail,
                                password : hash
                            }
                        )

                        newUser
                            .save()
                            .then(user => {
                                res.json({
                                    msg : "register user",
                                    userInfo : {
                                        id : user._id,
                                        name : user.name,
                                        email : user.email,
                                        password : user.password
                                    }
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    msg : err.message
                                })
                            })
                    }
                })
                .catch(err => {
                    res.status(500).json({
                        msg : err.message
                    })
                })
        }
    })


})

// 로그인
router.post('/login', (req, res) => {
    // email 유무 check => password 매칭 => 로그인 성공시 token 반환
    userModel
        .findOne({email : req.body.userEmail})
        .then(user => {
            if(!user){
                return res.status(404).json({
                    msg : "user email, please other email"
                })
            }
            else{
                bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                    if(err || isMatch === false){
                        return res.status(408).json({
                            msg : "password not match"
                        })
                    }
                    else{
                        const token = jwt.sign(
                            {id : user._id, email: user.email},
                            process.env.SECRET_KEY,
                            { expiresIn: "1h"}
                        )

                        res.json({
                            msg : "successful login",
                            tokenInfo : token
                        })
                        // res.json({
                        //     msg : "successful login",
                        //     userInfo : user
                        // })
                    }
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                msg : err.message
            })
        })
})

module.exports = router