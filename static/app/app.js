(function() {
  'use-strict';
// Basic setup from: http://txt.fliglio.com/2013/05/angularjs-state-management-with-ui-router/

angular.module('ussdClient',[]).controller('MainController',['$scope','$http', function($scope,$http) {

  var initial_url_lookup = {
    'localhost': window.location.origin + '/ussd/',
    'homes.cs.washington.edu': window.location.href.slice(0,-10) + 'ussd.php',
  }

  angular.extend($scope,{
    session:"start",
    input:"",
    response:"",
    input_history:[],
    data:{
      url:initial_url_lookup[window.location.hostname],
      serviceCode:"*384*1234",
      phoneNumber:"+27470000000",
      sessionId:"AT_" + Math.floor(Math.random()*9999),
      text:""
    },

    send:function($event){
      console.log('Send',$scope.input_history);
      $scope.input_history.push($scope.input)
      $scope.data.text = $scope.input_history.join('*');
      $scope.input = '';
      $scope.post();
    },

    call:function(){
      console.log('Calling',$scope.data.serviceCode,'on',$scope.data.url);
      var initial_data = $scope.data.text.split('*');
      if (initial_data.length >= 1 && initial_data[0] != "") {
        $scope.input_history = initial_data;
      }
      $scope.session = 'ongoing';
      $scope.post();
    },

    end:function(){
      $scope.session = 'start';
      // Reset all variables
      $scope.data.sessionId = "AT_" + Math.floor(Math.random()*9999);
      $scope.data.text = ""
      $scope.response = "";
      $scope.input_history = [];
      $scope.input = "";
    },

    post:function(){
      console.log('Posting',$scope.data);
      $http.post($scope.submitURL,$scope.data,{responseType:'json'}).then(function(response){
        console.log('Post Response',response);
        $scope.response = response.data.text;
        if(response.data.action.toLowerCase() !== 'con') {
          console.log('END');
          $scope.session = 'end';
        }
      });
    },

    submitURL:window.location.origin,

    keypress:function(evt) {
      if (evt.key == 'Enter') {
        $scope.send();
      }
    },

  });

  var pathList = window.location.pathname.split('/');
  if (pathList[1] != 'static') {
    $scope.submitURL += pathList.slice(0,-1).join('/') + '/post.php';
  } else {
    $scope.submitURL += '/';
  }

}]);

}())
