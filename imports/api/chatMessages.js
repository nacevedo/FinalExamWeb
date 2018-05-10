import { Mongo } from "meteor/mongo";
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';


export const ChatMessages = new Mongo.Collection("chatMessages");

if(Meteor.isServer) {
	Meteor.publish("chatMessages", () => {
		return ChatMessages.find({});
	});

    const chatMessagesInsert = {
  userId(userId) {
    const user = Meteor.users.findOne(userId);
    return user;
  },

  type: 'method',
  name: 'chatMessages.insert'
};


DDPRateLimiter.addRule(chatMessagesInsert, 5, 5000);

}


Meteor.methods({

  'chatMessages.insert'(text, chatId, un) {
    check(text, String);
    check(chatId, String); 
    check(un, String); 
    // Make sure the user is logged in before inserting a task
    if (! Meteor.user()) {
      throw new Meteor.Error('not-authorized');
    }
 
    ChatMessages.insert({
      text:text, 
      chatId: chatId, 
      user : un

    });

  }
});

