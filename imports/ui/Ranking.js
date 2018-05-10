import React, { Component } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3"; 


class Ranking extends Component {
  constructor(props) {
    super(props);

  }

  

  componentDidMount(){

  	const svg = d3.select(this.svg);
    this.width = +svg.attr("width");
    this.height = +svg.attr("height");

	this.format = d3.format(",d");

	this.color = d3.scaleOrdinal(d3.schemeCategory20c);

	this.pack = d3.pack()
	    .size([this.width, this.height])
	    .padding(1.5);


	this.update(this.props); 

	}

	componentWillUpdate(newProps){
		
		this.update(newProps);
		console.log("wilupdate"); 
	}

	update (props){


	console.log("Update", props); 
	console.log("State", this.svg); 

	if (!props.posts || props.posts.length === 0) return ; 

		  var root = d3.hierarchy({children: props.posts})
		      .sum(function(d) { return d.cal; }) 
		      .each(function(d) { 
		        if (name = d.data.name) {
		          var name, i = name.lastIndexOf(".");
		          d.name = name;
		          d.package = name.slice(0, i);
		          d.class = name.slice(i + 1);
		        }
		      });

		  var svg = d3.select(this.svg); 

		  var node = svg.selectAll(".node")
		    .data(this.pack(root).leaves())
		    .enter().append("g")
		      .attr("class", "node")
		      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

		  node.append("circle")
		      .attr("id", function(d) { return d.name; })
		      .attr("r", function(d) { return d.r; })
		      .style("fill", (d) => { return this.color(d.package); });

		  node.append("clipPath")
		      .attr("id", function(d) { return "clip-" + d.name; })
		    .append("use")
		      .attr("xlink:href", function(d) { return "#" + d.name; });

		  node.append("text")
		      .attr("clip-path", function(d) { return "url(#clip-" + d.name + ")"; })
		    .selectAll("tspan")
		    .data(function(d) { return d.class.split(/(?=[A-Z][^A-Z])/g); })
		    .enter().append("tspan")
		      .attr("x", 0)
		      .attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
		      .text(function(d) { return d; });

		  node.append("title")
		      .text((d) => { return d.name + "\n" + this.format(d.cal); });

  }

  render() {
	  	return (
	    <div> 
	    <svg width="960" 
	    	height="400" 
	    	ref = {(svg) => this.svg = svg}>
	    </svg>


	    </div> 
	   ); 
  	}
}

Ranking.propTypes = {
  posts: PropTypes.array.isRequired
};

export default(Ranking);