Template.userProfile.created = function() {
  console.log("userProfile created", this);

  var user = this.data.user;

  Meteor.subscribe("likes", user._id, {
    onReady: function() {
      var myLikes = Likes.findOne({
        "userId": user._id
      });

      var liked = myLikes.likedUsers.some(function(user) {
        if (user._id === user._id)
          return true;
      });
      //TODO
      Session.set("likeNumber", myLikes.likes);
      Session.set("liked", liked);
    }
  });

};

Template.userProfile.helpers({
  sameUser: function() {
    return this.user.profile.username === Meteor.user().username;
  },

  likeNumber: function() {
    return Session.get("likes");
  },

  likes: function() {
    return Session.get("likes");
  }
});

Template.userProfile.events({
  'click #sendMsg': function(e, temp) {
    Modal.show('pmModal', {
      data: {
        receiver: this.user
      }
    });
  },

  'click #likeBtn': function(e, temp) {
    Meteor.call('postLike', this.user, function(err) {
      console.log(err);
    });
    console.log("clicked like", this);
  },

  'click #att_icon': function(e, temp) {
    Modal.show('sendAttModal', this.user);
  }

});


Template.pmModal.created = function() {
  console.log("pmModal created", this);
};

Template.pmModal.events({
  'click #submit_msg': function(_, modalTemp) {

    var msg = {
      _id: new Meteor.Collection.ObjectID(),
      body: modalTemp.find('#msg_area').value,
      sender: {
        _id: Meteor.userId(),
        username: Meteor.user().username,
        email: Meteor.user().emails[0].address
      },
      receiver: {
        _id: this.data.receiver._id,
        username: this.data.receiver.username,
        email: this.data.receiver.emails[0].address
      },
      date: moment().format('MM/DD/YYYY, HH:MM'),
      read: false
    };

    Meteor.call('postMsg', this.data.receiver._id, msg,
      function(err, msgRoom) {
        console.log("err", err);
      });
  }
});

Template.sendAttModal.created = function() {
  console.log("sendAttModal created", this);
};

Template.sendAttModal.helpers({
  gravatarLink: function() {
    console.log("send ATT Modal", this);
    return gravatarPicBig(this.emails[0].address);
  },
});

Template.attImages.created = function() {
  console.log("attImages created", this);
};

Template.attImages.events({
  'click .thumbnail': function(e, temp) {
    console.log("click thumbnail", this);
    var targetId = e.currentTarget.id;

    Meteor.call("postAttention", this.receiver._id, targetId,
      function(err) {
        console.log("err", err);
      }
    );
    if (this.loc === "dashboard") {
      var updateSuccess = Meteor.users.update({
        "_id": Meteor.userId()
      }, {
        "$pop": {
          "attentions": -1
        }
      });
      console.log("Pop success", updateSuccess);
    }

    console.log("targetID", targetId);
    $("#" + targetId).addClass('animated bounceOutUp');
    $("#" + targetId).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd' +
      'oanimationend animationend',
      function() {
        Modal.hide();
      });
    console.log();
  }
});
