ReactMeteor.createClass({
  templateName: "GuestGrid",

  startMeteorSubscriptions: function() {
    Meteor.subscribe("users");
  },

  getInitialState: function() {
    console.log("Meteor intervention");
    return {
      users: []
    };
  },

  componentDidMount: function() {
    var loc = React.findDOMNode(this.refs.locInput).value.toLowerCase();
    var gender = React.findDOMNode(this.refs.genderInput).value.toLowerCase();
    var ageRange = React.findDOMNode(this.refs.ageRangeInput).value.toLowerCase();

    this.setState({
      users: this.retrieveUsers(ageRange, gender, loc)
    });
  },

  renderUserPreview: function(user) {
    return <UserPreview key={user.username} user={user}/>;
  },

  retrieveUsers: function(ageRange, gender, loc) {
    console.log("this refs", this.refs);

    // let [ min, max ] = ageRange.split("-").map(function(d) {
    //   return parseInt(d);
    // });

    var split = ageRange.split("-").map(function(d) {
      return parseInt(d);
    });

    var min = split[0];
    var max = split[1];

    var users = Meteor.users.find({
      "profile.age": { $gt: min - 1, $lt: max + 1 },
      "profile.gender": gender,
      "profile.location": { $regex: ".*" + loc + ".*" }
    }).fetch();

    console.log("found Users", users);
    return users;
  },

  changeHandler: function() {
    var loc = React.findDOMNode(this.refs.locInput).value.toLowerCase();
    var gender = React.findDOMNode(this.refs.genderInput).value.toLowerCase();
    var ageRange = React.findDOMNode(this.refs.ageRangeInput).value.toLowerCase();
    this.setState({
      users: this.retrieveUsers(ageRange, gender, loc)
    });
  },

  render: function() {
    console.log("render AdminPanel", this.state);

    var cells = [
      this.state.users.map(this.renderUserPreview)
    ];

    return (
      <div className="container">
      <div className="page-header">
        <h1>Search User</h1>
        <p className="lead"> Explore our interesting user base </p>
      </div>
        <div className="row" style={{paddingBottom: "20px"}}>
            <form className="form-inline" role="form">
              <div className="col-md-2">
                <div className="form-group">
                  <label>Age:</label>
                  <select ref="ageRangeInput" className="form-control"
                    onChange={this.changeHandler}>
                    <option value="18-30">18-30</option>
                    <option value="30-40">30-40</option>
                    <option value="40-50">40-50</option>
                    <option value="50-60">50-60</option>
                  </select>
                </div>
              </div>
              <div className="col-md-2">
                <div className="form-group">
                  <label>Gender:</label>
                  <select ref="genderInput" className="form-control"
                    name="gender" onChange={this.changeHandler}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="col-md-2">
                <div className="form-group">
                  <label>Location:</label>
                  <input ref="locInput" className="form-control" type="text" id="location"
                    placeholder="Location" onChange={this.changeHandler}>
                  </input>
                </div>
              </div>
            </form>
        </div>
        <div>
            {cells}
        </div>
      </div>
    );
  }
});

var UserPreview = ReactMeteor.createClass({

  getDefaultProps: function() {
    return {
      user: null
    };
  },

  render: function() {
    /*eslint-disable */
    var gravatarPicSrc = gravatarPicSmall(this.props.user.emails[0].address);
    /*eslint-enable */

    return (
      <div className="custom-row-card">
        <div className="name">
          <strong className="text-primary">{this.props.user.username}</strong>
          <img src={gravatarPicSrc} className="img-circle"
            alt="the-brains"></img>
        </div>
        <div>{this.props.user.profile.gender}</div>
        <div>{this.props.user.profile.age} years</div>
        <div>{this.props.user.profile.location}</div>
      </div>
    );
  }

});
