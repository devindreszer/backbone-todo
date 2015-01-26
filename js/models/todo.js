var app = app || {};

// Creates todo model within app
app.Todo = Backbone.Model.extend({

  // Todo is set with a default title and completion status
  defaults: {
    title: '',
    completed: false
  },

  // Toggles the completed state of the todo item
  toggle: function(){
    this.save({
      completed: !this.get('completed')
    });
  }

});
