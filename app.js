var express = require('express') //express 모듈 추출
var bodyParser = require('body-parser') //body-parser 모듈 추출
var mongoose = require('mongoose') //mongoose 모듈 추출
var app = express();
var schema = mongoose.Schema;

app.use(bodyParser.urlencoded({ //미들웨어 선언
  extended: true
}))

mongoose.connect("mongodb://localhost/QueenCSS", function(err){ //mongdb 연동 (Database name : QueenCSS)
  if(err){
    console.log('MongoDB Error!');
    throw err
  }
  else{
    console.log('MongoDB Connected! [ Database : QueenCSS ]')
  }
})

var ContentSchema = new schema({ //타임라인에 올릴 글에대한 양식 (database 저장양식)
  id : {
    type : String
  },
  title : {
    type : String
  },
  content : {
    type : String
  }
})

var UserSchema = new schema({ //회원정보 양식 (")
  username : {
    type : String
  },
  id : {
    type : String
  },
  password : {
    type : String
  }
})

var Content = mongoose.model('content', ContentSchema); // 위에 선언한 양식에 따라서 테이블 생성

var User = mongoose.model('user',UserSchema); //

app.listen(3000, function(err){ // 서버 connect
  if(err){
    console.log('Server Running Error!');
    throw err
  }
  else{
    console.log('Server Running at 3000 Port!')
  }
})

app.post('/timeline', function(req, res){ // 내가 올린 글을 볼수 있는 타임라인 데이터 불러오기
  Content.find({
    id: req.param('id')
  }, function(err, result){
    if(err){
      console.log('/get Error!')
      throw err
    }
    else if(result&&result!=""){
      console.log(result.username + ' timeline result')
      console.log(result)
      res.json(result)
    }
    else if(result == ""){
      console.log('Data not Founded')
      res.json({
        success: false,
        message: 'Data not Founded'
      })
    }
  })
})

app.post('/post', function(req, res){ // 타임라인에 올릴 글을 작성하고 저장
  var content = new Content({
    id : req.param('id'),
    title : req.param('title'),
    content : req.param('content')
  })
  content.save(function(err){
    if(err){
      console.log('/put Error!')
      throw err
    }
    else {
      console.log(req.param('id')+"'s"+req.param('title')+" content upload success")
      res.json({
        success : true,
        message : 'Post Success!'
      })
    }
  })
})

app.post('/deletepost', function(req, res){ // 제목과 사용자 아이디를 입력받아 일치하는 글 삭제
  Content.findOne({
    id : req.param('id'),
    title : req.param('title')
  }, function(err, result){
    if(err){
      console.log('/deletepost Error!')
      throw err
    }
    else if(result) {
      console.log(req.param('id')+"'s "+req.param('title')+" Content Delete")
      Content.remove({
        id : req.param('id'),
        title : req.param('title')
      }, function(err){
        if(err){
          console.log('Content remove Error')
          throw err
        }
        else {
          res.json({
            success : true,
            message : "Content Delete Success"
          })
        }
      })
    }
    else {
      console.log('Content Not Founded');
      res.json({
        success : false,
        message : "Content Not Founded"
      })
    }
  })
})

app.post('/login', function(req, res){  // REST API를 이용한 json 통신 로그인
  User.findOne({
    id : req.param('id')
  }, function(err, result){
    if(err){
      console.log('/login Error!')
      throw err
    }
    else if(result){
      if(req.param('password')==result.password){
        console.log(result.username + ' Login Success')
        res.json({
          success : true,
          message : "Login Success!"
        })
      }
      else if(req.param('password')!=result.password){
        console.log(result.username + ' Login Failed (Password Error)')
        res.json({
          success : false,
          message : "Password Error!"
        })
      }
    }
    else {
      console.log('Login Error (Account Not Founded)')
      res.json({
        success : false,
        message : "Account Error!"
      })
    }
  })
})

app.post('/register', function(req, res){ // 회원가입
  var user = new User({
    username : req.param('username'),
    id : req.param('id'),
    password : req.param('password')
  })

  User.findOne({
    id : req.param('id')
  }, function(err, result){
    if(err){
      console.log('/register Error!')
      throw err
    }
    else if(result){
      console.log('Already register '+result.username)
      res.json({
        success : false,
        message : "Already register"
      })
    }
    else {
      user.save(function(err){
        if(err){
          console.log('user save Error!')
          throw err
        }
        else {
          console.log(req.param('username')+'register')
          res.json({
            success : true,
            message : "register Success!"
          })
        }
      })
    }
  })
})

app.post('/edit', function(req, res){ // 회원 정보 수정
  User.findOne({
    id : req.param('id')
  }, function(err, result){
    if(err){
      console.log('/edit Error!')
      throw err
    }
    else if(result){
      User.update({
        username : req.param('username'),
        id : result.id,
        password : req.param('password')
      }, function(err){
        if(err){
          console.log('update Error!')
          throw err
        }
        else {
          console.log(req.param('username')+' update success!')
          res.json({
            success : true,
            message : "Update Success!"
          })
        }
      })
    }
    else {
      console.log('Edit Account Not Founded')
      res.json({
        success : false,
        message : "Account Not Founded!"
      })
    }
  })
})

app.post('/delete', function(req, res){ // 회원탈퇴
  User.findOne({
    id : req.param('id')
  }, function(err, result){
    if(err){
      console.log('/delete Error!')
      throw err
    }
    else if(result){
      if(result.password == req.param('password')){
        console.log(result.username + ' Delete Success')
        User.remove({
          id : result.id,
          password : result.password
        }, function(err){
          if(err){
            console.log('user delete Error!')
            throw err
          }
          else {
            res.json({
              success : true,
              message : "User Delete Success"
            })
          }
        })
      }
      else if(result.password != req.param('password')){
        console.log('User Delete Password Error!')
        res.json({
          success : false,
          message : "Password Error"
        })
      }
    }
    else {
      console.log('User Delete Account Not Founded')
      res.json({
        success : false,
        message : "Account Not Founded"
      })
    }
  })
})
