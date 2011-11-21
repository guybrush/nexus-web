var express = require('express')
  , dnode = require('dnode')
  , browserify = require('browserify')
  , stylus = require('stylus')
  , jade = require('jade')
  , jadevu = require('jadevu')
  , app = module.exports = express.createServer()
  
app.use( browserify(__dirname+'/public/index.js')
       , stylus.middleware({src:__dirname+'/views',dst:__dirname+'/public'}) )

app.get('/',function(req,res,next){res.render('index')})
