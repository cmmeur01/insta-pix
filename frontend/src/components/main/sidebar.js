import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { notFollowing, findCurrentUser } from './../../reducers/selectors';
import "./../../assets/stylesheets/sidebar.css";
import SidebarItem from './sidebar_item';

class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {users: []};
    this.getSuggestions = this.getSuggestions.bind(this);
  }


  componentDidMount() {
    let users = this.props.users;
    let stateUsers = [];
    while (stateUsers.length < 6) {
      let random = Math.floor(Math.random() * users.length);
      let user = users[random];
      if (!stateUsers.includes(user)) {
        stateUsers.push(user);
      }
    }
    this.setState({users: stateUsers});
  }

  getSuggestions() {
    if (this.state.users === [] ) return null;
    let users = this.state.users;
    const results = users.map((user, idx) => <SidebarItem user={user} key={idx} />);
    return results;
  }

  render() {
    return (
      <div className="side-feed-bar">
        <div className="profile-header">
          <div>
            <Link to={`/users/${this.props.currentUser.username}`}>
              <img className="sidebar-profile" src={this.props.currentUser.image_url} alt="profile pic" />
            </Link>
          </div>
          <div className="user-info">
            <div className="sidebar-username">
              <Link to={`/users/${this.props.currentUser.username}`}>
                {this.props.currentUser.username}
              </Link>
            </div>
            <div className="sidebar-name">{this.props.currentUser.name}</div>
          </div>
        </div>

        <div className="suggestions">
          <div className="suggestions-div">
            <div className="sug-text">
              <div>Suggestions for you</div>
            </div>
            <ul className="suggestions-list">{this.getSuggestions()}</ul>
          </div>
        </div>
      </div>
    );
  }
}

const mstp = state => {
  return {
    posts: state.entities.posts,
    users: notFollowing(state),
    currentUser: findCurrentUser(state)
  };
};

export default connect(
  mstp
)(SideBar);
