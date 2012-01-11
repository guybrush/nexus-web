#!/usr/bin/env node

var express = require('express')
  , dnode = require('dnode')
  , browserify = require('browserify')
  , stylus = require('stylus')
  , jade = require('jade')
  , jadevu = require('jadevu') 
  , spawn = require('child_process').spawn
  , argv = require('optimist').argv
  , port  = argv.p || 3000
  , host  = argv.h || '0.0.0.0'
  , nPort = argv.P || 5000
  , nHost = argv.H || '0.0.0.0'
  
var app = express.createServer()

app.set('views',__dirname+'/views')
  
app.use(stylus.middleware
  ( { src : __dirname+'/views'
    , dest : __dirname+'/public' 
    , force : true
    , compress : true
    } ) )

app.use(express.static(__dirname+'/public'))

// app.use(browserify( { entry : __dirname+'/public/index.js'
//                     , watch : true } ) )

app.get('/',function(req,res,next){res.render('index.jade')})

var client = dnode.connect(nPort, nHost, function(remote, conn){
  dnode(remote).listen(app)
  conn.on('remote',function(rem){
    // #TODO proxy the new remote to the app 
    console.log(rem)
  })
})
client.on('error', function(err){
  console.log(err)
  res.render('error.jade',err)
})

app.listen(port, host, function(){
  console.log('webinterface listening on: '+host+':'+port)
})

