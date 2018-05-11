import React, { Component } from "react";
import { Meteor } from 'meteor/meteor';
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";



export default class Post extends Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };

  }

  //This are the functions for comments 
  onVote(comment, emoji) {

    Meteor.call('comments.vote', comment, emoji); 

    
  }

  onAdd(text) {

    // User exists ?? 

    if (Meteor.userId() === null) 
    {
      window.alert("You are not registered ! Please sign in."); 
      return; 
    }

    Meteor.call('comments.insert', this.props.city, this.props.post_id, text);


  }

  toggleModal() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  renderVotes() {
    let res=[];
    for (let emoji in this.props.post.votes) {
      res.push(
        <button className="my-btn-4"
        onClick={() =>
          this.props.onVote(
            this.props.post,
            emoji
            )}
          key={emoji}>{emoji} {this.props.post.votes[emoji]}</button>
          );
    }
    return res;
  }

  onChangePost(){
    this.props.updatePostName(this.props.post.title);
  }

  onChangePostID(){
    
    this.props.updatePostID(this.props.post._id);
  }

  userName(){
    if(this.props.post.who.profile == undefined){
      return this.props.post.who.username;
    }
    else{
      return this.props.post.who.profile.name;
    }
  }

  render() {
    return (
      
      <div id="Post">
      <h4> User: {this.props.post.who.username} </h4>
      <p>{this.props.post.text}</p>
      </div>
      );
  }
}





