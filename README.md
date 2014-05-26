# Wagon

Our own little Component Base class.

## Installation

- `component install compose-ui/wagon`
- `var Wagon = require('wagon')`

## Usage

### `Wagon.extend(prototypeProperties, staticProperties)`

Use it to extend your own Objects.

```javascript
var Widget = Wagon.extend({
  initialize: function(){
    // this.options has been set already.
  }
})
```

#### Static properties (Class properties)

This comes as the second argument to `extend()`. It's useful for things that don't live in each instance.

## Conventions

### `initialize(options)`

Define an initialization method called `initialize` when extending Wagon. This is very much similar to a Backbone.View. It's much like a JavaScript constructor, except we're able to call it when we really need to.

### `this.el`

Wagon needs an element to work with. Pretty much to delegate events on it.

**You need to instantiate a DOM element as `this.el` within your initialize method.**

### `events` Object

Much like Backbone.Views, we have and `events` object to simplify event delegation. All DOM events are supported. Plus:

- A `tap` event is automatically handled on `click`
- CSS animation events are automatically shimmed for cross-browser usage.

### `docEvents` Object

This is set on the static properties (class properties) of your Wagon inherited component. It's very useful for have triggers to instantiate your component.

```javascript
var Dialog = Wagon.extend({
  //...
}, {
  // these are static properties
  docEvents: {
    'click [data-trigger=dialog]': 'showDialog'
  },

  showDialog: function(event){
    event.preventDefault()
    new this(event.target.dataset) // Pass the element's dataset as options
      .show() // ... and then show it.
  }
})
```

In the above example, whenever an element with the attribute `data-trigger='dialog'` is clicked, it will instantiate a dialog.

## Contributing

- Code & test / test & code
- Refactor
- Pull request
- Win.