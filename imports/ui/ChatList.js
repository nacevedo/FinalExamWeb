import React, { Component } from "react";
import PropTypes from "prop-types";

import Chat from "./Chat";
import { Chats } from "../api/chats";
import { withTracker } from "meteor/react-meteor-data";

class ChatList extends Component {
  constructor(props) {
    super(props);

    this.handleShowMore = this.handleShowMore.bind(this);

    this.state={
        showItems: 10
    };
  }

  handleShowMore() {
    this.setState({
      showItems: 
        this.state.showItems >= this.props.chats.length ?
          this.state.showItems : this.state.showItems + 10
    })
  }

  renderMsg(){
    if (Meteor.userId() === null) {
      return(
        <p>Don&#39;t forget you have to be signed in in order to see your current chats</p>
        )
    }
  }

  renderPosts() {
    return this.props.chats.slice(0, this.state.showItems).map((p,i) =>
      <div className="col-sm-3" key = {i} >
      <div className="box3">
      <Chat chat = {p} updateChatID={this.props.updateChatID.bind(this)} 
                                 updateUser1={this.props.updateUser1.bind(this)}
                                 updateUser2={this.props.updateUser2.bind(this)} > </Chat>
      </div>
      </div>
    );
  }
  render() {
    return (
      <div className="ChatList">
        
        {this.renderPosts()}
        <div className="row">
        <div className="col-sm-12">
        <button className="my-btn-6" onClick={this.handleShowMore}>
          Show more!
        </button>
        </div>
        </div>
        {this.renderMsg()}
      </div>
    );
  }
}

ChatList.propTypes = {

};

var userNames = () => {

  if(Meteor.user().profile == undefined)
    {
      return Meteor.user().username;
    }
    else
    {
      return Meteor.user().profile.name;
    }
}
    

export default withTracker(
  () => {

    var userName = userNames();
    Meteor.subscribe("chats");

    return {
      chats: Chats.find({$or: [ { "user1": userName}, { "user2": userName} ]}).fetch()
    };
  }
)(ChatList);
