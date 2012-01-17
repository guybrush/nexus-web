#!/usr/bin/env node

var express = require('express')
  , dnode = require('dnode')
  , stylus = require('stylus')
  , jade = require('jade')
  , jadevu = require('jadevu')
  , fs = require('fs')
  , _ = require('underscore')
  , EE2 = require('eventemitter2').EventEmitter2
  , ee2 = new EE2({wildcard:true,delimiter:'::',maxListeners:20})
  , argv = require('optimist').argv
  , port  = argv.p || 8001
  , host  = argv.h || '0.0.0.0'
  , configPath = argv.c || '/home/patrick/.nexus/config.js'
  , config = require(configPath)
  , remotes = {}
  , clients = {}

ee2.onAny(function(d){
  if (d)
    console.log(this.event+' ►',d)
  else
    console.log(this.event)
})

ee2.on('remote::*::*',function(data){
  var split = this.event.split('::')
    , name = split[1]
    , event = split[2]
  _.each(clients,function(x,i){
    x.setRemote(name,remotes[name])
  })
})
  
//------------------------------------------------------------------------------
//                                       handle remotes
//------------------------------------------------------------------------------
  
_.each(config.remotes,function(x,i){addRemote(i,x)})

function addRemote(name, opts, cb) {
  cb = cb || function(){}
  remotes[name] = {status:'connecting',remote:null}
  opts.port = opts.port || 0xf00
  opts.host = opts.host || '0.0.0.0'
  opts.reconnect = 500
  if (opts.key && opts.cert) {
    opts.key = fs.readFileSync(opts.key)
    opts.cert = fs.readFileSync(opts.cert)
  }
  var client = dnode.connect(opts,function(remoteNexus, conn){
    conn.on('ready',function(){
      remotes[name].status = 'ready'
      remotes[name].remote = remoteNexus
      ee2.emit('remote::'+name+'::ready')
    })
    conn.on('error',function(d){
      remotes[name].status = 'error'
      ee2.emit('remote::'+name+'::error',d)
    })
    conn.on('end',function(){
      remotes[name].status = 'end'
      ee2.emit('remote::'+name+'::end')
    })
    conn.on('refused',function(){
      remotes[name].status = 'refused'
      ee2.emit('remote::'+name+'::refused')
    })
    conn.on('drop',function(){
      remotes[name].status = 'drop'
      ee2.emit('remote::'+name+'::drop')
    })
    conn.on('reconnect',function(){
      remotes[name].status = 'reconnect'
      ee2.emit('remote::'+name+'::reconnect')
    })
  })
  client.on('error',function(d){
    remotes[name].status = 'error'
    ee2.emit('remote::'+name+'::error',d)
  })
}

function reconnectRemote(name, cb) {
  cb = cb || function(){}
  if (!name || !_.isString(name))
    return cb('error')
}

//------------------------------------------------------------------------------
//                                       dnode-interface
//------------------------------------------------------------------------------

function dnodeInterface(remote, conn){
  conn.on('ready',function(){
    _.each(remotes,function(x,i){remote.setRemote(i,x)})
    clients[conn.id] = remote
    ee2.emit('client::'+conn.id+'::ready')
  })
  conn.on('end',function(){
    delete clients[conn.id]
    ee2.emit('client::'+conn.id+'::end')
  })
  this.addRemote = addRemote
  this.reconnectRemote = reconnectRemote
}

//------------------------------------------------------------------------------
//                                       express-app
//------------------------------------------------------------------------------

var app = express.createServer()

app.set('views',__dirname+'/views')
  
app.use(stylus.middleware
  ( { src : __dirname+'/views'
    , dest : __dirname+'/public' 
    , force : true
    , compress : true
    } ) )

app.use(express.static(__dirname+'/public'))

app.get('/',function(req,res,next){res.render('index.jade')})

dnode(dnodeInterface).listen(app)

app.listen(port, host, function(){
  console.log('webinterface listening on: '+host+':'+port)
})

