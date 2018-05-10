import React, { Component } from "react";
import PropTypes from "prop-types";

export default class CommentAdd extends Component {
  constructor(props) {
    super(props);

    this.state={

    };

  }

      clearContents(element) {
    this.refs.text.value = ''; 
  }
  
  render() {
    return (
      <div className="PostAdd">
        <div >
        <h4>Give a piece of advice to this person in our community and make their day better</h4>
        <textarea
          className="com-text"
          type="text"
          placeholder="Help someone typing your comment"
          aria-label="Help someone typing your comment"
          role="textbox"
          ref="text"/>
          </div>
        <button className="my-btn-2"
          onClick={
            () =>
              {
              this.props.onAdd(this.refs.text.value);
              this.clearContents(this);
              }
          }
        >Add
        </button>
      </div>
    );
  }
}

CommentAdd.propTypes = {
  onAdd:PropTypes.func.isRequired
};
