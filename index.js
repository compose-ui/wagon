var _ = require('lodash')
var bean = require('bean')
var tap = require('compose-tap-event')
var animevent = require('compose-animevent')
var extend = require('compose-extend')

module.exports = Wagon

var delegateEventSplitter = /^(\S+)\s*(.*)$/

var noop = function(){}

function Wagon(options){
  this.options = (options || {})
  this.el = (this.options.el || null)
  this.cid = _.uniqueId('c')
  this.initialize.apply(this, arguments)
  this.delegateEvents()
}

Wagon.prototype.initialize = noop
Wagon.prototype.delegateEvents = function(events){
  if (!(events || (events = _.result(this, 'events'))))
    return this

  this.undelegateEvents()
  return eventDelegator.call(this, this.el, events)
}

Wagon.prototype.undelegateEvents = function(){
  bean.off(this.el, '.' + this.cid)
  return this
}

Wagon.prototype.remove = function(){
  this.undelegateEvents()
  this.el.parentNode.removeChild(this.el)
  return this
}

Wagon.extend = function(){
  return extend.apply(this, arguments)
}

function eventDelegator(el, events, type){
  for (var key in events) {
    if (key === 'one') {
      eventDelegator.call(this, el, events[key], 'one')
      continue
    }
    var method = events[key]
    if (!_.isFunction(method))
      method = this[events[key]]
    if (!method)
      throw new Error('Event handler '+ key + ' not found.')

    var match = key.match(delegateEventSplitter)
    var eventName = match[1], selector = match[2]
    method = _.bind(method, this)

    // Support CSS animation events
    if (eventName.indexOf('animation') === 0) {
      cssEventName = animevent.types[eventName.replace('animation', '')]
      if (!cssEventName)
        throw new Error('Event ' + eventName + ' is not supported.')
      else
        eventName = cssEventName
    }

    if (this.cid)
      eventName += '.' + this.cid

    var bindType = type ? type : 'on'

    if (selector !== "") {
      bean[bindType](el, eventName, selector, method)
      // Handle tap
      if (eventName === 'click')
        bean[bindType](el, eventName, selector, tap(method))
    
    } else {
      bean[bindType](el, eventName, method)
      // Handle tap
      if (eventName === 'click')
        bean[bindType](el, eventName, tap(method))
    }
  }
  return this
}
