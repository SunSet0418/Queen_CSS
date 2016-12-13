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
