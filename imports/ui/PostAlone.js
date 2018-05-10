import React, { Component } from "react";
import PropTypes from "prop-types";
import CommentList from './CommentList'; 
import CommentAdd from './CommentAdd'; 
import { Comments } from "../api/comments";
import { withTracker } from "meteor/react-meteor-data";
import {Route, NavLink, HashRouter} from "react-router-dom";
import { Posts } from "../api/posts";
import { Meteor } from 'meteor/meteor';


class PostAlone extends Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false 
  }
}

  //This are the functions for comments 
  onVote(comment, emoji) {

    
    Meteor.call('comments.vote', comment, emoji, (err, res) => {if (err) alert(err.error)}); 
  }

  onAdd(text) {

    console.log(this.props.postID); 

    if (typeof text !== 'string')
    {
      window.alert ("Write only text please!"); 
      return; 
    }

    if (Meteor.userId() === null) 
    {
      window.alert("You are not registered ! Please sign in."); 
      return; 
    }
 

    Meteor.call('comments.insert', this.props.postID, text, (err, res) => {if (err) alert(err.error)});

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
        <div className="static-likes"
             key={emoji}> <span> {emoji} {this.props.post.votes[emoji]} </span> </div>
          );
    }
    return res;
  }

  onChangePost(){
    this.props.updatePostName(this.props.post.title);
  }

  render() {
    return (
      <div id="PostAlone">
        <div className="col-sm-4">
          <div className="box4">
            <div id="pa">
              <div><span className="fa">&#xf007;</span>&nbsp;{this.props.post.who.username}</div>
              <hr/>
              <div id="pTitle"><span>{this.props.post.title}</span></div>
              <div>{this.props.post.text}</div>
              {this.renderVotes()}
            </div>
          </div>
          <div className="box2">
            <CommentAdd onAdd={this.onAdd.bind(this)} > </CommentAdd>
          </div>
        </div>
        <div className="col-sm-8">
          <CommentList comments={this.props.comments} onVote={this.onVote.bind(this)}> </CommentList>
        </div>
      </div>
      );
  }
}

PostAlone.propTypes = {

};


export default withTracker(
  (x) => {
    Meteor.subscribe("comments");
    Meteor.subscribe("posts");
    Meteor.subscribe("chats");

    return {

      comments: Comments.find({post : x.postID}, {sort: {voteCount:-1}}).fetch(), 
      post: Posts.findOne(x.postID)
    };
  }
  )(PostAlone);
