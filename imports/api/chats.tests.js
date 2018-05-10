import { Meteor } from "meteor/meteor"
import { Chats } from "./chats.js"
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from "meteor/dburles:factory";
import { sinon } from 'meteor/practicalmeteor:sinon';
import { assert } from "meteor/practicalmeteor:chai";
import faker  from "faker";

if(Meteor.isServer){
	
	describe('chats', function () {
		describe('chats.insert', function () {

			const name = faker.name.findName();
			let currentUser;

			beforeEach(() => {
				Chats.remove({});

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


			it('This should insert a new chat', function () {
		    // This code will be executed by the test driver when the app is started
		    // in the correct mode

		    Meteor.call('chats.insert', "Juana", "Pedro");

		    let newChat = Chats.findOne({"user2":"Juana"});

		    assert.equal("Pedro", newChat.user1);
		    assert.equal("Juana", newChat.user2); 
		});
		});
		describe('chats.insert', function () {

			let currentUser = faker.name.findName();

			it('This should NOT insert a new chat', function () {
		    // This code will be executed by the test driver when the app is started
		    // in the correct mode

		    assert.throws(() => {

	        //whatever you want to run that should throw the error goes here
	        Meteor.call('chats.insert', "Bogotá", "Any reccomendations for burger place", "Burger place"); 

	    }, Meteor.Error, /not-authorized/); 
		});

		});
	});
}
