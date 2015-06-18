// Routing
// ---------------------------------------------------------------------------
Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function() {
  this.render('home');
});

Router.route('/admin', function() {
  this.render('adminDashboard');
});

Router.route('/user/:_id', function() {
  //console.log("user", this.params._id);
  var sub = Meteor.subscribe("wall", this.params._id);
  var that = this;
  Meteor.call('getUser', this.params._id, function(err, user) {
    console.log("getUser", user);
    console.log(user, "Error", err);
    that.render('userProfile', {
      data: user
    });
  });
});

Router.route('/search', function() {
  this.render('userSearch');
});

Router.route('/dashboard', function() {
    this.render('dashboard');
});

Router.route('/register', function() {
    this.render('register');
});

// Router.onBeforeAction(function () {
//     if (!Meteor.user() && !Meteor.loggingIn()) {
//         this.render('home');
//     } else {
//         // required by Iron to process the route handler
//         this.next();
//     }
// }, {
//     except: ['login']
// });

// Router.route('/(.*)', function () {
//     this.redirect('/catchallpage');
// });
