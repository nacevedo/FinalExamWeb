import React, { Component } from "react";
import { Meteor } from 'meteor/meteor';
import PropTypes from "prop-types";
import CommentList from './CommentList'; 
import CommentAdd from './CommentAdd'; 
import { Comments } from "../api/comments";
import { withTracker } from "meteor/react-meteor-data";
import {Route, NavLink, HashRouter} from "react-router-dom";


class Post extends Component {
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
      

        <div><span className="fa">&#xf007;</span>&nbsp;{this.userName()}</div>
        <hr/>
        <div id="pTitle"><span>{this.props.post.title}</span></div>
        <div >{this.props.post.text}</div>
        <div className="row">
       <div className="col-sm-6"> {this.renderVotes()} </div>
<div className="col-sm-6">

      <NavLink to="/post"><button className="my-btn-3" onClick={(event) => {this.props.updatePostID(this.props.post._id); this.props.updatePostName(this.props.post.title);} }
                                  >Comment</button></NavLink>
      </div>
</div>
     

      </div>
      );
  }
}




export default withTracker(
  (x) => {
    Meteor.subscribe("comments");
    return {
      comments: Comments.find({post : x.post._id}, {sort: {voteCount:-1}}).fetch()
    };
  }
  )(Post);
