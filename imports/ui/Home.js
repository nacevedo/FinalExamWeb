import React, { Component } from "react";
import PropTypes from "prop-types";
import Autosuggest from 'react-autosuggest';
import {Route, NavLink, HashRouter} from "react-router-dom";



class Home extends Component {


	constructor() {
		super();

		this.state = {
			value: '',
			suggestions: [],
			lati: 0,
			longi: 0
		};    
	}

	onChange = (event, { newValue, method }) => {
		this.setState({
			value: newValue
		});
	};

	onSuggestionsFetchRequested = ({ value }) => {
		this.setState({
			suggestions: getSuggestions(value)
		});
	};

	onSuggestionsClearRequested = () => {
		this.setState({
			suggestions: []
		});
	};

	onChangeCity(){
		this.props.updateCity(this.state.value);
	}

	onChangeCity2(city){
		this.props.updateCity(this.state.city);
	}

	geoFindMe() {
	  var output = document.getElementById("out");


	  if (!navigator.geolocation){
	    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
	    return;
	  }

	  function success(position) {
	    var latitude  = position.coords.latitude;
	    var longitude = position.coords.longitude;

	    var which = null; 
	    var which1 = null; 
	    var which2 = null; 
	    var min = 999999999999; 

	    var topC = [];
	    var printCities = "";

	    var count = 0; 

	    var min1 = 999999999999;
	    var min2 = 999999999999;

	    for (i in cities)
	    {
	 
		    count++; 
		    var radlat1 = Math.PI * (latitude/180);
		
	        var radlat2 = Math.PI * (cities[i].lat/180);
	   
	        var radlon1 = Math.PI * (longitude/180);
	     
	        var radlon2 = Math.PI * (cities[i].lng/180);
	    
	        var theta = longitude - cities[i].lng;
	        var radtheta = Math.PI * (theta/180);
	        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	    
	        dist = Math.acos(dist);
	     
	        dist = dist * 180/Math.PI;
	     
	        dist = dist * 60 * 1.1515;
	       
	        dist = dist * 1.609344;

	        if (dist < min2)
	        {
	        	if (dist < min1)
		        {	
		        	if (dist < min)
			        {
			        	min = dist; 
			        	which = cities[i].name;	
			        }
			        else 
			        {
			        	min1= dist; 
		        		which1 = cities[i].name;
			        }	
		        }
		        else
		        {
		        	min2 = dist; 
		        	which2 = cities[i].name;
		        }	
	        }    

	    }

	    printCities = printCities + "<br/>" + which + "<br/><br/>" + which1 +"<br/><br/>" + which2;

	    output.innerHTML = '<h4>'+printCities +'</h4>';
	    
	  }

	  function error() {
	    output.innerHTML = "Unable to retrieve your location";
	  }

	  document.getElementById("out").innerHTML = "<p>Locating…</p>";
	  var options = {
  		enableHighAccuracy: false,
  		timeout: 10000,
  		maximumAge: 0
		};

	  navigator.geolocation.getCurrentPosition(success, error,options);
	}





	render() {


		const { value, suggestions } = this.state;
		const inputProps = {
			placeholder: "Type your city",
			value,
			onChange: this.onChange
		};

		return (
			<div id="home-city">
			<div className="row">
				<div className="box3 col-sm-8">
					<h2>Please select the city you are in</h2>
					<div id="chooser">
					<h4>You can then begin to ask the questions you need</h4>
					
					<Autosuggest 
						suggestions={suggestions}
						onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
						onSuggestionsClearRequested={this.onSuggestionsClearRequested}
						getSuggestionValue={getSuggestionValue}
						renderSuggestion={renderSuggestion}
						inputProps={inputProps}
						aria-label="Autosuggest for cities" />
						
						<NavLink to="/city"><button onClick={this.onChangeCity.bind(this)} className="my-btn">GO</button></NavLink>
					</div>
				</div>
				<div className="box6 col-sm-4">
				<h4 id="acc">We can give you recommendations of cities near your location just</h4>
				<button className="my-btn-7" onClick={this.geoFindMe.bind(this)}>Click here!</button>
				<div id="out"></div>
				</div>
				</div>
				<p>You&#39;re new to a city? Come talk to people who know the city and easily get around!</p>
				<p>We want to create a community of people that can help each other with what they have to offer. 
				So don't doubt to find help here and to meet new people.</p>
				<br/>
				<hr/>
				<br/>
				<p> This Website uses your location </p>
				<p> This Website tracks and collects feedback from visitors </p>
				<p> In case you don&#39;t agree please <span id="leave">leave</span> the page</p>
				<p> </p>
				<p> </p>
			</div>
			);
	}
}


export default Home;