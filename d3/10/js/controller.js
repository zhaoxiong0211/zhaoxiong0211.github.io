var app = angular.module('myApp', []);

app.controller('MainCtrl', ['$scope', '$interval',function($scope, $interval){
    var temPropertyData = {}
    var monthToNumber = {"Jan":"01", "Feb":"02", "Mar":"03", "Apr":"04", "May":"05", "Jun":"06", "Jul":"07", "Aug":"08", "Sep":"09", "Oct":"10", "Nov":"11", "Dec":"12"};
    var pauseRestart = document.getElementById("switch");
    var isPause = false;
    var dataList = document.getElementById("List");
      
    propertyData.forEach(function(d){
        
        var temMonth = monthToNumber[d.Date.split("'")[0]],
            temYear = parseInt(d.Date.split("'")[1]) < 20 ? "20" + d.Date.split("'")[1] : "19" + d.Date.split("'")[1];
        var temDate = temYear + temMonth;
        
        var temCity = (d.Address.split("/")[0].split(", ").join("_")).toUpperCase();
        var temDollar = d.Price.substring(1, d.Price.length-1);
        
        if (temDate in temPropertyData) {
            if (temCity in temPropertyData[temDate]){
                temPropertyData[temDate][temCity].quantity += 1;
                temPropertyData[temDate][temCity].dollar += parseFloat(temDollar);
            }
            else{
                if (temCity in cityInfo){
                    temPropertyData[temDate][temCity] = {"quantity":1, "dollar":parseFloat(temDollar)};
                }
            }
        }
        else{
            temPropertyData[temDate] = {};
            if (temCity in cityInfo){
                temPropertyData[temDate][temCity] = {"quantity":1, "dollar":parseFloat(temDollar)};
            }
        }
    });
    
    
    $scope.propertyData = temPropertyData;
    $scope.keys = Object.keys($scope.propertyData);
    
    var i = 0;
    
    var newTime = $interval(intervalFunction, 2000); 
    
    $scope.pause = function(){
        console.log("pause");
        if (isPause === false){
            $interval.cancel(newTime);
            pauseRestart.textContent = "START";
            isPause = true;
            dataList.style.display = "inline-block";
        }
        else{
            newTime = $interval(intervalFunction, 2000);
            pauseRestart.textContent = "PAUSE";
            isPause = false;
            dataList.style.display = "none";
            $scope.selectedDate = "";
        }
    }
    
    function intervalFunction(){
        $scope.temPropertyData = $scope.propertyData[$scope.keys[i]];
        $scope.curMonth = ($scope.keys[i]).toString().substr(4,2);
        $scope.curYear = ($scope.keys[i]).toString().substr(0,4);
        i += 1;
        if (i == $scope.keys.length){ $interval.cancel(newTime); pauseRestart.textContent = "START"; dataList.style.display = "inline-block"; isPause = true;}
    }
    
    $scope.update2 = function(){
        $scope.temPropertyData = $scope.propertyData[$scope.selectedDate];
        $scope.curMonth = ($scope.selectedDate).toString().substr(4,2);
        $scope.curYear = ($scope.selectedDate).toString().substr(0,4);
        i = $scope.keys.indexOf($scope.selectedDate);
    }

}]);

app.filter('myFilter', function() {
  return function(time) {
      
    return time.toString().substr(4,2) + " / " + time.toString().substr(0,4);

  }

});