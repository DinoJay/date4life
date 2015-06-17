var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var AdminPanel = ReactMeteor.createClass({
  templateName: "AdminPanel",

  startMeteorSubscriptions: function() {
    Meteor.subscribe("users");
  },

  getMeteorState: function() {
    var allUsers = Meteor.users.find().fetch();
    console.log("Meteor intervention");
    console.log("All users", allUsers);
    return {
      users: allUsers
    };
  },

  //getInitialState: function() {
  //var allUsers = Meteor.users.find().fetch();
  //return {
  //users: allUsers
  //};
  //},

  deleteUser: function(userId) {
    console.log("userId", userId);
    Meteor.users.remove({
      "_id": userId
    });
  },

  renderUserPreview: function(user) {
    return <UserPreview key={user.username} user={user}
            userDeleteHandler={this.deleteUser} />;
  },

  render: function() {
    console.log("render AdminPanel", this.state);

    var rows = [
      this.state.users.map(this.renderUserPreview)
    ];

    return (
      <div className="panel panel-default">
        <div className="panel-body">
          <h3>Admin Panel</h3>
          <hr className=""></hr>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Username</th>
                <th>Bann</th>
                <th>Delete</th>
              </tr>
            </thead>
            <ReactCSSTransitionGroup component="tbody" transitionName="example">
              {{rows}}
            </ReactCSSTransitionGroup>
          </table>
        </div>
    </div>
    );
  }
});

var UserPreview = ReactMeteor.createClass({

  getDefaultProps: function() {
    return {
      user: null,
      userDeleteHandler: null
    };
  },

  getInitialState: function() {
    return {
      banned: false
    };
  },

  getMeteorState: function() {
    var banned = Meteor.users.findOne({
      "_id": this.props.user._id
    }).banned;

    console.log("banned", banned);
    return {
      banned: banned
    };
  },

  deleteUserWrapper: function() {
    //console.log("deleteUserWrapper", this.props.user.username);
    this.props.userDeleteHandler(this.props.user._id);
  },

  banUser: function() {
    Meteor.users.update({
      "_id": this.props.user._id
    }, {
      "$set": {
        "banned": !this.state.banned
      }
    });
  },

  //componentWillUpdate: function(nextProps, nextState) {
  //console.log("componentWillUpdate", nextState);
  //},

  render: function() {
    /*eslint-disable */
    var gravatarPicSrc = gravatarPicSmall(this.props.user.emails[0].address);
    /*eslint-enable */
    var userLink = "/user/" + this.props.user._id;
    var banColor = this.state.banned ? "#a94442" : null;
    console.log("ban color", banColor);

    return (
      <tr>
          <td style={{verticalAlign: "middle"}}>
            <a className="profile_link" style={{fontWeight: "bold"}}
              href={userLink}>{this.props.user.username}</a>
          </td>
          <td className="verticalAlign" style={{verticalAlign: "middle"}}
            onClick={this.banUser}>
            <i id="remove" className="icon fa fa-ban"
              style={{color: banColor}}>
            </i>
          </td>
          <td style={{verticalAlign: "middle"}}
            onClick={this.deleteUserWrapper}>
            <i id="remove" className="icon fa fa-times"></i>
          </td>
          <td style={{verticalAlign: "middle"}}>
            <img src={gravatarPicSrc} className="img-circle" alt="the-brains"></img>
          </td>
      </tr>
    );
  }

});
