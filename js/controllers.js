'use strict';

var app = angular.module('fireApp');

app.controller('mainCtrl', function($scope, List, User) {
  $scope.user = User;
  $scope.list = List;

  $scope.add = function(desc) {
    $scope.list.$add({
      desc: desc,
      isComplete: false
    });
    $scope.desc = '';
  };
});

app.controller('userCtrl', function($scope, $state, Auth, $firebase) {
  $scope.state = $state.current.name.split('.')[1];

  $scope.submit = function() {
    console.log($scope.user);
    if ($scope.state === 'login') {
      Auth.login($scope.user)
        .then(function() {
          $state.go('user.loggedin');
        }, function() {
          $scope.user.password = '';

        })
    } else {
      if ($scope.user.password !== $scope.user.password2) {
        $scope.user.password = $scope.user.password2 = ''
        return alert('try again')
      }
      Auth.register({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then(function(authData) {
          console.log('authData:', authData);
          $state.go('user.login');
        })
        .catch(function(err) {
          alert('Glitch in the Matrix')
          console.log("err:", err)
        });
    };
  };
});

app.controller('addchatCtrl', function($scope, $firebase, List, User) {
  $scope.messages = List;
  $scope.addMessage = function(message) {
      if (!$scope.message.msg || !User) return;
      $scope.messages.$add({
        from: User,
        body: $scope.message.msg
      });
      $scope.message.msg = "";
  }

});

app.controller('readchatCtrl', function($scope, List, Mymessage, User) {
  $scope.messages = List;
  $scope.personalmessages = Mymessage;
  console.log('readchatCtrl working')
  $scope.addMessage = function(message) {
    console.log('msg:', $scope.$$childHead)
    $scope.personalmessages.$add({
      To: "you",
      from: User,
      body: $scope.$$childHead.message2
    })
    $scope.$$childHead.message2 = ''


  }
  console.log('List:', $scope.messages)
})






app.controller('navCtrl', function($scope, $state, Auth, fbAuth) {
  fbAuth.$onAuth(function(authData) {
    console.log('authdata:', authData);
    $scope.authData = authData;
  });

  $scope.logout = function() {
    Auth.logout();
    $state.go('home');
  };
});


app.controller('personalchatCtrl', function($scope, Mymessage) {
  console.log("personalchatCtrl working")
  $scope.messages = Mymessage;
  console.log('List:', $scope.messages)
})
