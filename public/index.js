exports.nexus = nexus

var hookio = require('hook.io')
  , _ = require('underscore')
  , bb = require('backbone')
  , models = {}
  , collections = {}
  , views = {}
  
var hookCollection = bb.Collection.extend
( { initialize: function() {}
  , render: function() {return this} 
  } )

models.app = bb.Model.extend()
collections.app = hookCollection.extend()
views.app = bb.View.extend()

var nexus = bb.View.extend
( { initialize: function() {}
  , render: function() {return this} 
  } )

var router = bb.Router.extend()

new router()
