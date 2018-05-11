import React, { Component } from "react";
import PropTypes from "prop-types";

export default class PostAdd extends Component {
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
      
      

      <h3 >Enter your comment </h3>
      <div>
        <p> Insert comment for route {this.props.route} </p> 
        </div>
        <div>
        <textarea className="com-text" role="textbox" type="text" placeholder="text" aria-label="Please wirte a comment here" ref="text"/>
        </div>
        <button className="button"

          onClick={
            () => 
            {
              this.props.onAdd( this.refs.text.value);
              this.clearContents(this);
            }
          }
        >Send Comment
        </button>
      </div>
    );
  }
}

PostAdd.propTypes = {
  onAdd:PropTypes.func.isRequired
};
