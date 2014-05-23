var _ = require('lodash')
var bean = require('bean')

module.exports = Wagon

var delegateEventSplitter = /^(\S+)\s*(.*)$/

var noop = function(){}

function Wagon(options){
  this.options = (options || {})
  this.cid = _.uniqueId('c')
  this.initialize.apply(this, arguments)
  this.delegateEvents()
}

Wagon.prototype.initialize = noop

Wagon.prototype.delegateEvents = function(masterSelector, events){
  if (!(masterSelector || (masterSelector = _.result(this, 'selector'))))
    return this
  if (!(events || (events = _.result(this, 'events'))))
    return this

  this.undelegateEvents()

  for (var key in events) {
    var method = events[key]
    if (!_.isFunction(method)) method = this[events[key]]
    if (!method) throw new Error('Event handler '+ key + ' not found.')

    var match = key.match(delegateEventSplitter)
    var eventName = match[1], selector = (match[2] || mainSelector)
    method = _.bind(method, this)
    eventName += '.' + this.cid

    // Delegate on document
    bean.on(document, eventName, selector, method)
  }
  return this
}

Wagon.prototype.undelegateEvents = function(){
  bean.off(document, 'click.' + this.cid)
}

Wagon.prototype.remove = function(){
  this.undelegateEvents()
}

Wagon.extend = function(){
  return extend.apply(this, arguments)
}

function extend(protoProps, staticProps){
  var parent = this;
  var child;

  // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your `extend` definition), or defaulted
  // by us to simply call the parent's constructor.
  if (protoProps && _.has(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = function(){ return parent.apply(this, arguments); };
  }

  // Add static properties to the constructor function, if supplied.
  _.extend(child, parent, staticProps);

  // Set the prototype chain to inherit from `parent`, without calling
  // `parent`'s constructor function.
  var Surrogate = function(){ this.constructor = child; };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate;

  // Add prototype properties (instance properties) to the subclass,
  // if supplied.
  if (protoProps) _.extend(child.prototype, protoProps);

  // Set a convenience property in case the parent's prototype is needed
  // later.
  child.__super__ = parent.prototype;

  return child;
}