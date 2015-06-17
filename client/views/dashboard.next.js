Template.dashboard.created = function() {
  //this.msgRooms = new ReactiveVar(this.data.msgRooms);
  console.log("dashboard created", this);
  $(function() {
    $('[data-toggle="tooltip"]').tooltip();
  });

};

Template.dashboard.helpers({
  user: function() {
    var user = Meteor.user();
    return user;
  },
  // TODO: check
  optionsHelper: function() {
    return {
      substitute: '<span class="glyphicon glyphicon-pencil"></span>',
    };
  },

  attPic: function() {
    if (typeof(Meteor.user().attentions) === 'undefined')
      return;
    var atts = Meteor.user().attentions;
    if (atts.length > 0) {
      var attPic = getAttPic(atts[atts.length - 1].att);
      console.log("attPic", attPic);
      return attPic;
    } else return null;
  }

});

Template.dashboard.events({
  'click #attention': function(e, temp) {
    var atts = Meteor.user().attentions;
    Modal.show('retAttModal', atts[atts.length - 1]);
  }
});


Template.retAttModal.created = function() {
  //this.msgRooms = new ReactiveVar(this.data.msgRooms);
  console.log("retAttModal created", this);
};

Template.retAttModal.rendered = function() {
  //this.msgRooms = new ReactiveVar(this.data.msgRooms);
  console.log("retAttModal rendered", this);

  $('#retAttModal').on('hidden.bs.modal', function() {
    console.log("hidden");
    var updateSuccess = Meteor.users.update({
      "_id": Meteor.userId()
    }, {
      "$pop": {
        "attentions": -1
      }
    });
    console.log("Pop success", updateSuccess);
  });
};

Template.retAttModal.helpers({
  gravatarLink: function() {
    console.log("gravatarPic", this);
    return gravatarPicBig(this.sender.emails[0].address);
  },

  attPic: function() {
    return getAttPic(this.att);
  }
});

Template.msgBox.helpers({
  msgRooms: function() {
    return MsgRooms.find().fetch();
  },

  //outboxMsgRooms: function() {
  ////TODO: fix that
  //var loggedInUser = Meteor.user().username; var outbox = [];
  //var msgRooms = MsgRooms.find().fetch();

  //msgRooms.forEach(function(msgRoom) {
  //msgRoom.messages.every(function(msg) {
  //if (msg.sender._id === Meteor.userId()) {
  //outbox.push(msgRoom);
  //return false;
  //}
  //});
  //});
  //return outbox;
  //}

});


Template.pmPreview.created = function() {
  console.log("pmPreview created", this.data);

  // reactive vars
  this.messages = new ReactiveArray(this.data.messages);
};

Template.pmPreview.events({
  'click .pm-preview': function(e, template) {
    var that = this;
    console.log("click pmPreview template", template);
    var lastMsg = template.messages.get()[template.messages.get().length - 1];

    Meteor.call('updateReadMsg', this._id, lastMsg._id, function(err) {
      console.log("err", err);
    });

    Modal.show('convModal', {
      // reactive?
      messages: template.messages,
    });
  }
});

Template.pmPreview.helpers({
  // expose reactive var to template
  unread: function(_, template) {
    var messages = Template.instance().messages.get();
    return !messages[messages.length - 1].read;
  },
  lastMsg: function() {
    var messages = Template.instance().messages.get();
    return messages[messages.length - 1];
  },
  showMsgCounter: function() {
    var messages = Template.instance().messages.get();
    return messages.length > 1;
  },
  lenMessages: function() {
    var messages = Template.instance().messages.get();
    return messages.length;
  }
});


Template.convModal.created = function() {
  // a little bit ugly
  console.log("convModal created", this);

  // reactive messages
  this.messages = this.data.messages;
  this.lastMsg = this.data.lastMsg;

  this.receiver = this.messages.get().find(function(msg) {
    if (msg.receiver._id === Meteor.userId())
      return msg.sender;
    else return msg.receiver;
  }).receiver;

  console.log("Receiver.id", this.receiver._id);
};

Template.convModal.helpers({
  'messages': function() {
    //return template.messages.get();;
    return Template.instance().messages.get();
  }
});

Template.convModal.events({
  'click #submit_msg': function(e, template) {
    console.log("click convModal submit", this);
    var msgBody = template.find('#msg_area').value;

    var msg = {
      _id: new Meteor.Collection.ObjectID(),
      body: msgBody,
      sender: {
        "_id": Meteor.userId(),
        username: Meteor.user().username,
        email: Meteor.user().emails[0].address
      },
      receiver: template.receiver,
      date: moment().format('MM/DD/YYYY, HH:MM'),
      read: true
    };

    // reactive push
    this.messages.push(msg);

    Meteor.call('postMsg', template.receiver._id, msg,
      function(err) {
        console.log("err", err);
      });
  }
});

var likedUsers = new ReactiveArray([]);

Template.likedList.created = function() {
  console.log("likedList created", this);

  Meteor.subscribe("likes", Meteor.userId(), {
    onReady: function() {
      var likes = Likes.findOne({
        "userId": Meteor.userId()
      });
      likedUsers.set(likes.likedUsers);
      console.log("likedUsers", likedUsers.get());
    }
  });
};

Template.likedList.helpers({
  'likedUsers': function() {
    return likedUsers.get();
  }
});
