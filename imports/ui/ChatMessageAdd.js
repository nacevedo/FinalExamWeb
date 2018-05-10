import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ChatAdd extends Component {
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
      <div id="ChatMessageAdd">
      <textarea className="com-text-2" 
                type="text" 
                role="textbox" 
                placeholder="What message do you want to send?" 
                aria-label="What message do you want to send?" 
                ref="text"/>
      <button className="my-btn-2"

      onClick={
        () =>
        {
          this.props.onAdd(this.refs.text.value);
          this.clearContents(this);
        }
      }
      > Send message
      </button>
      </div>
      );
  }
}

ChatAdd.propTypes = {
  onAdd:PropTypes.func.isRequired
};