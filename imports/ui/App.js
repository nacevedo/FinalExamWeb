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

    

    return this.state.routes.map((p,i) =>
        <div key = {i}>
        <div className="col-sm-2">
        <div className="row">
        <div className="col-sm-6">
          <p> {p.tag} </p>
          </div>
          <div className="col-sm-6">
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
          </div>
          </div>
        </div>
    
    );
  }

  onChangeCheck(p)
  {
    

    
  }

  render() {
    return(
      <div className = "App"> 
      <section id="one" className="wrapper">
      
        <div className="inner">
          <div className="flex flex-3">
          <h1> San Francisco Next-Bus Routes!</h1>
          <div id = "sign-in-place">
          <AccountsUIWrapper />
          </div>
          </div>
          </div>
         </section>
          
          <Buses f = {this.state.fGraph}/>
          
            <h3>Check the boxes with the routes you don&#39;t want to compare in the graph </h3>
            <div className="row">
          {this.renderCheck()}
          </div>
        
         
     

    
      <section id="two" className="wrapper style1 special">
        <div className="inner">
        <h2 > Please choose a route </h2>
        <div id="espacio">
        <select id = "selectRoute" onChange = {this.filter.bind(this)}>
            {this.renderRoutes()}
        </select>
        </div>
          <div className = "row">
          <div className ="col-sm-6"> <PostList route = {this.state.filter} /> </div>
          <div className = "col-sm-6"> <PostAdd route = {this.state.filter} onAdd = {this.onAdd.bind(this)}/> </div>
          </div>

          </div>
      </section>

        

      </div> 
      ); 
  
  
 }
}


export default withTracker(
  (x) => {
    Meteor.subscribe("posts");
    return {
      posts: Posts.find({}, {sort: {voteCount:-1}}).fetch(),
    };
  }
)(App);









