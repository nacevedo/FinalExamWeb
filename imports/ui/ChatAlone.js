import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import {Route, NavLink, HashRouter} from "react-router-dom";

import { ChatMessages } from "../api/chatMessages";
import { Chats } from "../api/chats";
import ChatMessageAdd from './ChatMessageAdd'; 
import ChatMessage from './ChatMessage';



class ChatAlone extends Component {
  constructor(props) {
    super(props);

  }

  

  toggleModal() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  onAdd(text, user){

    if (typeof text !== 'string')
    {
      window.alert ("Write only text please!"); 
      return; 
    }
    

     if (Meteor.userId() === null) 
    {
      window.alert ("You are not registered! Please sign in."); 
      return; 
    }

    Meteor.call('chatMessages.insert', text, this.props.chatID, this.actualUN()); 
     
     /**
    ChatMessages.insert({
      text:text, 
      chatId: this.props.chatID, 
      user: Meteor.user().username
    });
    **/
  }

  renderPosts() {
    return this.props.chatMessages.map((p,i) =>
      <div key = {i}>
      
      <ChatMessage chatMessage = {p}  > </ChatMessage>
      </div>
      
    );
  }

  actualUN() {

    if(Meteor.user().profile == undefined)
      {
        return Meteor.user().username;
      }
      else
      {
        return Meteor.user().profile.name;
      }
  }

  componentDidUpdate() {
     var objDiv = document.getElementById("chat-content");
     objDiv.scrollTop = objDiv.scrollHeight;
  }
  

  render() {

    return (
      <div id="ChatAlone">
 

        <h2> Chat members: {this.props.u1} & {this.props.u2} </h2>
        <hr/>
  
        <div id="chat-content">
        {this.renderPosts()}
        </div>
        <ChatMessageAdd onAdd = {this.onAdd.bind(this)}> </ChatMessageAdd> 
     
      </div>
      );
  }
}

ChatAlone.propTypes = {
  
};

export default withTracker(
  (props) => {
    Meteor.subscribe("chatMessages");
    Meteor.subscribe("chats");
    return {
      chatMessages: ChatMessages.find({chatId : props.chatID}).fetch()
    };
  }
)(ChatAlone);
