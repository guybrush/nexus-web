  //
 // nexus - webinterface
//

var dnode = require('dnode')
  , _ = require('underscore')
  , EE2 = require('eventemitter2').EventEmitter2
  , ee2 = new EE2({wildcard:true,delimiter:'::',maxListeners:20})

dnode.connect(function(remote,conn){
  remote.subscribe('*::*::*',function(event,data){
    $('#debug').prepend('<pre>'+event+' ► '+data+'</pre>')  
    ee2.emit(event,data)
  })
  remote.config(function(err, config){
    $('#remotes').html(template('remotes',config.remotes))
  })
  remote.ps(function(err, data){
    $('#procs').html(template('procs',data))
  })
  remote.ls(null, function(err, data){
    console.log('ls',err,data)
    $('#apps').html(template('apps',data))
  })
})










/************* /

//------------------------------------------------------------------------------
//                                                          applications
//------------------------------------------------------------------------------
  
models.app = bb.Model.extend()

collections.app = bb.Collection.extend()

views.app = bb.View.extend()

//------------------------------------------------------------------------------
//                                                          processes
//------------------------------------------------------------------------------

models.proc = bb.Model.extend()

collections.proc = bb.Collection.extend
( { initialize: function() {
      
    } 
  } )

views.proc = bb.View.extend()

//------------------------------------------------------------------------------
//                                                          remotes
//------------------------------------------------------------------------------

models.remote = bb.Model.extend
( { initialize: function() {
      this.procs = new collections.proc()
      this.apps = new collections.app()
    } 
  } )

collections.remote = bb.Collection.extend
( { model : models.remote
  , initialize: function() {
      var self = this
      //self.nexus = opts.nexus
      nexus.config(function(err,config){
        _.each(config.remotes,function(x,i){
          var model = {id:i,host:x.host,port:x.port}
          console.log('adding',model)
          self.add(model)
        })
      })
    }
  } )

views.remote = bb.View.extend()

//------------------------------------------------------------------------------
//                                                          nexus
//------------------------------------------------------------------------------

views.nexus = bb.View.extend
( { initialize: function() {
      this.remotes = new collections.remote()
    }
  , render: function() {
      var a = 0
      $(this.el).html(template('nexus', { a:a }))
      return this
    }
  } )

var app = bb.Router.extend
( { initialize: function(opts) {
      this.view = new views.nexus
        ( { el: $('#wrapper')[0] } )
      this.view.render()
    }
  , routes: {}
  } )
/**/

