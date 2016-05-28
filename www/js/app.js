angular.module('starter', ['ionic','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
      
     //Enable the backgroud Mode
      cordova.plugins.backgroundMode.enable();
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('mainController', ['$scope','$cordovaGeolocation','$http',function ($scope,$cordovaGeolocation,$http) {
    
  var geocoder;
  var map;
  var infowindow = new google.maps.InfoWindow();

  var geoSettings = {timeout: 10000,enableHighAccuracy: false};  
  var geo = $cordovaGeolocation.getCurrentPosition(geoSettings);

  geo.then(function (position) {        
    $scope.latitude = position.coords.latitude;
    $scope.longitude = position.coords.longitude;      
            
    $http({
          url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+$scope.latitude+','+$scope.longitude+'&sensor=true', 
          method: "GET"
      }).then(function(response){
        var address = response.data.results[0].address_components;
        $scope.address = response.data.results[0].formatted_address;

        initMap();

        angular.forEach(address, function(a){
          console.log(a.types);
        });

      }); 
    },
    function error(err) {
      $scope.errors = err;
    }
  );
    

  /* function to initialize the map */
  function initMap() {
      geocoder = new google.maps.Geocoder();
      var latlng = new google.maps.LatLng($scope.latitude, $scope.longitude);
      var mapOptions = {
          zoom: 16,
          center: latlng,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

      marker = new google.maps.Marker({position: latlng,map: map});
  }
                                                    
}]);



