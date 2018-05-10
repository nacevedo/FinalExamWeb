import React, { Component } from "react";
import PropTypes from "prop-types";
import CommentList from './CommentList'; 
import CommentAdd from './CommentAdd'; 
import { Comments } from "../api/posts";
import { withTracker } from "meteor/react-meteor-data";
import {Route, NavLink, HashRouter} from "react-router-dom";


class ChatMessage extends Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };

  }

  //This are the functions for comments 
  onVote(comment, emoji) {
    let postObj = Comments.findOne(comment._id);

    if (!postObj) {
      console.err("Post not found!");
      return;
    }

    postObj.voteCount+=1;
    if (postObj.votes[emoji]===undefined) {
      postObj.votes[emoji]=0;
    }
    postObj.votes[emoji]+=1;

    Comments.update(postObj._id,
      postObj);
  }

  onAdd(text) {

    // User exists ?? 

    if (Meteor.userId() === null) 
    {
      window.alert("You are not registered ! Please sign in."); 
      return; 
    }


    if (!text) return;
    Comments.insert({
      city: this.props.city, 
      post: this.props.post._id,
      who: Meteor.user(), 
      text,
      voteCount:0,
      votes:{
        "👍":0
      }
    });

  }

  toggleModal() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  userName(){
    if(Meteor.user().profile == undefined){
      return Meteor.user().username;
    }
    else{
      return Meteor.user().profile.name;
    }
  }


  renderMessage(){

    if(this.userName() == this.props.chatMessage.user){
      return(
      <div className="my-message">
      
        <p>{this.props.chatMessage.user}: {this.props.chatMessage.text}</p>
      
      </div>)
    }
    else{
      
      return(
      <div className="other-message">
        <p>{this.props.chatMessage.user}: {this.props.chatMessage.text}</p>
      </div>)
    }
  }

  onChangePost(){
    this.props.updatePostName(this.props.post.title);
  }

  onChangePostID(){
    
    this.props.updatePostID(this.props.post._id);
  }

  render() {
    return (
      <div id="Chat">
      
        {this.renderMessage()}
      </div>
      );
  }
}

ChatMessage.propTypes = {

};


export default (ChatMessage);