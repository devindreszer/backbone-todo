var app = app || {};

var TodoList = Backbone.Collection.extend({

  // Link collection to the Todo model
  model: app.Todo,

  // Save all the todos in HTML Local Storage with the backbone-todos namespace
  localStorage: new Backbone.LocalStorage('backbone-todos'),

  // Filter only completed todos
  completed: function(){
    // Underscore filter method: http://underscorejs.org/#filter
    return this.filter(function(todo){
      // Backbone get method: http: //backbonejs.org/#Model-get
      // gets the current value of the attribute for a model instance
      return todo.get('completed');
    });
  },

  // Filter only the remaining items
  remaining: function(){
    // Underscore without: http://underscorejs.org/#without
    // JS apply method: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply
    // allows you to call a method with a given this value and arguments provided as an array
    return this.without.apply(this, this.completed());
  },

  // Keep track of the order of todos, since DB does not track order
  nextOrder: function(){
    if(!this.length) {
      return 1;
    } else {
      // Underscore last method: http://underscorejs.org/#last
      return this.last().get('order') + 1;
    }
  },

  // Todos are ordered by the original insertion order
  comparator: function(todo){
    return todo.get('order');
  }

});

// Create an app level todo list
app.Todos = new TodoList();
