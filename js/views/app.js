var app = app || {};

app.AppView = Backbone.View.extend({

  // This binds to the extending skeleton of the app rather than generating a new app
  // el refers to the matching <section id="todoapp" /> element
  el: '#todoapp',

  // The template for the line of statistics at the bottom of the app
  // The call to _.template uses Underscore’s micro-templating
  // to construct a statsTemplate object from our #stats-template.
  statsTemplate: _.template($('#stats-template').html()),

  // Setting events for creating items, clearing items, and showing completed
  events: {
    'keypress #new-todo': 'createOnEnter',
    'click #clear-completed': 'clearCompleted',
    'click #toggle-all': 'toggleAllCompleted'
  },

  // At initilization, we bind the relevant events from the Todos collection
  // and load any pre-existing todos from localStorage
  initialize: function(){
    // uses jQuery to cache the elements it will be using into local properties
    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');

    // binding two events from the todos collection: add and reset
    // when add event is fired addOne is called
    this.listenTo(app.Todos, 'add', this.addOne);

    // when reset event is fired addAll is called
    this.listenTo(app.Todos, 'reset', this.addAll);

    // when completed is changed on a todo that item is filtered out
    this.listenTo(app.Todos, 'change:completed', this.filterOne);

    // when filter event is triggered, the filterAll method is triggered
    this.listenTo(app.Todos, 'filter', this.filterAll);

    // when any event is triggered, the statistics at the bottom of the page are refreshed
    this.listenTo(app.Todos, 'all', this.render);

    // fetchs any existing todos from Local Storage
    app.Todos.fetch();
  },

  // re-rendering the stats in the footer
  render: function() {
    // initializes variable with number of completed and remaing todos
    var completed = app.Todos.completed().length;
    var remaining = app.Todos.remaining().length;

    if (app.Todos.length) {
      // The #main and #footer sections are displayed or hidden
      // depending on whether there are any todos in the collection.
      this.$main.show();
      this.$footer.show();

      // The footer is populated with the HTML produced by instantiating
      // the statsTemplate with the number of completed and remaining todo items.
      this.$footer.html(this.statsTemplate({
        completed: completed,
        remaining: remaining
      }));

      // The HTML produced by the preceding step contains a list of filter links.
      // The value of app.TodoFilter, which will be set by our router, is being used
      // to apply the class ‘selected’ to the link corresponding to the currently
      // selected filter. This will result in conditional CSS styling being applied
      // to that filter.
      this.$('#filters li a')
        .removeClass('selected')
        .filter('[href="#/' + ( app.TodoFilter || '' ) + '"]')
        .addClass('selected');

    } else {
      this.$main.hide();
      this.$footer.hide();
    }

    // The allCheckbox is updated based on whether there are remaining todos.
    this.allCheckbox.checked = !remaining;
  },

  // Adds a single todo item to the list by creating a view,
  // and appending its el to the ul
  addOne: function(todo) {
    var view = new app.TodoView({model: todo});
    $('#todo-list').append(view.render().el);
  },

  addAll: function() {
    // Note that we were able to use this within addAll() to refer to the view
    // because listenTo() implicitly set the callback’s context to the view
    this.$('#todo-list').html('');
    app.Todos.each(this.addOne, this);
  },

  // The affected todo is passed to the callback which
  // triggers a custom visible event on the model.
  filterOne: function(todo) {
    todo.trigger('visible');
  },

  // Calls the filterOne method on each todo
  filterAll: function() {
    app.Todos.each(this.filterOne, this);
  },

  // generates the attributes for the new todo based on the user input
  newAttributes: function() {
    return {
      title: this.$input.val().trim(),
      order: app.Todos.nextOrder(),
      completed: false
    };
  },

  // when the user hits return a new todo is created
  createOnEnter: function(event) {
    // if the user does not click on the enter key, simply return
    if ( event.which !== ENTER_KEY || !this.$input.val().trim() ) {
      return;
    }

    // create a new todo with the newAttributes provided
    app.Todos.create(this.newAttributes());

    // empty the input value
    this.$input.val('');
  },

  // clear all of the completed todo items and destroy their models
  clearCompleted: function() {
    _.invoke(app.Todos.completed(), 'destroy');
    return false;
  },

  // toggles all todos between completed or remaining
  toggleAllCompleted: function() {
    var completed = this.allCheckbox.checked;

    app.Todos.each(function(todo) {
      todo.save({
        'completed': completed
      });
    });
  }

});
