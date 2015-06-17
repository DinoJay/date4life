// TODO: clean up that file
Walls = new Meteor.Collection("walls");
MsgRooms = new Meteor.Collection("msgrooms");
Likes = new Meteor.Collection("likes");
Wiki = new Meteor.Collection("wiki");

Meteor.users.allow({
  'update': function(userId, doc) {
    /* user and doc checks ,
    return true to allow insert */
    return true;
  },
  'remove': function(userId, doc) {
    /* user and doc checks ,
    return true to allow insert */
    return true;
  }
});


EditableText.registerCallbacks({
  notifyUsers: function(user) {
    user.profile.update = true;
    Meteor.call('updateUserStatus', user._id, true, function(err) {
      console.log("err", err);
    });
  }
});

if (Meteor.isClient) {

  Meteor.subscribe("wallComments");
  Meteor.subscribe("msgRooms");
  Meteor.subscribe("users");
  Meteor.subscribe("wiki");


  Meteor.startup(function() {

    Template.registerHelper('debug', function() {
      console.log("debugger", this);
      return this;
    });

    Template.registerHelper('session', function(input) {
      return Session.get(input);
    });


    gravatarPicSmall = function(email) {
      var url = Gravatar.imageUrl(email, {
        size: 30,
        default: 'mm'
      });
      return url;
    };

    gravatarPicBig = function(email) {
      var url = Gravatar.imageUrl(email, {
        size: 140,
        default: 'mm'
      });
      return url;
    };

    getAttPic = function(att) {
      var pic;
      switch (att) {
        case "back":
          pic = "back.jpg";
          break;
        case "flowers":
          pic = "flowers.png";
          break;
        case "handshake":
          pic = "handshake.png";
          break;
        case "kiss":
          pic = "kiss.png";
          break;
        case "smiley":
          pic = "smiley.gif";
          break;
        case "thumbs":
          pic = "thumbs.jpg";
          break;
        case "wine":
          pic = "wine.png";
          break;
        default:
          return null;
      }
      return "/pics/" + pic;
    };


    _.extend(Notifications.defaultOptions, {
      timeout: 2000
    });

  });
  // TODO: change to design
  Accounts.ui.config({
    requestPermissions: {
      facebook: ['email'],
    },
    passwordSignupFields: 'EMAIL_ONLY',
    extraSignupFields: [{
      fieldName: 'name',
      fieldLabel: 'Name',
      validate: function(value, errorFn) {
        if (value === '') {
          errorFn('Name must have a value');
          return false;
        }
        return true;
      }
    }, {
      fieldName: 'surname',
      fieldLabel: 'Surname'
    }, {
      fieldName: 'username',
      fieldLabel: 'Username'
    }, {
      fieldName: 'gender',
      fieldLabel: 'Gender'
    }]
  });

}
//Template.login.events({

//'submit #login-form' : function(e, t){
//e.preventDefault();
//// retrieve the input field values
//var email = trimInput(t.find('#login-email').value);
//var password = t.find('#login-password').value;

//// Trim and validate your fields here....

//if (!isValidPassword(password)){
//Meteor.loginWithPassword(email, password, function(err){
//if (err) {
//console.log("Error login");
//Notifications.warn('title', 'message');
//}
//else {
//console.log("LoginSuccess");
//Notifications.warn('title', 'message');
//}
//});
//} else {
//console.log("Not valid password");
//}

//return false;
//}
//});

//Template.pmModal.helpers({
//modal: function() {
//console.log("pmModal", this);
//}
//});

//Template.register.events({
//'submit #register-form' : function(e, t) {
//e.preventDefault();
//var email = t.find('#account-email').value;
//var password = t.find('#account-password').value;

//// Trim and validate the input

//Accounts.createUser({email: email, password : password}, function(err){
//if (err) {
//// Inform the user that account creation failed
//} else {
//// Success. Account has been created and the user
//// has logged in successfully.
//}

//});

//return false;
//}
//});
