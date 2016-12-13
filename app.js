var express = require('express')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var app = express();
var schema = mongoose.Schema;

app.use(bodyParser.urlencoded({
  extended: true
}))

mongoose.connect("mongodb://localhost/AnAProject", function(err){
  if(err){
    console.log('MongoDB Error!');
    throw err
  }
  else{
    console.log('MongoDB Connected!')
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

var Content = mongoose.model('content', ContentSchema);

app.listen(3000, function(err){
  if(err){
    console.log('Server Error!');
    throw err
  }
  else{
    console.log('Server Running at 3000 Port!')
  }
})

app.post('/get', function(req, res){
  Content.find({
    id: req.param('id')
  }, function(err, result){
    if(err){
      console.log('/get Error!')
      throw err
    }
    else if(result){
      res.json(result)
    }
    else{
      console.log('Data not Founded')
      res.json({
        success: false,
        message: 'Data not Founded'
      })
    }
  })
})

app.post('/put', function(req, res){
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
      res.json({
        success : true,
        message : 'Post Success!'
      })
    }
  })
})
