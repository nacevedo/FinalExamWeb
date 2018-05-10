import { Meteor } from "meteor/meteor"
import { Comments } from "./comments.js"
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Posts } from "./posts.js"
import { Factory } from "meteor/dburles:factory";
import { sinon } from 'meteor/practicalmeteor:sinon';
import { assert } from "meteor/practicalmeteor:chai";
import faker  from "faker";

if(Meteor.isServer){
	
	describe('comments', function () {
		describe('comments.insert', function () {

			const name = faker.name.findName();
			let currentUser;

			beforeEach(() => {
				Comments.remove({});

		        // Stud the user
		        resetDatabase();
		        Factory.define("user", Meteor.users, {
		        	username: name,
		        });
		        currentUser = Factory.create("user");
		        sinon.stub(Meteor, "user");
		        Meteor.user.returns(currentUser);

		        Posts.insert({
			      city: "Bogotá", 
			      who: currentUser, 
			      text: "ayuda",
			      title: "tengo hambre", 
			      voteCount:0,
			      votes:{
			        "👍":0
			      }
   				});

		    });

			afterEach(() => {
				Meteor.user.restore();
				resetDatabase();
			});


			it('This should insert a new comment', function () {
		    // This code will be executed by the test driver when the app is started
		    // in the correct mode
		    let post = Posts.findOne({"title": "tengo hambre"});

		    Meteor.call('comments.insert', "post._id", "Burger place"); 

		    let newComment = Comments.findOne({"text": "Burger place"});

		    assert.equal("Burger place", newComment.text); 
		    assert.equal("post._id", newComment.post); 

		});
		});
		describe('comments.insert', function () {

			let currentUser = faker.name.findName();

			it('This should NOT insert a new comment', function () {
		    // This code will be executed by the test driver when the app is started
		    // in the correct mode

		    assert.throws(() => {

	        //whatever you want to run that should throw the error goes here
	        Meteor.call('comments.insert', "post._id", "Burger place"); 

	    }, Meteor.Error, /not-authorized/); 
		});

		});

		describe('comments.vote', function () {

			let currentUser = faker.name.findName();

			it('This should NOT vote a post', function () {
		    // This code will be executed by the test driver when the app is started
		    // in the correct mode

		    assert.throws(() => {

	        //whatever you want to run that should throw the error goes here
	        Meteor.call('comments.vote', "aaaaaa", "👍"); 

	    }, Meteor.Error, /Post not found!/); 
		});

		});
	});
}
