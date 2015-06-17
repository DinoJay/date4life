Meteor.startup(function() {
  console.log("startup");
  console.log(EasySearch.query);

  Meteor.publish("users", function(id) {
    return Meteor.users.find();
  });

  Meteor.publish("wall", function(id) {
    return Likes.find({
      "userId": id
    });
  });

  Meteor.publish("wallPosts", function(id) {
    return Walls.find({
      "userId": id
    });
  });

  Meteor.publish("likes", function(id) {
    return Likes.find({
      "userId": id
    });
  });

  Meteor.publish('msgRooms', function() {
    return MsgRooms.find({
      "$or": [{
        "userId": this.userId
      }, {
        "otherUserId": this.userId
      }]
    });
  });

});

// helper function to get the right message room
var findMsgRoom = function(otherUserId) {
  // TODO: simplify
  var msgRoom = MsgRooms.findOne({
    "user._id": this.userId,
    "otherUser._id": otherUserId
  });

  if (msgRoom) return msgRoom;
  else {
    msgRoom = MsgRooms.findOne({
      "user._id": otherUserId,
      "otherUser._id": Meteor.userId()
    });
    if (msgRoom) return msgRoom;
    else return null;
  }
};

Meteor.methods({
  // creates a msg room if there is no for a particular receiver
  'getUser': function(id) {
    var user = Meteor.users.findOne({
      "_id": id
    });

    return {
      user: user
    };
  },

  // post a message in a conversation
  'postMsg': function(otherUserId, msg) {
    var msgRoomId = Meteor.userId() + "|" + otherUserId;
    console.log("sender", Meteor.user());

    var updateSuccess = MsgRooms.update({
      "$or": [{
        "userId": Meteor.userId(),
        "otherUserId": otherUserId
      }, {
        "userId": otherUserId,
        "otherUserId": Meteor.userId()
      }, ],
    }, {
      $push: {
        messages: msg
      }
    });

    // if msg room could not be found
    if (updateSuccess === 0) {
      var emptyRoom = {
        "_id": msgRoomId,
        userId: Meteor.userId(),
        otherUserId: otherUserId,
        messages: [msg]
      };
      MsgRooms.insert(emptyRoom);
    }
  },

  'updateReadMsg': function(msgRoomId, msgId) {
    console.log("MSGID", msgId);
    var updateSuccess = MsgRooms.update({
      "messages._id": msgId
    }, {
      "$set": {
        "messages.$.read": true
      }
    });
    console.log("update success", updateSuccess);
  },

  'postOnWall': function(userId, post) {
    console.log("sender", Meteor.user());

    var updateSuccess = Walls.update({
      "userId": userId,
    }, {
      $push: {
        posts: post
      }
    });

    console.log("update Comments success", updateSuccess);
    // if msg room could not be found
    if (updateSuccess === 0) {
      var wall = {
        userId: Meteor.userId(),
        posts: [post]
      };

      Walls.insert(wall);
    }
  },

  'delOnWall': function(userId, postId) {
    console.log("postId", postId);
    console.log("userId", userId);

    var updateSuccess = Walls.update({
      "userId": userId,
    }, {
      $pull: {
        posts: {
          "_id": postId
        }
      }
    });
  },

  'updateUserStatus': function(userId, status) {
    console.log("userId", userId);

    Likes.update({
      userId: Meteor.userId(),
      "likedUsers._id": userId
    }, {
      "$set": {
        "likedUsers.$.updated": status
      }
    });
  },

  'postLike': function(liked, user) {
    console.log("liked", liked);
    console.log("user", user);
    var updateSuccess0;
    var updateSuccess1;

    // remove like
    if (liked) {
      updateSuccess0 = Likes.update({
        "userId": user._id,
      }, {
        $inc: {
          likes: -1,
        }
      });
      updateSuccess1 = Likes.update({
        "userId": Meteor.userId(),
      }, {
        $pull: {
          likedUsers: {
            "_id": user._id
          },
        }
      });
    } else {
      // add like
      user.updated = false;
      updateSuccess0 = Likes.update({
        "userId": user._id,
      }, {
        $inc: {
          likes: 1,
        }
      });
      updateSuccess1 = Likes.update({
        "userId": Meteor.userId(),
      }, {
        $push: {
          likedUsers: user,
        }
      });
    }
    console.log("postLike", updateSuccess0, updateSuccess1);
  },

  'postAttention': function(userId, att) {
    console.log("postAttention", userId, att);
    var updateSuccess = Meteor.users.update({
      "_id": userId
    }, {
      $push: {
        attentions: {
          att: att,
          sender: Meteor.user()
        }
      }
    });
    console.log("postAttention success", updateSuccess);

  }

});

Accounts.validateLoginAttempt(function(options) {
  console.log("User login attempt", options);
  return !options.user.banned;
});

Accounts.onCreateUser(function(options, user) {
  console.log("user", options);
  Walls.insert({
    userId: user._id,
    posts: []
  });

  Likes.insert({
    userId: user._id,
    likedUsers: [],
    likes: 0
  });

  user.banned = false;
  user.admin = false;
  user.attentions = [];

  user.profile = {};
  user.profile.name = options.profile.name.toLowerCase();
  user.profile.surname = options.profile.surname.toLowerCase();
  user.profile.username = options.profile.username.toLowerCase();
  // TODO: radio boxes
  user.profile.gender = options.profile.gender.toLowerCase();
  user.profile.updated = false;

  user.profile.age = null;
  user.profile.location = null;
  user.profile.bio = null;


  //var tmpUser = Meteor.users.find({"_id": user._id});
  //console.log("tmpUser", tmpUser.fetch());
  return user;

});
