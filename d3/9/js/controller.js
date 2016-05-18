var app = angular.module('myApp', []);

app.controller('MainCtrl', ['$scope', '$interval',function($scope, $interval){
    var routeList = new Array();
    $.ajax( {  
        url : "http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=sf-muni",  
        dataType : "xml",  
        async : false,
        error : function(xml) {  
            alert('error loading XML document' + xml);  
        },  
        success : function(xml) {  
            routeList = [].map.call(xml.querySelectorAll("route"), function(route) {
                return {
                  tag: route.getAttribute("tag"),
                  title: route.getAttribute("title")
                };
            });
        }
    });
    $scope.routeList = routeList;
    renewData();

    function renewData(){
        $scope.milliseconds = (new Date).getTime();

        var vehicleData = new Array();
        routeList.forEach(function(route,i){
            $.ajax( {  
                url : "http://webservices.nextbus.com/service/publicXMLFeed?command=vehicleLocations&a=sf-muni&r="+route.tag+"&t="+$scope.milliseconds,  
                dataType : "xml",  
                async : false,
                error : function(xml) {  
                    alert('error loading XML document' + xml);  
                },  
                success : function(xml) {  
                    dataPosition = [].map.call(xml.querySelectorAll("vehicle"), function(vehicle) {
                            return {
                              id: vehicle.getAttribute("id"),
                              tag: route.tag,
                              lat: parseFloat(vehicle.getAttribute("lat")),
                              lon: parseFloat(vehicle.getAttribute("lon")),
                              speedKmHr: parseFloat(vehicle.getAttribute("speedKmHr"))
                            };
                    });
                    vehicleData = vehicleData.concat(dataPosition);
                }
            });     
        })
        $scope.vehicleData = vehicleData;
    }
//    $interval(renewData, 15000); 
    
//    $scope.filterList = new Array();
    var filterList = []
    $scope.routeClick = function($event){
        $scope.filterList = [];
//        console.log("click")
//        var filterList = $scope.filterList || [];
        $event.currentTarget.classList.toggle("active");
        idx = filterList.indexOf($event.currentTarget.id);
        if(idx == -1){
            filterList.push($event.currentTarget.id);
        }
        else{
            filterList.splice(idx, 1);
        }
//        console.log(filterList)
        $scope.filterList = filterList;
//        $scope.$apply();
    }
    
}]);