import React, { Component } from "react";
import PropTypes from "prop-types";

import Post from "./Post";

export default class PostList extends Component {
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
        this.state.showItems >= this.props.posts.length ?
          this.state.showItems : this.state.showItems + 10
    })
  }

  renderPosts() {
    return this.props.posts.slice(0, this.state.showItems).map((p,i) =>
      <div className="col-sm-4" key = {i}>
       <div className="box3">
          <Post
              
              onVote={this.props.onVote}
              post={p}
              updatePostID={this.props.updatePostID.bind(this)}
              updatePostName={this.props.updatePostName.bind(this)}
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

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  onVote: PropTypes.func.isRequired
};
