import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import Post from "./Post";
import { Posts } from "../api/posts";

class PostList extends Component {
  constructor(props) {
    super(props);

    this.handleShowMore = this.handleShowMore.bind(this);

    this.state={
        showItems: 4
    };
  }

  handleShowMore() {
    this.setState({
      showItems: 
        this.state.showItems >= this.props.posts.length ?
          this.state.showItems : this.state.showItems + 10
    })
  }

  renderPosts() {
    return this.props.posts.slice(0, this.state.showItems).map((p,i) =>
      <div className="col-sm-6" key = {i}>
       <div className="box3">
          <Post
              post={p}
               >
          </Post>
      </div>
      </div>
    );
  }
  render() {
    return (
      <div className="PostList">
        
        {this.renderPosts()}
        <div className="row">
        <div className="col-sm-12">
        <button className="my-btn-6" onClick={this.handleShowMore}>
          Show more!
        </button>
        </div>
        </div>
      </div>
    );
  }
}

export default withTracker(
  (x) => {
    Meteor.subscribe("posts");
    return {
      posts: Posts.find({route : x.route}, {sort: {voteCount:-1}}).fetch(),
    };
  }
)(PostList);
