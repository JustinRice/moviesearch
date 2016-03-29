var CreateApp = angular.module('Create',[]);
CreateApp.controller('Create', function($scope){
    
    var socket=io.connect('https://'+document.domain+':'+location.port+'/create');
    
    
});
