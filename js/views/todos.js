var app = app || {};

app.TodoView = Backbone.View.extend({

  // todo items are li items
  tagName: 'li',

  template: _.template($('#item-template').html()),

  events: {
    'dblcick label': 'edit',
    'kepress .edit': 'updateOnEnter',
    'blur .edit': 'close'
  },

  // any model changes to the todo cause the view to re-render
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },

  // renders the template with the model attributes
  // sets $input to the .edit element
  render: function() {
    this.$el.html( this.template( this.model.attributes ) );
    this.$input = this.$('.edit');
    return this;
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
  }

});
