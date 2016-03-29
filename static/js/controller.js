


    
var SearchController = angular.module('MovieSearch',[]);

//SearchController.controller('SearchController', function($scope){

SearchController.controller('SearchController', function($scope,$compile){
    
    var socket=io.connect('https://'+document.domain+':'+location.port+'/moviesearch');
    
    
    socket.on('addCred', function(params){
        var area=document.getElementById("secResultsArea");
        area.innerHTML="";
        var header=document.createElement("H4")
        var text = "Credits for " + params[0]
        header.innerHTML=text;
        area.appendChild(header);
        var tab = document.createElement("TABLE");
        tab.setAttribute("class","table table-hover");
        
        
        for (var x = 1; x < params.length; x ++){
            
                var newRow = document.createElement("TR");
                var newRowTD = document.createElement("TD");
                var inp = document.createElement("BUTTON");
                inp.setAttribute("type","submit");
                inp.setAttribute("class", "btn btn-link");
                var creString = "changeMovie('" + params[x] + "')";
                inp.setAttribute("ng-click",creString);
                inp.innerHTML=params[x];
                newRowTD.appendChild(inp);
                newRow.appendChild(newRowTD);
                tab.appendChild(newRow);
                $compile(inp)($scope)
            }
            
        area.appendChild(tab);
        
    });
    
    
    socket.on('movieRes', function(params){
        var area=document.getElementById("secResultsArea");
        area.innerHTML="";
        $scope.$apply(function(){
            var area=document.getElementById("primResultsArea");
            area.innerHTML="";
            var header=document.createElement("H3");
            header.innerHTML=params[0];
            area.appendChild(header);
            var outerTable = document.createElement("TABLE");
            var rightTable = document.createElement("TABLE");
        
            rightTable.setAttribute("class","table table-hover");
            var leftTable = document.createElement("TABLE");
            var tabRow = document.createElement("TR");
            var tabData2 = document.createElement("TD");
            var tabData = document.createElement("TD");
            var leftHead = document.createElement("THEAD")
            var rightHead = document.createElement("THEAD")
        
            var ltabrow1,ltabrow2,ltabrow3,ltabrow4;
            ltabrow1 = document.createElement("TR");
            ltabrow2 = document.createElement("TR");
            ltabrow3 = document.createElement("TR");
            ltabrow4 = document.createElement("TR");
        
            var arow = document.createElement("TD")
            var arow1 = document.createElement("TD")
            var arow2 = document.createElement("TD")
            var arow3 = document.createElement("TD")
            arow.innerHTML="Year: " + params[4];
            ltabrow1.appendChild(arow);
            arow1.innerHTML="Director: " + params[1];
            ltabrow2.appendChild(arow1);
            arow2.innerHTML="Score: " + params[2];
            ltabrow3.appendChild(arow2);
            arow3.innerHTML="Votes: " + params[3];
            ltabrow4.appendChild(arow3);
        
            leftTable.appendChild(ltabrow1);
            leftTable.appendChild(ltabrow2);
            leftTable.appendChild(ltabrow3);
            leftTable.appendChild(ltabrow4);
            
            
            var brow = document.createElement("TR");
            var brow1TH = document.createElement("TH");
            brow1TH.innerHTML="Actors";
            rightTable.appendChild(brow);
            rightTable.appendChild(brow1TH);
            
            for (var x = 5; x < params.length; x ++){
                var name = params[x];
                var newRow = document.createElement("TR");
                var newRowTD = document.createElement("TD");
                var inp = document.createElement("BUTTON");
                inp.setAttribute("type","submit");
                inp.setAttribute("class", "btn btn-link");
                var creString = "getCredits('" + params[x] + "')";
                inp.setAttribute("ng-click",creString);
                inp.innerHTML=params[x];
                newRowTD.appendChild(inp);
                rightTable.appendChild(newRow);
                rightTable.appendChild(newRowTD);
                $compile(inp)($scope)
            }
        
        
        var headerRow = document.createElement("THEAD");
        
        outerTable.appendChild(headerRow);
        var th1 = document.createElement("TH");
        var th2 = document.createElement("TH");
        th1.setAttribute("class","col-lg-6 col-md-6 col-sm-6 col-xs-6");
        th2.setAttribute("class","col-lg-6 col-md-6 col-sm-6 col-xs-6");
        outerTable.appendChild(th1);
        outerTable.appendChild(th2);
        
        tabData.appendChild(leftTable);
        tabData2.appendChild(rightTable);
        tabRow.appendChild(tabData);
        tabRow.appendChild(tabData2);
        outerTable.appendChild(tabRow);
        
        area.appendChild(outerTable);
        
        
        });  
    });
    
    
    $scope.search = function search(){
        var searchTerm = document.forms["searchT"].elements["term"].value;
        
        socket.emit('search', searchTerm);
    };
    
    $scope.getCredits = function getCredits(param){
        socket.emit('getCredits', param);
    };
    
           
    $scope.changeMovie = function changeMovie(param){
      socket.emit('search', param);  
    };
    
});


