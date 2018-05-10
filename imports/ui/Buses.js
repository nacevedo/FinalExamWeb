import React, { Component } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3"; 


class Buses extends Component {
  constructor(props) {
    super(props);

 	this.state = {
			data: []
		}; 

  }

  deg2rad(deg){
  	return deg * (Math.PI/180);
  }

  getDistance(lat1,lon1,lat2,lon2) {


    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;

  }


  find(){

    fetch("http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni&t=0")
    .then((res)=>res.json())
    .then((data)=> {
    console.log("fetch"); 

      if(data.error){
        window.alert("Error");
      }

      this.setState({
			data: data
		});

    } )
    .catch(error  => {
      console.log('There has been a problem with your fetch operation: '+ error.message);
    });

      

  }

  

  componentDidMount(){

  	this.find(); 
  	console.log("Llego"); 

  	const svg = d3.select(this.svg);
    this.width = +svg.attr("width");
    this.height = +svg.attr("height");




	this.update(this.props); 

	}

	componentWillUpdate(newProps, nextState){
		
		this.update(nextState.data);
		console.log("willUpdate"); 
	}

	update (data){


	console.log("Update", data); 
	console.log("State", this.svg); 

	if (data.vehicle == undefined) return ; 

	const nestedBuses = d3.nest().key((d) => d.routeTag).entries(data.vehicle); 
 
	console.log(nestedBuses); 

	for (let route of nestedBuses ) {
      route.total = 0;
      route.values[0].distance = 0;
      for (let i = 1 ; i < route.values.length; i++) {
        route.values[i].distance = this.getDistance(+route.values[i-1].lat, +route.values[i-1].lon,
          +route.values[i].lat, +route.values[i].lon);
        route.total += route.values[i].distance;
      }
  }

 const buses = nestedBuses.sort(function(a, b) { return b.total - a.total; });
 console.log("Buses", buses); 

  }

  render() {
	  	return (
	    <div> 
	    <p> Buses </p> 
	    <svg width="960" 
	    	height="400" 
	    	ref = {(svg) => this.svg = svg}>
	    </svg>


	    </div> 
	   ); 
  	}
}



export default(Buses);