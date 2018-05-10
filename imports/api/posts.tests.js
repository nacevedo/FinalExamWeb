import { Meteor } from "meteor/meteor"
import { Posts } from "./posts.js"
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from "meteor/dburles:factory";
import { sinon } from 'meteor/practicalmeteor:sinon';
import { assert } from "meteor/practicalmeteor:chai";
import faker  from "faker";

if(Meteor.isServer){
	
	describe('posts', function () {
		describe('posts.insert', function () {

			const name = faker.name.findName();
			let currentUser;

			beforeEach(() => {
				Posts.remove({});

		        // Stud the user
		        resetDatabase();
		        Factory.define("user", Meteor.users, {
		        	username: name,
		        });
		        currentUser = Factory.create("user");
		        sinon.stub(Meteor, "user");
		        Meteor.user.returns(currentUser);

		    });

			afterEach(() => {
				Meteor.user.restore();
				resetDatabase();
			});


			it('This should insert a new post', function () {
		    // This code will be executed by the test driver when the app is started
		    // in the correct mode

		    Meteor.call('posts.insert', "Bogotá", "Any reccomendations for burger place", "Burger place"); 

		    let newPost = Posts.findOne({"title": "Burger place"});

		    assert.equal("Bogotá", newPost.city);
		    assert.equal("Burger place", newPost.title); 
		});
		});
		describe('posts.insert', function () {

			let currentUser = faker.name.findName();

			it('This should NOT insert a new post', function () {
		    // This code will be executed by the test driver when the app is started
		    // in the correct mode

		    assert.throws(() => {

	        //whatever you want to run that should throw the error goes here
	        Meteor.call('posts.insert', "Bogotá", "Any reccomendations for burger place", "Burger place"); 

	    }, Meteor.Error, /not-authorized/); 
		});

		});

		describe('posts.vote', function () {

			let currentUser = faker.name.findName();

			it('This should NOT vote a post', function () {
		    // This code will be executed by the test driver when the app is started
		    // in the correct mode

		    assert.throws(() => {

	        //whatever you want to run that should throw the error goes here
	        Meteor.call('posts.vote', "aaaaaa", "👍"); 

	    }, Meteor.Error, /Post not found!/); 
		});

		});
	});
}
