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

var ContentSchema = new schema({
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

var UserSchema = new schema({
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

var Content = mongoose.model('content', ContentSchema);

var User = mongoose.model('user',UserSchema);

app.listen(3000, function(err){
  if(err){
    console.log('Server Running Error!');
    throw err
  }
  else{
    console.log('Server Running at 3000 Port!')
  }
})

app.post('/timeline', function(req, res){
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

app.post('/post', function(req, res){
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
      console.log()
      res.json({
        success : true,
        message : 'Post Success!'
      })
    }
  })
})

app.post('/deletepost', function(req, res){
  Content.findOne({
    id : req.param('id'),
    title : req.param('title')
  }, function(err, result){
    if(err){
      console.log('/deletepost Error!')
      throw err
    }
    else if(result) {
      console.log(req.param('id')+" 's"+req.param('title')+" Content Delete")
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
      res.json({
        success : false,
        message : "Content Not Founded"
      })
    }
  })
})

app.post('/login', function(req, res){
  User.findOne({
    id : req.param('id')
  }, function(err, result){
    if(err){
      console.log('/login Error!')
      throw err
    }
    else if(result){
      if(req.param('password')==result.password){
        res.json({
          success : true,
          message : "Login Success!"
        })
      }
      else if(req.param('password')!=result.password){
        res.json({
          success : false,
          message : "Password Error!"
        })
      }
    }
    else {
      res.json({
        success : false,
        message : "Account Error!"
      })
    }
  })
})

app.post('/register', function(req, res){
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

app.post('/edit', function(req, res){
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
      res.json({
        success : false,
        message : "Account Not Founded!"
      })
    }
  })
})

app.post('/delete', function(req, res){
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
