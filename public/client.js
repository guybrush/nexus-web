var ee2 = new EventEmitter2({wildcard:true,delimiter:'::',maxListeners:20})
  , bb = Backbone
  , models = {}
  , collections = {}
  , views = {}

//------------------------------------------------------------------------------
//                                                models
//------------------------------------------------------------------------------
  
models.remote = bb.Model.extend
( { initialize: function() {
      var self = this
      this.apps = new collections.app
      this.procs = new collections.proc
      if (this.attributes.status == 'ready') {
        _.extend(this, this.attributes.remote)
        this.ls(function(err,apps){
          _.each(apps,function(x,i){
            x.id = i
            self.apps.add(x)
          })
        })
        this.ps(function(err,procs){
          _.each(procs,function(x,i){
            self.procs.add(x)
          })
        })
        this.subscribe('all',function(event, data){
          var split = event.split('::')
            , what = split[0]
            , id = split[1]
            , type = split[2]
          if (what == 'monitor' && (type == 'exit' || type == 'start')) {
            var model = self.procs.get(id)
            self.ps({id:id},function(err, data){
              if (!model) self.procs.add(data)
              else model.set(data)
            })  
          }
        })
      }
    }
  } )
  
models.app = bb.Model.extend()

models.proc = bb.Model.extend()

//------------------------------------------------------------------------------
//                                                collections
//------------------------------------------------------------------------------

collections.app = bb.Collection.extend({model:models.app})
collections.remote = bb.Collection.extend({model:models.remote})
collections.proc = bb.Collection.extend({model:models.proc})

//------------------------------------------------------------------------------
//                                                views
//------------------------------------------------------------------------------

views.app = bb.View.extend
( { initialize: function() {
      var self = this
      this.model.bind('change', function(){self.render()})
    } 
  , render: function() {
      $(this.el).html(template('app', this.model.attributes))
      return this
    }
  } )

views.proc = bb.View.extend
( { initialize: function() {
      var self = this
      this.model.bind('change', function(){self.render()})
    } 
  , render: function() {
      $(this.el).html(template('proc', this.model.attributes))
      return this
    }
  } )

views.remote = bb.View.extend
( { initialize: function() {
      this.model.apps.bind('add', this.renderApp)
      this.model.procs.bind('add', this.renderProc)
    } 
  , render: function() {
      $(this.el).html(template('remote', this.model.attributes))
      return this
    }
  , renderApp: function(model, collection) {
      var view = new views.app({model:model})
      $('#apps').append(view.render().el)
    }
  , renderProc: function(model, collection) {
      var view = new views.proc({model:model})
      $('#procs').append(view.render().el)
    }
  } )

views.nexusWeb = bb.View.extend
( { initialize: function(){
      console.log('nexusWeb',this)
      this.remotes = new collections.remote
      // this.remotes.bind('all',function(){console.log(arguments)})
      this.remotes.bind('add',this.renderRemote)
      this.connect()
    }
  , renderRemote: function(model){
      var view = new views.remote({model:model})
      $('#remotes').append(view.render().el)
    }
  , connect: function(){
      var self = this
      var client = DNode
      ( { setRemote: function(rem) {
            if (!self.remotes.get(rem.id)) {
              self.remotes.add(rem)
            }
          }
        } )
        
      client.connect(function(remote, conn){
        // remote.reconnectRemote('someName',function(){})
        // remote.addRemote('someName',opts,function(){})
      })
    }
  } )

//------------------------------------------------------------------------------
//                                                router
//------------------------------------------------------------------------------

var router = bb.Router.extend
( { initialize: function() {
      this.view = new views.nexusWeb({el:$('#wrapper')[0]})
    }
  , routes: { '!/foo' : 'foo' }
  , foo: function() {
      // this.view.foo()
    } 
  } )

new router()
bb.history.start()

