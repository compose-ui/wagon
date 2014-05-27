var assert = require('chai').assert
var Wagon = require('wagon')
var domify = require('domify')
var bean = require('bean')

describe('wagon', function(){
  describe('.extend', function(){
    var SomeWagon, someInstance;
    var buttonClicked = triggeredWagon = aClicked = 0
    before(function(){
      SomeWagon = Wagon.extend({
        events: {
          'click button': 'clickButton',
          one: {
            'click .one-event': 'clickA'
          }
        },
        initialize: function(){
          this.el = domify('<div class="wagon"><span class="one-event">one</span><button>button</button></div>')
          this.hotStuff = 'Wagon'
        },
        clickButton: function(event){
          event.preventDefault()
          buttonClicked++
        },
        clickA: function(event){
          console.log('clickA!')
          event.preventDefault()
          aClicked++
        }
      }, {
        docEvents: {
          'click [data-trigger="wagon"]': 'triggerWagon'
        },
        triggerWagon: function(event){
          event.preventDefault()
          triggeredWagon++
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
      })

      describe('normal', function(){
        before(function(){
          bean.fire(someInstance.el.querySelector('button'), 'click')
        })
        it('triggers the event', function(){
          assert.equal(buttonClicked, 1)
        })
      })

      describe('one event', function(){
        /*var aLink = null
        before(function(){
          aLink = someInstance.el.querySelector('.one-event')
          console.log(aLink)
          bean.fire(aLink, 'click')
        })
        it('it fired the event once', function(){
          assert.equal(aClicked, 1)
        })
        describe('second trigger', function(){
          before(function(){
            bean.fire(aLink, 'click')
          })
          it('does not call the function', function(){
            assert.equal(aClicked, 1)
            assert.equal(location.hash, '#ugh')
          })
        })
      */
      })
    })

    describe('document events binding', function(){
      before(function(){
        var html = domify('<a href="#" data-trigger="wagon">Wagon</a>')
        document.body.appendChild(html)
        bean.fire(html, 'click')
      })

      it('triggers the document event', function(){
        assert.equal(triggeredWagon, 1)
      })
    })
  })
})