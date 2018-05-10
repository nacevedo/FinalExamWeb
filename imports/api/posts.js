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

  'posts.insert'(id, text) {
   
   // check(text, String);
    // check(city, String);
    // check(text, String);
 
    // Make sure the user is logged in before inserting a task
   // if (! Meteor.user()) {
    //  throw new Meteor.Error('not-authorized');
    //}

    Posts.insert({
     name: id, 
     cal : text
   }); 
  },
  'posts.vote'(postId, emoji) {

    check(postId, String);
    check(emoji, String);


    let postObj = Posts.findOne(postId);

    console.log("llega hasta aca" + postObj); 

    if (!postObj) {
      throw new Meteor.Error('Post not found!');
      //console.err("Post not found!");
      //return;
    }

    postObj.voteCount+=1;
    if (postObj.votes[emoji]===undefined) {
      postObj.votes[emoji]=0;
    }
    postObj.votes[emoji]+=1;

    Posts.update(postObj._id,
      postObj);

  },
});


