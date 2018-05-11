import React, { Component } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3"; 
import *  as d3Chromatic from "d3-scale-chromatic";



class Buses extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: []
		}; 

		this.find = this.find.bind(this); 
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

	Meteor.setInterval(() => {

		fetch("http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni&t=0")
		.then((res)=>res.json())
		.then((data)=> {
			

			this.g.selectAll("rect").remove();
			this.g.select(".legend").remove();  

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

	} , 20000); 
	
}



componentDidMount(){

	this.find(); 

	const svg = d3.select(this.svg);
	this.width = +svg.attr("width");
	this.height = +svg.attr("height");

	this.margin = {top: 20, right: 50, bottom: 30, left: 40},    
	this.g = svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

	this.x = d3.scaleBand()
	.rangeRound([0, this.width - this.margin.left - this.margin.right])
	.paddingInner(0.05)
	.align(0.1);

	this.y = d3.scaleLinear()
	.rangeRound([this.height - this.margin.top - this.margin.bottom, 0]);

	this.z = d3.scaleSequential(d3Chromatic.interpolateBlues);

	this.g.append("g")
	.attr("class", "axis--x")
	.attr("transform", "translate(0," + (this.height- this.margin.top - this.margin.bottom) + ")")
	.call(d3.axisBottom(this.x));

	this.g.append("g")
	.attr("class", "axis--y")
	.call(d3.axisLeft(this.y).ticks(null, "s"))
	.append("text")
	.attr("x", 2)
	.attr("y", this.y(this.y.ticks().pop()) + 0.5)
	.attr("dy", "0.32em")
	.attr("fill", "#000")
	.attr("font-weight", "bold")
	.attr("text-anchor", "start")
	.text("Added distance");


	this.update(this.state.data); 

}

componentWillUpdate(newProps, nextState){

	this.update(nextState.data);
	console.log("willUpdate"); 
}

update (data){

	

	if (!data.vehicle || data.vehicle.length === 0) return ; 


	//Eliminate data in filter

	for (var i = 0; i < data.vehicle.length ; i++){
		for (var j = 0; j < this.props.f.length; j++)
		{
			 
			if (data.vehicle[i] == undefined){
			}
			else if(data.vehicle[i].routeTag == this.props.f[j])
			{
				data.vehicle.splice(i, 1);
				
			}
		}
	}


	 
	const nestedBuses = d3.nest().key((d) => d.routeTag).entries(data.vehicle); 

	
	var maxNumBuses = 0; 

	for (let route of nestedBuses ) {
		route.total = 0;
		route.values[0].distance = 0;
		if (route.values.length >= maxNumBuses)
		{
			maxNumBuses = route.values.length; 
		}
		for (let i = 1 ; i < route.values.length; i++) {
			route.values[i].distance = this.getDistance(+route.values[i-1].lat, +route.values[i-1].lon,
				+route.values[i].lat, +route.values[i].lon);
			route.total += route.values[i].distance;
		}
	}

	const buses = nestedBuses.sort(function(a, b) { return b.total - a.total; });


	
	keys = d3.range(maxNumBuses); 

	const stackedBuses = d3.stack()
	.keys(keys)
	.value((d, key) => {
		return key < d.values.length ? d.values[key].distance : 0;
	})(nestedBuses)




	this.x.domain(nestedBuses.map(function(d) { return d.key; }));
	this.y.domain([0, d3.max(nestedBuses, function(d) { return d.total; })]).nice();
	this.z.domain([0, maxNumBuses]);

	//update

	// var rect = this.g.select(".rectangulo")
	// .attr("x",(d) =>  { return this.x(d.data.key); })
	// .attr("y", (d) =>  { return this.y(d[1]); })
	// .attr("height", (d) => { return this.y(d[0]) - this.y(d[1]); })
	// .attr("width", this.x.bandwidth());

	//enter
	this.g.append("g")
	.selectAll("g")
	.data(stackedBuses)
	.enter().append("g")
	.attr("fill", (d) =>  { return this.z(d.key); })
	.attr("stroke", "white")
	.selectAll("rect")
	.data(function(d) { return d; })
	.enter().append("rect")
	.attr("class", "rectangulo")
	.attr("x",(d) =>  { return this.x(d.data.key); })
	.attr("y", (d) =>  { return this.y(d[1]); })
	.attr("height", (d) => { return this.y(d[0]) - this.y(d[1]); })
	.attr("width", this.x.bandwidth());

	// //exit
	// rect.exit().remove(); 
	
	this.g.select(".axis--x")	
		.transition().duration(1000)
		.call(d3.axisBottom(this.x));

	this.g.select(".axis--y")
		.transition().duration(1000)
		.call(d3.axisLeft(this.y).ticks(null, "s"));


	var legend = this.g.append("g")
	.attr("class", "legend")
	.attr("font-family", "sans-serif")
	.attr("font-size", 10)
	.attr("text-anchor", "end")
	.selectAll("g")
	.data(keys.slice().reverse())
	.enter().append("g")
	.attr("transform", function(d, i) { return "translate(-50," + i * 20 + ")"; });

	legend.append("rect")
	.attr("x", this.width - 19)
	.attr("width", 19)
	.attr("height", 19)
	.attr("fill", this.z);

	legend.append("text")
	.attr("x", this.width - 24)
	.attr("y", 9.5)
	.attr("dy", "0.32em")
	.text(function(d) { return d; });


}

render() {
	return (
		<div id="grafica"> 
		<svg width="1000" 
		height="450" 
		ref = {(svg) => this.svg = svg}>
		</svg>


		</div> 
		); 
}
}



export default(Buses);