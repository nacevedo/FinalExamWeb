import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import { Posts } from "../api/posts";


import PostList from "./PostList";
import PostAdd from "./PostAdd";

import { Meteor } from 'meteor/meteor'

class Stuff extends Component {


	constructor(props) {
		super(props);
	}

	onVote(post, emoji) {


		if (Meteor.userId() === null) 
		{
			window.alert ("You are not registered! Please sign in."); 
			return; 
		}
		
		Meteor.call('posts.vote', post._id, emoji, (err, res) => {if (err) alert(err.error)}); 
		
		
		/**
		let postObj = Posts.findOne(post._id);

		if (!postObj) {
			console.err("Post not found!");
			return;
		}

		postObj.voteCount+=1;
		if (postObj.votes[emoji]===undefined) {
			postObj.votes[emoji]=0;
		}
		postObj.votes[emoji]+=1;

		Posts.update(postObj._id,
			postObj);
			**/
	}

	onAdd(title, text) {

		// User exists ?? 
	if (typeof text !== 'string' || typeof title !== 'string' )
    {
      window.alert ("Write only text please!"); 
      return; 
    }

		if (Meteor.userId() === null) 
		{
			window.alert ("You are not registered! Please sign in."); 
			return; 
		}

		Meteor.call('posts.insert', this.props.city, text, title, (err, res) => {if (err) alert(err.error)}); 


		/**
		if (!text) return;
		Posts.insert({
			city: this.props.city, 
			who: Meteor.user(), 
			text,
			title:title, 
			voteCount:0,
			votes:{
				"👍":0
			}
		});
		**/

	}

	searchPost(){
		
		this.props.filter(this.refs.text.value); 
	}



	render() {
		return (
			<div id="stuff" className="row">
				<h2 id="city-name">{this.props.city}</h2>
				<hr/>
				<div className="col-sm-3">
				<div className="box2">
			        <PostAdd key = {12}
			          onAdd={this.onAdd.bind(this)}
			          >
			        </PostAdd>
			    </div>
			    </div>
				<div className="col-sm-9">
				<h2 id="cf">Community&#39;s Favors</h2>
				<hr/>
				<div className="row" id="sea">
				<div className="col-sm-9">
				<textarea className="com-text-3" placeholder = "Looking for a favor? Feel free to search for it here! " ref = "text"/> 
				</div>
				<div className="col-sm-3">
				<button className="my-btn-8" onClick = {this.searchPost.bind(this)}> Search </button>
				</div>
				</div> 
				<div className="row">
				
				<PostList
					key = {45}
		          posts={this.props.posts}
		          onVote={this.onVote.bind(this)}
		          updatePostID={this.props.updatePostID.bind(this)} 
		          updatePostName={this.props.updatePostName.bind(this)}
		          >
        		</PostList>
      
        		</div>
        		</div>
        		
			</div>
			);
	}
}

Stuff.propTypes = {
  posts: PropTypes.array.isRequired
};


export default withTracker(
  (x) => {
  	
  	Meteor.subscribe("posts");
  	if (x.search === null || x.search === "")
  	{
    	return {
     		 posts: Posts.find({city : x.city}, {sort: {voteCount:-1}}).fetch()
    	};
	}
	else 
	{
		return {
			posts: Posts.find( { $and: [{city : x.city} , {title : x.search}] }, {sort: {voteCount:-1}}).fetch()
		}; 
	}
  }
)(Stuff);
