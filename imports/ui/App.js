import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTracker } from "meteor/react-meteor-data";
import "./style.css";
import "./fonts.css";

import { Posts } from "../api/posts";
import AccountsUIWrapper from './AccountsUIWrapper.js';


import Post from "./Post";

import PostAdd from "./PostAdd";
import Buses from "./Buses";
import PostList from "./PostList";




export class App extends Component {
  constructor(props) {
    super(props);

    this.state={
      routes: [], 
      filter: null,
      fGraph: []
    };
  }


  onChangeCity(newCity){
    
    this.setState({
      city: newCity
    });
  }

  onChangePost(newName){
    
    this.setState({
      postName: newName
    });
  }

  onChangePostID(id){
    
    this.setState({
      postID: id
    });

  }

  onChangeChatID(id){
    
    this.setState({
      chatID: id
    });

  }

  onChangeUser1(id){
    
    this.setState({
      user1: id
    });

  }

  onChangeUser2(id){
    this.setState({
      user2: id
    });

  }

  filter(text){
    this.setState({
      search: text
    }); 

  }

  onAdd(text) {


    if( text == "")
    {
      window.alert("Please write something in the comment"); 
      return ;
    }
    if( this.state.filter === null)
    {
      window.alert("Please select a route to comment"); 
      return ;
    }
    console.log( "insertando+ "+ text );
    Meteor.call('posts.insert', this.state.filter, text, (err, res) => {if (err) alert(err.error)}); 

  }

  componentDidMount(){

    fetch("http://webservices.nextbus.com/service/publicJSONFeed?command=routeList&a=sf-muni")
  .then((res)=>res.json())
  .then((data)=> {
    console.log("fetch"); 
    console.log("Dataaa", data); 

    if(data.error){
      window.alert("Error");
    }

    this.setState({
      routes: data.route
    });

  } )
  .catch(error  => {
    console.log('There has been a problem with your fetch operation: '+ error.message);
  });

  }

  renderRoutes(){
    if (!this.state.routes || this.state.routes.lenght === 0 ) return; 

    console.log(this.state.routes); 

    return this.state.routes.map((p,i) =>
      
       <option value= {p.tag} key = {i}> {p.title} </option>
    
    );
  }

  filter(){
    this.setState({
      filter : document.getElementById("selectRoute").value
    });
  }

  renderCheck(){
    if (!this.state.routes || this.state.routes.lenght === 0 ) return; 

    console.log(this.state.routes); 

    return this.state.routes.map((p,i) =>
        <div key = {i}>
          <p> {p.tag} </p>
          <input type = "checkbox" onChange = { () =>{
                                              console.log(p.tag); 
                                              var f = this.state.fGraph; 
                                              if (f.includes(p.tag)){
                                                const index = f.indexOf(p.tag);
                                                f.splice(index, 1);
                                              }
                                              else
                                              {
                                                f.push(p.tag); 
                                              }

                                              this.setState({
                                                fGraph : f
                                              }); 
                                                       } } />
        </div>
    
    );
  }

  onChangeCheck(p)
  {
    

    
  }

  render() {
    return(
      <div> 
        <div id="page" className="container">
          <h2> San Francisco Next-Bus Routes!</h2>
          <AccountsUIWrapper/>
          <Buses f = {this.state.fGraph}/>
          {this.renderCheck()}
          <h3> Please choose a route </h3>
          <select id = "selectRoute" onChange = {this.filter.bind(this)}>
            {this.renderRoutes()}
          </select>
          <div className = "row">
          <div className ="col-sm-8"> <PostList route = {this.state.filter} /> </div>
          <div className = "col-sm-4"> <PostAdd route = {this.state.filter} onAdd = {this.onAdd.bind(this)}/> </div>
          </div>
        </div>

       

      

      </div> 
      ); 
  
  
 }
}

App.propTypes = {
  posts: PropTypes.array.isRequired
};


export default withTracker(
  (x) => {
    Meteor.subscribe("posts");
    return {
      posts: Posts.find({}, {sort: {voteCount:-1}}).fetch(),
    };
  }
)(App);









