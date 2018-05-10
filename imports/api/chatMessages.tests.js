import { Meteor } from "meteor/meteor"
import { ChatMessages } from "./chatMessages.js"
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from "meteor/dburles:factory";
import { sinon } from 'meteor/practicalmeteor:sinon';
import { assert } from "meteor/practicalmeteor:chai";
import faker  from "faker";

if(Meteor.isServer){
	
	describe('chatMessages', function () {
		describe('chatMessages.insert', function () {

			const name = faker.name.findName();
			let currentUser;

			beforeEach(() => {
				ChatMessages.remove({});

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


			it('This should insert a new chat message', function () {
		    // This code will be executed by the test driver when the app is started
		    // in the correct mode

		    Meteor.call('chatMessages.insert', "hola lola", "this.props.chatID", "Pepita"); 

		    let newMessage = ChatMessages.findOne({"text": "hola lola"});

		    assert.equal("hola lola", newMessage.text);
		    assert.equal("Pepita", newMessage.user); 
		});
		});
		describe('chatMessages.insert', function () {

			let currentUser = faker.name.findName();

			it('This should NOT insert a new chat message', function () {
		    // This code will be executed by the test driver when the app is started
		    // in the correct mode

		    assert.throws(() => {

	        //whatever you want to run that should throw the error goes here
	        Meteor.call('chatMessages.insert', "Bogotá", "Any reccomendations for burger place", "Burger place"); 

	    }, Meteor.Error, /not-authorized/); 
		});

		});
	});
}
