var reactWallPosts;

Template.wall.created = function() {
  console.log("wall created", this);
  console.log("currentUser", Meteor.user());
  var userId = this.data.user._id;

  reactWallPosts = new ReactiveArray([]);
  Session.set("userId", userId);

  Meteor.subscribe("wallPosts", userId, {
    onReady: function() {
      var wall = Walls.findOne({
        "userId": userId
      });
      reactWallPosts.set(wall.posts);
    }
  });
};

Template.wall.helpers({
  'wallPosts': function() {
    return reactWallPosts.get();
  }
});

Template.wall.events({
  'click #submit_comment': function(e, temp) {
    e.preventDefault();
    console.log("temp submit", temp);
    console.log("temp this", this);

    var post = {
      "_id": new Meteor.Collection.ObjectID(),
      body: temp.find('#comment_input').value,
      sender: {
        _id: Meteor.userId(),
        username: Meteor.user().username,
        email: Meteor.user().emails[0].address,
      },
      date: moment().format('MM/DD/YYYY, HH:MM')
    };

    // update view
    reactWallPosts.push(post);

    Meteor.call('postOnWall', this.user._id, post, function(err) {
      console.log("err", err);
    });
  }
});

Template.pmView.created = function() {
  //empty
  console.log("pmView created", this);
  this.data.alive = new ReactiveVar(true);
};

Template.pmView.helpers({
  'gravatarLink': function() {
    return gravatarPicSmall(this.sender.email);
  },
  'alive': function() {
    return this.alive.get();
  },
  'wallOwner': function() {
    return (Meteor.userId() === Session.get("userId"));
  }
});

Template.pmView.events({
  'click #del-post-btn': function(e, temp) {
    // if not wall owner escape
    if (Meteor.userId() !== Session.get("userId"))
      return;

    this.alive.set(false);
    Meteor.call('delOnWall', Session.get("userId"), this._id, function(err) {
      console.log("err", err);
    });
  }
});
