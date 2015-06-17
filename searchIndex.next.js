// SEARCH
if (Meteor.isClient) {

  var isLiked = function(userId) {
    var myLikes = Likes.findOne({
      "userId": Meteor.userId()
    });
    console.log("myLikes", myLikes);

    if (typeof(myLikes) === 'undefined')
      return;

    var liked = myLikes.likedUsers.some(function(user) {
      if (user._id === userId)

        return true;
    });
    console.log("liked", liked);

    return liked;
  };

  Template.userPreview.created = function() {
    console.log("userPreview created", this);

    Meteor.subscribe("likes", Meteor.userId());
    $('[data-toggle="tooltip"]').tooltip();

  };

  Template.userPreview.rendered = function() {
    $('[data-toggle="tooltip"]').tooltip();
  };

  Template.userPreview.helpers({
    gravatarLink: function() {
      return gravatarPicSmall(this.emails[0].address);
    },
    liked: function() {
      var userId = this._id;
      return isLiked(userId);
    }
  });

  Template.userPreview.events({
    'click #like': function(e, temp) {
      console.log("click like", this);
      Meteor.call('postLike', isLiked(this._id), this, function(err) {
        console.log("err", err);
      });
      Notifications.info("the user has been liked!!");
      console.log("CLICK like");
    },

    'click .profile_link': function(e, temp) {
      console.log("click profileLink", this._id);
      Meteor.call('updateUserStatus', this._id, false, function(err) {
        console.log("err", err);
      });
      console.log("CLICK like");
    }
  });
}

// Search Index
EasySearch.createSearchIndex('userIndex', {
  field: 'profile.username',
  collection: Meteor.users,
  use: 'mongo-db',
  query: function(searchString, opts) {
    // Default query that is used for searching
    var query = EasySearch.getSearcher(this.use).defaultQuery(this, searchString);
    // Make the emails searchable
    query.$or.push({
      emails: {
        $elemMatch: {
          address: {
            '$regex': '.*' + searchString + '.*',
            '$options': 'i'
          }
        }
      }
    });
    query.$or.push({
      "profile.username": {
        '$regex': '.*' + searchString + '.*',
        '$options': 'i'
      }
    });
    query.$or.push({
      "profile.name": {
        '$regex': '.*' + searchString + '.*',
        '$options': 'i'
      }
    });
    return query;
  }
});
