var ee2 = new EventEmitter2({wildcard:true,delimiter:'::',maxListeners:20})
  , bb = Backbone
  , models = {}
  , collections = {}
  , views = {}
  
models.remote = bb.Model.extend()
collections.remote = bb.Collection.extend({model:models.remote})
views.remote = bb.View.extend()

models.app = bb.Model.extend()
collections.app = bb.Collection.extend({model:models.app})
views.app = bb.View.extend()

models.proc = bb.Model.extend()
collections.proc = bb.Collection.extend({model:models.proc})
views.proc = bb.View.extend()
  
var client = DNode
( { setRemote: function(name, opts) {
      remotes[name] = opts
      if (opts.status == 'ready') {
        opts.remote.version(function(err,version){
          $('#debug').append('<li>'+name+' ► '+version+'</li>')
        })
        opts.remote.ls(function(err,data){
          var cont = $('<div>ls '+name+'</div>')
          _.each(data,function(x,i){cont.append('<li>'+x.name+'</li>')})
          $('#debug').append(cont)
        })
        opts.remote.ps(function(err,data){
          var cont = $('<div>ps '+name+'</div>')
          _.each(data,function(x,i){cont.append('<li>'+x.name+'</li>')})
          $('#debug').append(cont)
        })
      }
      else {
        $('#debug').append('<li>'+name+' ► '+opts.status+'</li>')
      }
    }
  } )
  
client.connect(function(remote, conn){
  // remote.reconnectRemote('someName',function(){})
  // remote.addRemote('someName',opts,function(){})
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

