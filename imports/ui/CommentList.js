import React, { Component } from "react";
import PropTypes from "prop-types";

import Comment from "./Comment";

export default class CommentList extends Component {
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
        this.state.showItems >= this.props.comments.length ?
          this.state.showItems : this.state.showItems + 10
    })
  }

  renderPosts() {
    return this.props.comments.slice(0, this.state.showItems).map((p,i) =>
      <Comment
        onVote={this.props.onVote}
        key={i}
        comment={p}>
      </Comment>
    );
  }
  render() {
    return (
      <div className="CommentList">
        <h2 id="city-name">Comments</h2>
        <hr/>
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

CommentList.propTypes = {
  comments: PropTypes.array.isRequired,
  onVote: PropTypes.func.isRequired
};
