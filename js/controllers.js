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
          alert('d')
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
          $state.go('home');
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

    console.log(" $scope.message.msg", $scope.message.msg )
      if (!$scope.message.msg) return;
      $scope.messages.$add({
        from: User,
        body: $scope.message.msg
      });
      console.log('$scope.messages:', $scope.messages)
      $scope.message.msg = "";
      console.log('$scope.messages:', $scope.messages)
  }
});


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

app.controller('readchatCtrl', function($scope, List) {
 console.log('readchatCtrl working')
  $scope.messages = List;
  console.log('List:', $scope.messages)
})
