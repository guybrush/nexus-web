#!/usr/bin/env node

var app = require('../server')
  , dnode = require('dnode')
  , fork = require('child_process').fork
  , argv = require('optimist').argv
  , port  = argv.p || 3000
  , host  = argv.h || '0.0.0.0'
  , nPort = argv.P || 5000
  , nHost = argv.H || '0.0.0.0' 
  
process.title = 'nexus-web'

start()

function start() {
  app.listen(port, host, function(){
    console.log('webinterface listening on: '+host+':'+port)
    var client = dnode.connect(nPort, nHost, {reconnect:500}, function(remote, conn){
      conn.on('reconnect',function(){
        app.close()
        client.end()
        start()
      })
      conn.on('ready',function(){
        console.log('connected to nexus: '+nHost+':'+nPort)
        dnode(remote).listen(app)
      }) 
    })
    client.on('error', function(err){
      if (err.code != 'ECONNREFUSED') console.log(err)
    })
  })
}

