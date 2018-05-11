import { Mongo } from "meteor/mongo";
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter'


export const Posts = new Mongo.Collection("posts");

if(Meteor.isServer) {
  Meteor.publish("posts", () => {
    return Posts.find({});
  });



  const loginRule = {
  userId(userId) {
    const user = Meteor.users.findOne(userId);
    return user;
  },

  type: 'method',
  name: 'posts.vote'
};

  const postInsert = {
  userId(userId) {
    const user = Meteor.users.findOne(userId);
    return user;
  },

  type: 'method',
  name: 'posts.insert'
};

DDPRateLimiter.addRule(loginRule, 5, 5000);
DDPRateLimiter.addRule(postInsert, 5, 5000);

}

Meteor.methods({

  'posts.insert'(route, text) {
   

    Posts.insert({
     route : route,
     text: text, 
     who: Meteor.user()
   }); 

  },

});


