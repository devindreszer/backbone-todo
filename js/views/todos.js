var app = app || {};

app.TodoView = Backbone.View.extend({

  // todo items are li items
  tagName: 'li',

  template: _.template($('#item-template').html()),

  events: {
    'dblcick label': 'edit',
    'kepress .edit': 'updateOnEnter',
    'blur .edit': 'close',
    'click .toggle': 'toggleCompleted',
    'click .destroy': 'clear'
  },

  // any model changes to the todo cause the view to re-render
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'visible', this.toggleVisible);
  },

  // renders the template with the model attributes
  // sets $input to the .edit element
  render: function() {
    this.$el.html( this.template( this.model.attributes ) );

    // sets models class and sets its visibility
    this.$el.toggleClass( 'completed', this.model.get('completed') );
    this.toggleVisible();

    this.$input = this.$('.edit');
    return this;
  },

  // toggles visibility of item
  toggleVisible: function() {
    this.$el.toggleClass('hidden', this.isHidden());
  },

  // determines if an item should be hidden
  isHidden: function() {
    var isCompleted = this.model.get('completed');
    return ( // hidden cases only
      (!isCompleted && app.TodoFilter === 'completed') || (isCompleted && app.TodoFilter === 'active')
    );
  },

  // call the todo models toggle completed
  toggleCompleted: function() {
    this.model.toggle();
  },

  // switch into editing mode
  edit: function() {
    this.$el.addClass('editing');
    this.$input.focus();
  },

  // close the editing mode and save changes to todo
  close: function() {
    var value = this.$input.val().trim();

    if ( value ) {
      this.model.save({ title: value });
    }

    this.$el.removeClass('editing');
  },

  // call close when user hits enter
  updateOnEnter: function( event ) {
    if ( event.which === ENTER_KEY ) {
      this.close();
    }
  },

  // Remove the item, destroy the model from *localStorage* and delete its view.
  clear: function() {
    this.model.destroy();
  }

});
