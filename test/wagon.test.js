var assert = require('chai').assert
var Wagon = require('../')
var domify = require('domify')
var bean = require('bean')

describe('wagon', function(){
  describe('.extend', function(){
    var SomeWagon, someInstance;
    var buttonClicked = 0
    before(function(){
      SomeWagon = Wagon.extend({
        events: {
          'click button': 'clickButton'
        },
        initialize: function(){
          this.el = domify('<div class="wagon"><button></button></div>')
          this.hotStuff = 'Wagon'
        },
        clickButton: function(event){
          event.preventDefault()
          buttonClicked++
        }
      })
      someInstance = new SomeWagon({yo: 'dawg'})
    })

    describe('constructor / static methods', function(){
      it('can .extend', function(){
        assert(SomeWagon.extend)
      })
    })

    describe('instantiation', function(){
      it('is an instance of the parent', function(){
        assert.instanceOf(someInstance, SomeWagon)
      })
      it('called initialize', function(){
        assert(someInstance.hotStuff === 'Wagon')
      })
      it('applied the options', function(){
        assert.deepEqual(someInstance.options, {yo: 'dawg'})
      })
    })

    describe('events binding', function(){
      before(function(){
        document.body.appendChild(someInstance.el)
        bean.fire(someInstance.el.querySelector('button'), 'click')
      })

      it('triggers the events', function(){
        assert.equal(buttonClicked, 1)
      })
    })
  })
})