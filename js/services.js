'use strict';

var app = angular.module('fireApp');

app.factory('fbRef', function($window, fbUrl) {
  return new $window.Firebase(fbUrl);
});

app.factory('List', function(fbRef, $firebaseArray) {
  var listRef = fbRef.child('list');
  return $firebaseArray(listRef);
});

app.factory('User', function(fbRef, $firebaseObject) {
  var userRef = fbRef.child('user');
  return $firebaseObject(userRef);
});

app.factory('fbAuth', function(fbRef, $firebaseAuth) {
  return $firebaseAuth(fbRef);
});

// app.factory('MakeList', function(fbRef, $firebaseArray) {
//   return function(child) {
//     var listRef = fbRef.child(child);
//     return $firebaseArray(listRef);
//   };
// });

app.service('Auth', function(fbAuth) {
  this.register= function(userObj) {
    return fbAuth.$createUser(userObj)
    .then(function(userData){
      console.log('user ' + userData.uid + "success");
      return fbAuth.$authWithPassword(userObj);
    })
  };
  this.login = function(userObj) {
      return fbAuth.$authWithPassword(userObj);
  };
  this.logout = function() {
      fbAuth.$unauth();
  };
});

app.factory('Profile', function($firebaseObject, fbRef) {
  var User = $firebaseObject.$extend({
    getFullName: function() {
      return this.firstName + " " + this.lastName;
    }
  });
  return function(userId) {
    var ref = fbRef.child('profiles').child(userId);

    return new User(ref);
  }
});
//
// $scope.profile = profile(authData.uid);
//
// $scope.profile.firstName = "Richard";
// $scope.profile.getFullName();
// $scope.profile.$save();
