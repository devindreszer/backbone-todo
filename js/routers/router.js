var Workspace = Backbone.Router.extend({

  // Our router uses a *splat to set up a default route
  // which passes the string after ‘#/’ in the URL to setFilter()
  routes: {
    '*filter': 'setFilter'
  },

  setFilter: function(param) {
    if (param) {
      param = param.trim();
    }

    // set the current filter or none
    app.TodoFilter = param || '';

    // trigger a collection filter event, which triggers filterAll in the app view
    app.Todos.trigger('filter');
  }

});

// Finally, we create an instance of our router
// and call Backbone.history.start() to route the initial URL during page load
app.TodoRouter = new Workspace();
Backbone.history.start();
