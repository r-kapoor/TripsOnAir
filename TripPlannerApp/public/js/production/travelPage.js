/**
 * Created by rkapoor on 07/02/15.
 */

var routesModule = angular.module('tripdetails.routes.app', ['ui.bootstrap','pageslide-directive','ngDraggable','ngJScrollPane']);

routesModule.controller('routesController',  ['$scope', '$rootScope', function($scope, $rootScope) {


}]);

/**
 * Created by rajat on 5/16/2015.
 */
routesModule.controller('shabariController',  ['$scope', '$rootScope', function($scope,$rootScope) {

    $scope.isLoaderShown = true;
    $rootScope.$on("dataLoaded",function onShowTravelPanel(event, data){
        $scope.isLoaderShown = false;
    });
    $rootScope.$on("gettingData",function onShowTravelPanel(event, data){
        $scope.isLoaderShown = true;
    });

}]);

/**
 * Created by rkapoor on 08/02/15.
 */
//var routesMapModule = angular.module('tripdetails.routes.map.app', []);
//routesMapModule.controller('mapController',  function($scope, $window) {
routesModule.controller('sanjayaController',  ['$scope','$rootScope', '$window','orderedCities', function($scope,$rootScope, $window,orderedCities) {
    "use strict";
    $scope.zoomConstants = {
        COUNTRY: 5,
        CITY: 12
    };
    $scope.centerPosition = {
        Latitude: 25.4411179,
        Longitude: 78.5622883
    };
    var markerPosition = {
        Latitude: 28.6139,
        Longitude: 77.2089
    };
    var markerPosition1 = {
        Latitude: 12.9667,
        Longitude: 77.5667
    };
    var encodedPath = "kunmDw{ovMxhCgXfyEy_DjrEsuAbskBquKxbFemAdeJo_Fb~KcdFx|Ba}Bzts@kgg@piNzDds`@sp]|}Fik^xrD{MbvTloDheAvl@x}LzcBr{AgIzoo@~iGz~CevBjBehAv~DkaCb|BhqAhjTg}G`vJwnGlkIgfHt~D_a@b~TggMl}E_}F`jJzeCbcQe}DlpQ{sGpsMy}JvjNgvHd`AkeBh{W{uGhiBcQfdBokChkQksGxuBcTpsHohHzgD}rAz`EtIjoGrfBv{D|lC|cSz`IpdDfc@`rB||BzqRd`IviBqcBhyG{\\v}JgsCb_FdEh_JvwCzk[diAnoLwa@t~WdjIpxKfbAdjCteBneGqQlmBtoBf{KjhCvbGvwDdrP~kG`vGdoB~dG`nKfwGjvD`mUx{F|_B~cAfg@bpCzvVr_Nj~r@n}PxsI`mJqFjuBz{IbgWne@fbFzsAfuBfzDnqBxxDxdFlJvuEhoCpm@leHfiKhrGlcCzqAktBhtJgeBrnBsv@pnQa_LfpQehM~hDsxFbzCofAxmG}A|gCr`ChoEcnBrfAg|DbaCc_@ldFuiCd~BmqC|pGos@t_Je|DfiF|iAxzBaYjfD|i@ldB{t@cl@cwC~]gpCzfBmtAr{Rpi@jgD{SneLuuHjlGwS|mNo~E|uMugQrtKt`@raEzhAncIpzLzDr_CpmHpsBpoCin@nsAsjBmx@}kF{VohPyvA{zHxp@w{MzjGg_GpeFsdDhhEwuA|{JyqW~lJ|UvuDyeH~dAseI||B_sB~~Dm_G|c@o{BffGuxC`yAh~CddDwjAvcGzrCzjKcXvtKwaFpeL_lCfe@edGs`ByfLym@ssIee@qhAfo@{{EjxDujIdsDcmPsz@_dOh`AaiGxvF}_CruDaX|_D|a@rbRjeG|kI`gB|cCviArpGcGl}M|cJr\\tn@z_E`s\\peDb}R|wBjfC|jB|dKbf@{GvpMkzNjnV}t[fcCh]pjP}sG~lf@g|Y`sFcOznI{zCd_AgjAjsJm|RhoEspFnmFamNbjF}iE~iIam@~uR_vLhbEm}F~gFkqAn`JzBzdF~_AhcLklD|fFyiDhxCg|Ij_FkyCn_GpwDnzI|pBr_FpqFd{@bvEleBv{BdvDb_AzoIcf@tpHe|@pdLimF|_LcvB~w[l{E``H|Gx}GbuCzyEuz@rnM|qAl}CphBvoOz~B~e@ib@~fNcqCrlFe|DlzGq~CzlFyhDtcFp`B|~Xlc@zc]{~Dh|Ck|@~tItPrfCzoDtp]nt^trDlbIhiCpfDlsBbgKtGvvCxuMrfQz}ClfJrxGvgCbfE~tEa^dfDhjCbfBxwBfqHzeDjoDddBvnGhPfaDhwApjD{UjaUbbAp`GxDp|HleA`eDy`@b}GuoC~hDcPncG{eCf~J~{Fdpb@wMvmGtxIhpXb`ElbIbuO~pJ_`@tvDjd@~pG_{AzyEx{@ruHtdE`bPlB~cHrgCdtJ}@fbDzpGtk\\`VpaHzeH~pZ~Y`mDvaBbaEjmJthHpzA`aHvuWccG|wGm[xlJesCdw_Aido@jyGy\\lnCynBjgGrS|dFaeC`pGz[|tJgo@lwEpaAheG~dChaHb{@`bCwVtaHj~@j|Go~@r`IhcBteNbkIt{Sv~BdxM|AbeCym@dxFewGl|BqkBxjNc_E|}NqmGxiC_XdrQaW`uW|x@xpK{sAb{Fm}BfbDydHrsCqzAniC{bInkNglKj`Cyt@xuI`Xn|GyhBh`IlXnnCwYbvItNzlIy^b|BifDvbRgkJdgKwhB~`BXblCurA|qC|fArlDehCtnL_lCxoKdg@pl@cbBn`I_c@bfAd\\lmEbdIpkA~uQ~{AnoEvtF~tAteK_xB~_JdnAfcUzcJza@vhAztB~O|nPabBt|Gzb@peH}k@|lFrdAraGasBz|QfgBvkFcf@p_HcxCr~j@_~Ej`HeoCdtHxwEnWtcBdmI{gDp]`O";
    //var markerPosition = {
    //    Latitude: position.coords.latitude,
    //    Longitude: position.coords.longitude
    //};

    var directionsDisplay;

    var markers = [];
    var infowindows = [];
    var routePaths = [];
    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    $scope.map = null;

    $scope.zoom = $scope.zoomConstants.COUNTRY;
    $scope.initializeMap = function() {
        console.log('Hello World');
        function initialize() {
            var mapCanvas = document.getElementById('map-canvas');
            var mapOptions = {
                center: new google.maps.LatLng($scope.centerPosition.Latitude, $scope.centerPosition.Longitude),
                zoom: $scope.zoom,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            console.log('Map Initialized');
            $scope.map = new google.maps.Map(mapCanvas, mapOptions);
            //$scope.addMarker(markerPosition);
            //$scope.addMarker(markerPosition1);
            console.log('Map Initialized');
            //$scope.showRoute(markerPosition, markerPosition1);
            //$scope.showPath(encodedPath);
            console.log('Map Initialized');
            // $scope.showFlightPath(markerPosition, markerPosition1);
            console.log('Map Initialized');
        }
        angular.element(window).ready(function () {
            initialize();
        });
        //google.maps.event.addDomListener($window, 'load', initialize);
        //initialize();
        google.maps.event.addDomListener(window, "resize", function() {
            var center = $scope.map.getCenter();
            google.maps.event.trigger($scope.map, "resize");
            $scope.map.setCenter(center);
        });
    };

    function setAllMap() {
        console.log('setAllMap');
        for (var i = 0; i < markers.length; i++) {
            console.log('i:'+i);
            markers[i].setMap($scope.map);
        }
    }

    function removeAllMarkers() {
        for(var i = 0; i < infowindows.length; i++) {
            infowindows[i].setMap(null);
        }
        infowindows = [];
        for(i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
    }

    $scope.initializeMap();
    $scope.addMarker = function(position, char) {
        console.log('addMarker');
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(position.Latitude, position.Longitude),
            map: $scope.map,
            icon:'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+char+'|FF0000|000000'
        });
        var infowindow =  new google.maps.InfoWindow({
            content: position.CityName,
            map: $scope.map
        });
        infowindow.close();
        google.maps.event.addListener(marker, 'mouseover', function() {
            infowindow.open($scope.map, this);
        });
// assuming you also want to hide the infowindow when user mouses-out
        google.maps.event.addListener(marker, 'mouseout', function() {
            infowindow.close();
        });
        markers.push(marker);
        infowindows.push(infowindow);
        //setAllMap();
    };
    $scope.showRoute = function(originPosition, destinationPosition,waypoints) {
        var directionsService = new google.maps.DirectionsService();
        var directionsRequest = {
            origin: new google.maps.LatLng(originPosition.Latitude, originPosition.Longitude),
            destination: new google.maps.LatLng(destinationPosition.Latitude, destinationPosition.Longitude),
            waypoints:waypoints,
            travelMode: google.maps.DirectionsTravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC
        };
        directionsService.route(
            directionsRequest,
            function(response, status)
            {
                //console.log('Response:'+JSON.stringify(response));
                if (status == google.maps.DirectionsStatus.OK)
                {
                    removeRoute();
                    directionsDisplay = new google.maps.DirectionsRenderer(
                        {
                            suppressMarkers :true,
                            map : $scope.map,
                            directions : response
                        });
                }
            }
        );
    };

    var lineSymbol = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
    };
    $scope.showPath = function(pathString, showArrow) {
        var path;
        if(showArrow) {
            path = new google.maps.Polyline({
                path: google.maps.geometry.encoding.decodePath(pathString),
                icons:[{
                    icon:lineSymbol,
                    offset:"70%",
                    repeat:'0'
                }],
                map:$scope.map
            });
        }
        else {
            path = new google.maps.Polyline({
                path: google.maps.geometry.encoding.decodePath(pathString),
                map:$scope.map
            });
        }
        routePaths.push(path);
    };
    $scope.showFlightPath = function(originPosition, destinationPosition, showArrow) {
        var line;
        if(showArrow) {
            line = new google.maps.Polyline({
                path: [new google.maps.LatLng(originPosition.Latitude, originPosition.Longitude),
                    new google.maps.LatLng(destinationPosition.Latitude, destinationPosition.Longitude)],
                icons:[{
                    icon:lineSymbol,
                    offset:"70%",
                    repeat:'0'
                }],
                map: $scope.map
            });
        }
        else {
            line = new google.maps.Polyline({
                path: [new google.maps.LatLng(originPosition.Latitude, originPosition.Longitude),
                    new google.maps.LatLng(destinationPosition.Latitude, destinationPosition.Longitude)],
                map: $scope.map
            });
        }
        routePaths.push(line);
    };
    //$scope.addMarker();


    var removeRoute = function () {
        if (directionsDisplay != undefined || directionsDisplay != null) {
            directionsDisplay.setMap(null);
            directionsDisplay = null;
        }
    };

    var removeRoutePaths = function() {
        for(var i = 0; i < routePaths.length; i++) {
            routePaths[i].setMap(null);
            routePaths[i] = null;
        }
        routePaths = [];
    };


    $rootScope.$on('plotCities', function plotCities(event, data) {
        removeAllMarkers();
        var originCity=orderedCities.getOriginCity();
        $scope.addMarker(originCity,'A');
        var destinations = orderedCities.getOrderedDestinationCities();
        var waypoints =[];
        for(var i =0;i<destinations.length;i++)
        {
            $scope.addMarker(destinations[i], String.fromCharCode('A'.charCodeAt() + i+1));
            //if(i==0)
            //{
            //    $scope.showRoute(originCity,destinations[i]);
            //}
            //else
            //{
            //    $scope.showRoute(destinations[i-1],destinations[i]);
            //}
            //if(i==destinations.length-1)
            //{
            //    $scope.showRoute(destinations[i],originCity);
            //}
            waypoints.push({
                location: new google.maps.LatLng(destinations[i].Latitude, destinations[i].Longitude),
                stopover:true
            });
        }
        $scope.showRoute(originCity,originCity,waypoints);

    });

    //used by sarthi when only one destination
    $rootScope.$on('plotMarkers', function plotMarkers(event,data){
        console.log("plotMarkers called");
        removeAllMarkers();
        var originCity = data.origin;
        var destinationCity = data.destination;
        $scope.addMarker(originCity,'A');
        $scope.addMarker(destinationCity, String.fromCharCode('A'.charCodeAt() + 1));
        //$scope.addMarker(destinationCity, String.fromCharCode('A'.charCodeAt() + i+1));

    });

    $rootScope.$on('showSegment', function onShowSegment(event, segment) {
        console.log('In show segment:'+JSON.stringify(segment));
        var showArrow = false;
        if(segment.isMajor == 1) {
            showArrow = true;
        }
        if(segment.path != undefined) {
            $scope.showPath(segment.path, showArrow);
        }
        else{
            $scope.showFlightPath(segment.sAirport, segment.tAirport, showArrow);
        }
    });

    $rootScope.$on('showTravelPanel', function onShowTravelPanel(){
        removeRoute();
    });

    $rootScope.$on('removeSegments', function onRemoveSegments() {
        removeRoutePaths();
    });

}]);

routesModule.directive('postRepeat', ['$timeout', function($timeout) {
    return function($scope,$rootScope, element, $attrs) {
        console.log("testing....");
        console.log("element:"+element.class);

        if ($scope.$last){
            $timeout(function (){
                if(element.class=="panel-travel")
                {
                    console.log("in panel-travel");
                    console.log("scrollHeightTravel:"+$("#transcludeTravelPanel")[0].scrollHeight);
                    $scope.$emit('initialize-pane',"travelPanel");
                }
            },10);
            $timeout(function (){
                if(element.class=="panel-travelMode"){
                    console.log("in panel-travelMode");
                    console.log("scrollHeightTravelModes:"+$("#transcludeTravelModesPanel").get(0).scrollHeight);
                    $scope.$emit('initialize-pane',"travelModesPanel");
                }
            },1000);
            $timeout(function (){
                if(element.class=="panel-trainMode"){
                    console.log("in panel-trainMode");
                    console.log("scrollHeightTrainMode:"+$("#transcludeTrainPanel").get(0).scrollHeight);
                    $scope.$emit('initialize-pane',"trainPanel");
                }
            },1000);
            $timeout(function (){
                if(element.class=="panel-flightMode"){
                    console.log("in panel-flightMode");
                    console.log("scrollHeightFlightMode:"+$("#transcludeFlightPanel").get(0).scrollHeight);
                    $scope.$emit('initialize-pane',"flightPanel");
                }
            },1000);
        }
    };
}]);

routesModule.controller('sarthiController', ['$scope', '$rootScope', '$http', '$q', '$location', 'orderedCities', '$timeout', function($scope, $rootScope, $http, $q, $location, orderedCities, $timeout) {

    $scope.isTravelPanelOpen=false;
    $scope.isTravelModesPanelOpen=false;

    $scope.isTripPanelSetCollapsed = false;
    $scope.isModeDetailsPanelOpen = false;

    $scope.isTravelPanelDataHidden = true;
    $scope.cities = [];

    $scope.legs = [];
    $scope.currentLeg = null;
    $scope.currentLegIndex = -1;

    $scope.routes = [];
    $scope.trains = [];
    $scope.flights = [];
    $scope.buses = [];

    $scope.isTrainClicked = false;
    $scope.isFlightClicked = false;
    $scope.isBusClicked = false;
    $scope.isCabClicked = false;
    $scope.isDriveClicked = false;
    $scope.isCabOperatorClicked = false;
    $scope.cabDetails = [];
    $scope.currentSegment = null;
    $scope.currentRoute = null;
    $scope.currentRouteIndex = -1;

    $scope.cabDetailToggle = [];
    $scope.cabDate = null;
    $scope.isBudgetPanelOpen = false;

    $scope.travelBudgetText = "Travel Expenses";
    $scope.totalBudgetText = "Your Budget";
    $scope.minorBudgetText = "Minor Travel Expenses";
    $scope.totalBudget = 0;
    $scope.travelBudget = 0;
    $scope.minorBudget = 0;
    $scope.isTravelPanelDisable = false;
    $scope.altTrip = true;
    $scope.segmentHoverClass = "segment-hover";
    var defaultRouteData = null;
    var alternateRouteData = null;
    var isOtherTripClicked = false;
    var dateSet = null;
    var outOfBudgetFactor = 0.7;
    var minimumTimeSpentInCityInHours = 4;
    var travelData=null;
    var MINUTES_TO_MILLISECONDS = 60*1000;
    var HOURS_TO_MILLISECONDS = MINUTES_TO_MILLISECONDS*60;
    var DAYS_TO_MILLISECONDS = HOURS_TO_MILLISECONDS*24;

    $scope.pageSlide = function(){
        $scope.checked1=!$scope.checked1;
        $scope.checked2=!$scope.checked2;
    };

    $scope.showModes = function(){
        console.log("in show modes");
        $scope.checked1=true;
    };
    $scope.test = function(){
        console.log("in test function");
        if($scope.checked1)
        {
            $scope.checked1=false;
        }
    };

    function openPanel() {
        $timeout(function openTravelPanel() {
            $scope.isTravelPanelOpen = true;
            console.log('function timedout:'+$scope.isTravelPanelOpen);
        }, 400);
    }

    $scope.openTravelModesPanel = function(leg, clickEvent, index) {
        if($scope.isModeDetailsPanelOpen) {
            $scope.isModeDetailsPanelOpen = false;
        }
        $scope.isTravelModesPanelOpen = !$scope.isTravelModesPanelOpen;
        $scope.currentLeg = leg;
        $scope.currentLegIndex = index;
        console.log('currentLegIndex:'+index);
        $scope.routes = leg.routes;
        clickEvent.stopPropagation();
        //var travelPanel=angular.element(document.querySelector(".travel-panel"));
        //travelPanel.removeAttr('ng-click');
        //var travelPageSlide=angular.element(document.querySelector(".travel-pageslide"));
        //travelPageSlide.attr('ng-click','closeOtherPanels(1)');
    };

    $scope.openModeDetailsPanel = function(segment,route,routeIndex, clickEvent, custom) {
        $scope.currentSegment = segment;
        $scope.currentRoute = route;
        $scope.currentRouteIndex = routeIndex;
        $scope.isTrainClicked = false;
        $scope.isFlightClicked = false;
        $scope.isBusClicked = false;
        $scope.isCabOperatorClicked = false;
        $scope.isCabClicked = false;
        $scope.isDriveClicked = false;
        $scope.isTaxiClicked = false;
        $scope.isModeDetailsPanelOpen = !$scope.isModeDetailsPanelOpen;
        if(segment.kind == "train") {
            initializeVehicleDates(segment.trainData,segment.startTime);
            $scope.trains = segment.trainData;
            $scope.isTrainClicked = true;
        }
        else if(segment.kind == "flight") {
            initializeVehicleDates(segment.flightData,segment.startTime);
            $scope.flights = segment.flightData;
            $timeout(function() {
                $scope.isFlightClicked = true;
            }, 500);
        }
        else if(segment.kind == "bus")
        {
            initializeVehicleDates(segment.busData,segment.startTime);
            $scope.buses = segment.busData;
            $timeout(function() {
                $scope.isBusClicked = true;
            }, 500);
        }
        else if(segment.kind=="car"){
            if(segment.subkind != undefined && segment.subkind == "cab") {
                if(custom != undefined) {
                    if(custom == 'cabOperator') {
                        $scope.isTravelModesPanelOpen = false;
                        $scope.isCabOperatorClicked = true;
                        $scope.cabDetails = segment.CabDetails;
                        initializeCabDetailToggle(segment.CabDetails);
                    }
                    else if(custom == 'cabTimings') {
                        $scope.isCabClicked = true;
                        initializeCabDates(segment.startTime);
                    }
                }
            }
            if(segment.subkind=="taxi")
            {
                $scope.isTaxiClicked = true;
                if(custom == 'cabTimings'){
                    initializeCabDates(segment.startTime);
                }
            }
            if(segment.subkind == "car")
            {
                $scope.isDriveClicked = true;
                if(custom == 'cabTimings'){
                    initializeCabDates(segment.startTime);
                }
            }
        }

        clickEvent.stopPropagation();
    };

    $scope.getSourceCityFromLeg = function(){
        if($scope.currentLeg == null) {
            return null;
        }
        return $scope.currentLeg.places[0].name;
    };

    $scope.getDestinationCityFromLeg = function() {
        if($scope.currentLeg == null) {
            return null;
        }
        return $scope.currentLeg.places[1].name;
    };

    angular.element(window).ready(function () {
        var currentURL = $location.absUrl();
        var pathArray = currentURL.split('?');
        var destinations = getParameterByName('dsts').split(";");
        var originCity  =  getParameterByName('o');
        var citiesString = "";
        var cityIDsString = "";
        if((pathArray.length>1) && (destinations.length==1))
        {
            //only one destination
            $scope.isTravelPanelOpen = true;
            originCity = JSON.parse(originCity);
            destinations = JSON.parse(destinations);
            citiesString+="cities="+originCity.CityName+","+destinations.CityName+","+originCity.CityName;
            cityIDsString+="cityIDs="+originCity.CityID+","+destinations.CityID+","+originCity.CityName;
            getRoutes(citiesString,cityIDsString,pathArray);
        }
    });

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    $rootScope.$on('showTravelPanel', function onShowTravelPanel(event, data) {
        openPanel();
        $rootScope.$emit('gettingData');
        //Call showRoutes
        var orderedDestinationCities = orderedCities.getOrderedDestinationCities();
        var originCity = orderedCities.getOriginCity();
        var pathArray= orderedCities.getPathArray();
        var citiesString = "cities=";
        var cityIDsString = "cityIDs=";
        citiesString += originCity.CityName + ",";
        cityIDsString += originCity.CityID + ",";
        for(var i = 0; i < orderedDestinationCities.length; i++) {
            citiesString += orderedDestinationCities[i].CityName + ",";
            cityIDsString += orderedDestinationCities[i].CityID + ",";
        }
        citiesString += originCity.CityName;
        cityIDsString += originCity.CityID;
        getRoutes(citiesString,cityIDsString,pathArray);
    });

    function getRoutes(citiesString,cityIDsString,pathArray)
    {
        var queryString = "/showRoutes?"+citiesString+"&"+cityIDsString+"&"+pathArray[1];
        $http.get(queryString).success(function(data,status){
            $rootScope.$emit('dataLoaded');
            $scope.isTravelPanelDataHidden = false;
            //console.log("showRoutes response:"+JSON.stringify(data));
            if(data.tripNotPossible != undefined && data.tripNotPossible == 1) {
                console.log('Page NOT FOUND');
            }
            else {
                dateSet = data.dateSet;

                if(data.withoutTaxiRome2rioData==null)
                {
                    defaultRouteData = data.withTaxiRome2rioData;
                    alternateRouteData = null;
                }
                else if(data.withTaxiRome2rioData==null)
                {
                    defaultRouteData = data.withoutTaxiRome2rioData;
                    alternateRouteData = null;
                }
                else{
                    if(data.withoutTaxiRome2rioData.isMajorDefault == 1) {
                        defaultRouteData = data.withoutTaxiRome2rioData;
                        alternateRouteData = data.withTaxiRome2rioData;
                    }
                    else {
                        defaultRouteData = data.withTaxiRome2rioData;
                        alternateRouteData = data.withoutTaxiRome2rioData;
                    }
                }
                getAttributesFromRouteData(defaultRouteData);
                showCurrentRouteOnMap();
                showBudget(data.userTotalbudget);
                $scope.isBudgetPanelOpen = true;
                travelData  = data;
            }
        });
    }

    function getAttributesFromRouteData(routeData) {
        var rome2rioData = routeData.rome2RioData;
        var leg = null;
        for(var legIndex = 0; legIndex < rome2rioData.length; legIndex++) {
            leg = rome2rioData[legIndex];
            for(var routeIndex = 0; routeIndex < leg.routes.length; routeIndex++) {
                var route = leg.routes[routeIndex];
                var majorIndex = 0;
                for(var segmentIndex = 0; segmentIndex < route.segments.length; segmentIndex++) {
                    var segment = route.segments[segmentIndex];
                    if(segment.isMajor == 1) {
                        segment.majorIndex = majorIndex;
                        majorIndex++;
                    }
                }
                route.majorCount = majorIndex - 1;
                if(route.isDefault != undefined && route.isDefault == 1) {
                    leg.defaultRoute = route;
                    leg.defaultRouteIndex = routeIndex;
                }
            }
        }
        $scope.legs = routeData.rome2RioData;
    }

    function showCurrentRouteOnMap() {
        var destinations = getParameterByName('dsts').split(";");
        var originCity  =  getParameterByName('o');
        if(destinations.length==1) {
            //need to plot markers if only one destination
            originCity = JSON.parse(originCity);
            destinations = JSON.parse(destinations);
            var data = {
                origin:originCity,
                destination:destinations
            };
            $rootScope.$emit('plotMarkers',data);
        }
        $rootScope.$emit('removeSegments');
        for(var legIndex in $scope.legs) {
            for(var segmentIndex in $scope.legs[legIndex].defaultRoute.segments) {
                var segment = $scope.legs[legIndex].defaultRoute.segments[segmentIndex];
                $rootScope.$emit('showSegment', segment);
            }
        }
    }

    function showBudget(userBudget){
        $scope.totalBudget = userBudget;
        alertAndSetTravelBudget();
    }

    function alertAndSetTravelBudget() {
        var majorBudget = 0;
        var minorBudget = 0;
        var endTime = 0;
        var timeOfReachingCity = 0;
        var overlapCity = null;
        var isOverlap = false;
        var isInsufficientTime = false;
        var insufficientTimeCity = null;
        for(var legIndex = 0; legIndex < $scope.legs.length; legIndex++) {
            var segment = $scope.legs[legIndex].defaultRoute.segments;
            for(var segmentIndex = 0; segmentIndex < segment.length; segmentIndex ++) {
                if(segment[segmentIndex].isMajor == 1) {
                    majorBudget += parseInt(segment[segmentIndex].indicativePrice.price, 10);
                    if(segment[segmentIndex].kind == "train" || segment[segmentIndex].kind == "bus") {
                        minorBudget += 300;
                    }
                    segment[segmentIndex].startTime = new Date(segment[segmentIndex].startTime);
                    var startTime = segment[segmentIndex].startTime.getTime();
                    var currentEndTime = new Date(segment[segmentIndex].endTime).getTime();
                    if(endTime > startTime) {
                        isOverlap = true;
                        overlapCity = $scope.legs[legIndex].defaultRoute.stops[segmentIndex].name;
                    }
                    console.log('endTime:'+endTime+",startTime:"+startTime);
                    endTime = currentEndTime;

                    if(segment[segmentIndex].majorIndex == 0) {
                        if((startTime - timeOfReachingCity) / (60 * 60000) < minimumTimeSpentInCityInHours) {
                            isInsufficientTime = true;
                            insufficientTimeCity = $scope.legs[legIndex].places[0].name;
                        }
                    }
                    if(segment[segmentIndex].majorIndex == $scope.legs[legIndex].defaultRoute.majorCount) {
                        timeOfReachingCity = currentEndTime;
                    }
                }
                else {
                    minorBudget += parseInt(segment[segmentIndex].indicativePrice.price, 10);
                }
                console.log('major budget:'+majorBudget);
                console.log('minor budget:'+minorBudget);
            }
        }
        $scope.travelBudget = majorBudget;
        $scope.minorBudget = minorBudget;
        if($scope.travelBudget+$scope.minorBudget>$scope.totalBudget*outOfBudgetFactor)
        {
            if($scope.travelBudget+$scope.minorBudget>$scope.totalBudget)
            {
                $rootScope.$emit('showRecommendation','budgetOutOfLimit');
            }
            else
            {
                $rootScope.$emit('showRecommendation','budgetExceeds');
            }
        }
        else
        {
            $rootScope.$emit('hideRecommendation','budget');
        }
        console.log('overlapCity:'+overlapCity);
        if(isOverlap){
            $rootScope.$emit('showRecommendation','timeOverlap',overlapCity);
        }
        else if(isInsufficientTime) {
            $rootScope.$emit('showRecommendation','timeExceeds',insufficientTimeCity);
        }
        else {
            $rootScope.$emit('hideRecommendation','time');
        }
    }

    $scope.getSourceCityName = function(index) {
        var leg = $scope.legs[index];
        return leg.places[0].name;
    };

    $scope.getDestinationCityName = function(index) {
        var leg = $scope.legs[index];
        return leg.places[1].name;
    };

    $scope.getDefaultRoute = function(index) {
        var leg = $scope.legs[index];
        for(var i = 0; i < leg.routes.length; i++) {
            if(leg.routes[i].isDefault != undefined && leg.routes[i].isDefault == 1) {
                return leg.routes[i];
            }
        }
    };

    $scope.getModeClass = function(route,segment){
        if(route.isDefault!=undefined && route.isDefault ==1)
        {
            if(route.majorCount>0 && segment.isMajor==1 && (segment.startTime==undefined||segment.startTime==null))
            {
                return "segment-warning";
            }
            return "default-route";
        }
        return "";
    };

    $scope.onTaxiDetailsLeave = function(){
        $scope.segmentHoverClass = "segment-hover";
    };

    $scope.onTaxiDetailsHover = function(){
        $scope.segmentHoverClass = "";
    };

    $scope.getIconClass = function(route)
    {
        if(route.isDefault!=undefined && route.isDefault ==1)
        {
            return "icon-default icon-hover";
        }
        return "";
    };

    $scope.getModeIcon = function(segment) {
        if(segment.kind == "flight") {
            return "glyphicons-39-airplane";
        }
        else if(segment.kind == "car") {
            return "glyphicons-6-car";
        }
        else if(segment.kind == "train") {
            return "glyphicons-15-train";
        }
        else if(segment.kind == "bus") {
            return "glyphicons-32-bus";
        }
        else {
            return "glyphicon-asterisk";
        }
    };

    $scope.getStopName = function(index, route) {
        return route.stops[index + 1].name;
    };

    $scope.getDateFormatted = function(segment) {
        return segment.startTime;
    };

    $scope.getDuration = function(segment) {
        var duration = parseInt(segment.duration, 10);
        var hours = parseInt(duration/60, 10);
        var minutes = duration%60;
        var returnString = "";
        if(hours > 0) {
            returnString += hours + " hrs ";
        }
        if(minutes > 0) {
            returnString +=  minutes + " min";
        }
        return returnString;
    };

    $scope.getPrice = function(segment) {
        return segment.indicativePrice.price;
    };

    $scope.closeOtherPanels =function(panelNo){
        if(panelNo==1){
            //travel panel clicked
            if($scope.isTravelModesPanelOpen){
                $scope.isTravelModesPanelOpen=false;
            }
            if($scope.isModeDetailsPanelOpen){
                $scope.isModeDetailsPanelOpen=false;
            }
        }
        else if(panelNo==2){
            //travel modes panel clicked
            if($scope.isModeDetailsPanelOpen) {
                $scope.isModeDetailsPanelOpen = false;
            }
        }
    };

    $scope.getTransparentClass = function(panelNo){
        if(panelNo==1)
        {
            if($scope.isModeDetailsPanelOpen||$scope.isTravelModesPanelOpen)
            {
                return "panel-transparent";
            }
            else
            {
                return "";
            }
        }
        else if(panelNo ==2)
        {
            if($scope.isModeDetailsPanelOpen)
            {
                return "panel-transparent";
            }
            else
            {
                return "";
            }
        }
    };

    $scope.isShowOtherTrip = function(){
        if(alternateRouteData!=null)
        {
            return true;
        }
        return false;
    };

    $scope.showOtherTrip = function() {
        $scope.isTripPanelSetCollapsed = true;
        isOtherTripClicked = !isOtherTripClicked;
        $timeout(function openCollapsedPanelSet(){
            var swapRouteData = alternateRouteData;
            alternateRouteData = defaultRouteData;
            defaultRouteData = swapRouteData;
            getAttributesFromRouteData(defaultRouteData);
            $scope.isTripPanelSetCollapsed = false;
            showCurrentRouteOnMap();
            alertAndSetTravelBudget();
        },1000);
    };

    $scope.getOtherTripText = function(){
        console.log("getOtherTripText Called");
        console.log("isOtherTripClicked"+isOtherTripClicked);
        if(defaultRouteData.isCabTrip!=undefined && defaultRouteData.isCabTrip==1)
        {
            if(isOtherTripClicked)
            {
                $scope.altTrip = false;
                return "Back To Multi-Mode Travel";
            }
            else
            {
                $scope.altTrip = true;
                return "Check Out Multi-Mode Travel For This Trip";
            }
        }
        else
        {
            if(isOtherTripClicked)
            {
                $scope.altTrip = false;
                return "Back To MultiCityTaxi Travel";
            }
            else
            {
                $scope.altTrip = true;
                return "Check Out MultiCityTaxi Travel For This Trip";
            }
        }
    };

    $scope.isSegmentShown = function(segment,leg) {
        if( segment.majorIndex == leg.defaultRoute.majorCount)
        {
            return true;
        }
        //if(segment.kind == 'car') {
        //    if(segment.subkind != undefined && segment.subkind == "cab") {
        //        if(segment.startCabTrip != undefined && segment.startCabTrip == 1) {
        //            return true;
        //        }
        //        else {
        //            //hack
        //            return true;
        //            //return false;
        //        }
        //    }
        //}
        return true;
    };

    $scope.isViaShown = function(segment) {
        if(segment.kind == 'car') {
            if(segment.subkind != undefined && segment.subkind == "cab") {
                if(segment.endCabTrip != undefined && segment.endCabTrip == 1) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        return true;
    };

    $scope.isPriceShown = function(segment){
        if(segment.kind == 'car') {
            if(segment.subkind != undefined && segment.subkind == "cab") {
               return false;
            }
        }
        return true;
    };

    $scope.isPanelFooterShown = function(segment){
        if(segment.kind == 'car') {
            if(segment.subkind != undefined && segment.subkind == "cab") {
                if(segment.endCabTrip != undefined && segment.endCabTrip == 1) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        return false;
    };

    $scope.getStartCityForTaxi = function(segment){
      return segment.carLegDetails[0];
    };

    $scope.getEndCityForTaxi = function(segment){
        return segment.endCity;
    };

    function simpleKeys (original) {
        return Object.keys(original).reduce(function (obj, key) {
            obj[key] = typeof original[key] === 'object' ? '{ ... }' : original[key];
            return obj;
        }, {});
    }

    $scope.getPanelClass = function(vehicle) {
        if(vehicle.isFinal != undefined && vehicle.isFinal == 1) {
            return "panel-success";
        }
        return "panel-info";
    };

    $scope.addToTrip = function(vehicle,$index,$event) {
        var allSegmentSelected = false;
        if($scope.vehicleDate[$index].dt == null) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.vehicleDate[$index].opened = true;
        }
        else {
            var startTime=new Date($scope.vehicleDate[$index].dt);
            var hours=parseInt(vehicle.OriginDepartureTime.split(":")[0], 10);
            var minutes = parseInt(vehicle.OriginDepartureTime.split(":")[1], 10);
            startTime.setHours(hours);
            startTime.setMinutes(minutes);
            var duration= getDurationFromStartEndTime(vehicle.OriginDepartureTime,vehicle.DestArrivalTime,vehicle.OriginDay,vehicle.DestDay);

            var vehicles;
            if($scope.isTrainClicked) {
                vehicles = $scope.trains;
            }
            else if($scope.isFlightClicked) {
                vehicles = $scope.flights;
            }
            else if($scope.isCabClicked){
                vehicles = $scope.buses;
            }

            if(!(vehicle.isFinal!=undefined && vehicle.isFinal==1))
            {
                for(var vehicleIndex in vehicles)
                {
                    console.log('vehicle:'+JSON.stringify(vehicleIndex));
                    if(vehicles[vehicleIndex].isFinal!=undefined && (vehicles[vehicleIndex].isFinal==1))
                    {
                        vehicles[vehicleIndex].isFinal = 0;
                    }
                }

                //set isDefault and isFinal to 0 for existed default route
                clearIsDefaultAndIsFinal();
                vehicle.isFinal =1;
                if(vehicle.fare != undefined) {
                    $scope.currentRoute.indicativePrice.price = vehicle.fare;
                }
                $scope.currentLeg.defaultRoute = $scope.currentRoute;
                $scope.currentRoute.isDefault =1;
            }

            $scope.currentSegment.startTime = startTime;
            $scope.currentSegment.endTime = addMinutes(startTime,duration);
            $scope.currentSegment.duration = duration;

            if(vehicle.fare != undefined) {
                $scope.currentSegment.indicativePrice.price = vehicle.fare;
            }

            vehicle.date = startTime;
            allSegmentSelected = isAllSegmentsSelected();
            if( !allSegmentSelected)
            {
                $scope.isModeDetailsPanelOpen = false;
                $scope.isTravelPanelDisable = true;
            }
            else {
                $scope.isTravelModesPanelOpen = false;
                $scope.isModeDetailsPanelOpen = false;
                $scope.isTravelPanelDisable = false;
            }
        }
        if(allSegmentSelected)
        {
            showCurrentRouteOnMap();
            alertAndSetTravelBudget();
        }
    };

    $scope.addCabToTrip = function($event){

        var cabStartTime = $scope.cabDate.dt;
        if(cabStartTime == null||cabStartTime==undefined) {
            $scope.openCabDate($event);
        }
        else {
            //set isDefault and isFinal to 0 for existed default route
            clearIsDefaultAndIsFinal();
            $scope.currentLeg.defaultRoute = $scope.currentRoute;
            $scope.currentRoute.isDefault =1;
            $scope.currentSegment.startTime = cabStartTime;
            $scope.currentSegment.endTime = addMinutes(cabStartTime,$scope.currentSegment.duration);
            console.log($scope.currentSegment.endTime);
            var allSegmentSelected = isAllSegmentsSelected();
            if( !allSegmentSelected)
            {
                $scope.isModeDetailsPanelOpen = false;
                $scope.isTravelPanelDisable = true;
            }
            else {
                $scope.isTravelModesPanelOpen = false;
                $scope.isModeDetailsPanelOpen = false;
                $scope.isTravelPanelDisable = false;
                showCurrentRouteOnMap();
                alertAndSetTravelBudget();
            }
        }
    };

    $scope.getAddButtonClass = function(vehicle) {
        if(vehicle!=undefined && vehicle.isFinal != undefined && vehicle.isFinal == 1) {
            return "btn-success";
        }
        return "btn-primary";
    };

    $scope.getAddButtonText = function(vehicle) {
        if(vehicle.isFinal != undefined && vehicle.isFinal == 1) {
            return "Added";
        }
        return "Add";
    };

    $scope.getAddButtonClassForTaxiOrDrive = function() {
        if(  $scope.currentRoute.isDefault ==1)
        {
            return "btn-success";
        }
        return "btn-primary";
    };

    $scope.getAddButtonTextForTaxiOrDrive = function(){
        if(  $scope.currentRoute.isDefault ==1)
        {
            return "Added";
        }
        return "Add";
    };

    $scope.getNthDay = function(vehicle) {
        var destinationDay = vehicle.DestDay;
        if(destinationDay == "1") {
            return "Same Day";
        }
        else if(destinationDay == "2") {
            return "Next Day";
        }
        else {
            return "3rd Day";
        }
    };

    function isAllSegmentsSelected()
    {
        var currentDefaultRoute = $scope.currentRoute;
        if(currentDefaultRoute.majorCount>0)
        {
            //more than one major segments
            var segments = currentDefaultRoute.segments;
            for(var segmentIndex = 0;segmentIndex<segments.length;segmentIndex++)
            {
                if(segments[segmentIndex].isMajor==1 && (segments[segmentIndex].startTime==undefined||segments[segmentIndex].startTime==null))
                {
                    return false;
                }
            }
        }
        return true;
    }

    function clearIsDefaultAndIsFinal(){

        for(var routeIndex in $scope.currentLeg.routes)
        {
            if($scope.currentRouteIndex!=routeIndex)//not for current route
            {
                if($scope.currentLeg.routes[routeIndex].isDefault!= undefined && ($scope.currentLeg.routes[routeIndex].isDefault==1))
                {
                    $scope.currentLeg.routes[routeIndex].isDefault = 0;
                    var segments = $scope.currentLeg.routes[routeIndex].segments;
                    for(var segmentIndex in segments)
                    {
                        if(segments[segmentIndex].kind!=undefined && (segments[segmentIndex].isMajor ==1)&&(segments[segmentIndex].kind=="flight"))
                        {
                            segments[segmentIndex].startTime = null;
                            segments[segmentIndex].endTime = null;
                            for(var flightIndex in segments[segmentIndex].flightData)
                            {
                                var flight = segments[segmentIndex].flightData[flightIndex];
                                if(flight.isFinal!=undefined && flight.isFinal==1)
                                {
                                    flight.isFinal = 0;
                                }
                            }
                        }
                        if(segments[segmentIndex].kind!=undefined && (segments[segmentIndex].isMajor ==1)&&(segments[segmentIndex].kind=="train"))
                        {
                            segments[segmentIndex].startTime = null;
                            segments[segmentIndex].endTime = null;
                            for(var trainIndex in segments[segmentIndex].trainData)
                            {
                                var train = segments[segmentIndex].trainData[trainIndex];
                                if(train.isFinal!=undefined && train.isFinal==1)
                                {
                                    train.isFinal = 0;
                                }
                            }
                        }
                        if(segments[segmentIndex].kind!=undefined && (segments[segmentIndex].isMajor ==1)&&(segments[segmentIndex].kind=="bus"))
                        {
                            segments[segmentIndex].startTime = null;
                            segments[segmentIndex].endTime = null;
                            for(var busIndex in segments[segmentIndex].busData)
                            {
                                var bus = segments[segmentIndex].busData[busIndex];
                                if(bus.isFinal!=undefined && bus.isFinal==1)
                                {
                                    bus.isFinal = 0;
                                }
                            }
                        }
                        if(segments[segmentIndex].kind!=undefined && (segments[segmentIndex].isMajor ==1)&&(segments[segmentIndex].subkind=="taxi"||segments[segmentIndex].subkind=="car"))
                        {
                            segments[segmentIndex].startTime = null;
                            segments[segmentIndex].endTime = null;
                        }
                    }
                }
            }
        }
    }

    function getDurationFromStartEndTime(startTime,endTime,originDay,destDay){
        var startHours=parseInt(startTime.split(":")[0], 10);
        var startMins=parseInt(startTime.split(":")[1], 10);
        var endHours=parseInt(endTime.split(":")[0], 10);
        var endMins=parseInt(endTime.split(":")[1], 10);
        var startTimeInMins = startMins+ startHours*60;
        var endTimeInMins = endMins + endHours*60;

        console.log("startHours:"+startHours+","+"startMins:"+startMins+","+"endHours:"+endHours+","+"startTimeMins:"+startTimeInMins+","+"endTimeInMIns:"+endTimeInMins);

        var duration = 0;
        if(originDay==destDay)
        {
            duration = endTimeInMins - startTimeInMins;
        }
        else
        {
            duration = (destDay-originDay-1)*24*60 + endTimeInMins+(24*60-startTimeInMins);
        }
        return duration;
    }

    function addMinutes(date, minutes) {
        return new Date(date.getTime() + minutes*60000);
    }

    $scope.getRouteClass = function(segment) {
        if(segment.kind == "car") {
            if(segment.subkind != undefined && segment.subkind == "cab"){
                return "cab-route";
            }
        }
        return "";
    };

    function initializeCabDetailToggle(cabDetails) {
        $scope.cabDetailToggle = [];
        for(var cabDetailIndex in cabDetails) {
            var cabDetailToggleObject  = {
                "open": cabDetails[cabDetailIndex].isFinal != undefined && cabDetails[cabDetailIndex].isFinal == 1
            };
            $scope.cabDetailToggle.push(cabDetailToggleObject);
        }
    }

    $scope.getAccordionHeadingClass = function(cabDetail)
    {
        if(cabDetail.isFinal!=undefined && cabDetail.isFinal==1)
        {
            return "final-cab-segment";
        }
        return "";
    };

    $scope.changeCabOperator=function(cabDetail,operator,$event)
    {
        $event.preventDefault();
        $event.stopPropagation();
        for(var cabDetailIndex in $scope.cabDetails)
        {
            if($scope.cabDetails[cabDetailIndex].isFinal!=undefined && $scope.cabDetails[cabDetailIndex].isFinal==1)
            {
                $scope.cabDetails[cabDetailIndex].isFinal=0;
                for(var cabOperatorIndex in $scope.cabDetails[cabDetailIndex].OperatorPrices)
                {
                    var operatorPrice=$scope.cabDetails[cabDetailIndex].OperatorPrices[cabOperatorIndex];
                    if(operatorPrice.isFinal!=undefined && operatorPrice.isFinal==1)
                    {
                        operatorPrice.isFinal=0;
                    }
                }
            }
        }
        cabDetail.isFinal =1;
        operator.isFinal=1;
        $scope.currentSegment.indicativePrice.price = operator.ActualCabPrice;
        $scope.isTravelModesPanelOpen = false;
        $scope.isModeDetailsPanelOpen = false;
        alertAndSetTravelBudget();
    };
    /*
     * This is the part dealing with datepicker
     */

    function initializeVehicleDates(vehicleData, startTime){
        $scope.vehicleDate=[];
        for(var i = 0; i < vehicleData.length; i++){
            var vehicleDate;
            if(vehicleData[i].dateLimits.length > 1) {
                vehicleData[i].dateLimits.sort(getTimeDifference);
                if(vehicleData[i].isFinal != undefined && vehicleData[i].isFinal == 1){
                    vehicleDate = {
                        dt:startTime,
                        opened:false,
                        disabled:false,
                        minDate:vehicleData[i].dateLimits[0],
                        maxDate:vehicleData[i].dateLimits[vehicleData[i].dateLimits.length-1]
                    };
                }
                else
                {
                    vehicleDate = {
                        dt:null,
                        opened:false,
                        disabled:false,
                        minDate:vehicleData[i].dateLimits[0],
                        maxDate:vehicleData[i].dateLimits[vehicleData[i].dateLimits.length-1]
                    };
                }
            }
            else if(vehicleData[i].dateLimits.length == 1) {
                vehicleDate = {
                    dt:vehicleData[i].dateLimits[0],
                    opened:false,
                    disabled:true,
                    minDate:vehicleData[i].dateLimits[0],
                    maxDate:vehicleData[i].dateLimits[0]
                };
            }
            else {
                vehicleDate = {
                    dt:null,
                    opened:false,
                    disabled:false,
                    minDate:null,
                    maxDate:null
                };
            }
            $scope.vehicleDate.push(vehicleDate);
        }
        function getTimeDifference(a,b) {
            a = new Date(a);
            b = new Date(b);
            return a.getTime() - b.getTime();
        }
    }

    function initializeCabDates(startTime){
        var minDate = new Date(dateSet.dateStart[$scope.currentLegIndex]);
        var maxDate = new Date(dateSet.dateEnd[$scope.currentLegIndex]);
        var dt = null;
        var disabled = false;
        minDate.setHours(0,0,0,0);
        maxDate.setHours(0,0,0,0);
        if (maxDate.getTime() - minDate.getTime() == 0) {
            disabled = true;
        }

        if($scope.currentRoute.isDefault != undefined && $scope.currentRoute.isDefault == 1) {
            dt = startTime;
        }
        $scope.cabDate = {
            dt:dt,
            opened:false,
            disabled:disabled,
            minDate:minDate,
            maxDate:maxDate
        };
    }
    $scope.openCabDate=function($event){
        $event.preventDefault();
        $event.stopPropagation();
        $scope.cabDate.opened = true;
    };

    $scope.vehicleDate=[];

    $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
    };

    $scope.toggleMin();

    $scope.open = function($event,index) {
        $event.preventDefault();
        $event.stopPropagation();
        for(var i = 0; i < $scope.vehicleDate.length; i++) {
            if(i == index) {
                $scope.vehicleDate[i].opened = true;
            }
            else {
                $scope.vehicleDate[i].opened = false;
            }
        }
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[1];

    $scope.disabled = function(date, mode, vehicle) {
        var currentDay = date.getDay() + 1 + '';
        if(vehicle.DaysOfTravel=="0")
        {
            return false;
        }
        var isRunningOnThatDay = vehicle.DaysOfTravel.indexOf(currentDay) != -1;
        return ( mode === 'day' && ( !isRunningOnThatDay ) );
    };

    $scope.getHours = function(){
        if($scope.cabDate.dt == null)
        {
            return "00";
        }
        else
        {
            if($scope.cabDate.dt.getHours()<10)
            {
                return "0"+$scope.cabDate.dt.getHours();
            }
            else
            {
                return $scope.cabDate.dt.getHours();
            }
        }
    };

    $scope.getMins = function(){
        if($scope.cabDate.dt == null)
        {
            return "00";
        }
        else
        {
            if( $scope.cabDate.dt.getMinutes()<10)
            {
                return "0"+$scope.cabDate.dt.getMinutes();
            }
            else
            {
                return $scope.cabDate.dt.getMinutes();
            }
        }
    };

    $scope.incrementHours = function($event){
        if($scope.cabDate.dt==null)
        {
            $scope.openCabDate($event);
        }
        else
        {
            var increasedDate = new Date($scope.cabDate.dt.getTime() + 1*HOURS_TO_MILLISECONDS);
            if(increasedDate<=new Date($scope.cabDate.maxDate.getTime() + 23*HOURS_TO_MILLISECONDS)) {
                $scope.cabDate.dt = increasedDate;
            }
        }
    };

    $scope.incrementMinutes = function($event){
        if($scope.cabDate.dt==null)
        {
            $scope.openCabDate($event);
        }
        else
        {
            var increasedDate = new Date($scope.cabDate.dt.getTime() + 15*60*1000);
            if(increasedDate<=new Date($scope.cabDate.maxDate.getTime() + 23*HOURS_TO_MILLISECONDS + 45*60*1000)) {
                $scope.cabDate.dt = increasedDate;
            }
        }
    };

    $scope.decrementHours = function($event){
        if($scope.cabDate.dt==null)
        {
            $scope.openCabDate($event);
        }
        else {
            var decreasedDate = new Date($scope.cabDate.dt.getTime() - 1 * HOURS_TO_MILLISECONDS);
            if (decreasedDate >= $scope.cabDate.minDate) {
                $scope.cabDate.dt = decreasedDate;
            }
        }
    };

    $scope.decrementMinutes = function($event){
        if($scope.cabDate.dt==null)
        {
            $scope.openCabDate($event);
        }
        else {
            var decreasedDate = new Date($scope.cabDate.dt.getTime() - 15 * 60 * 1000);
            if (decreasedDate >= $scope.cabDate.minDate) {
                $scope.cabDate.dt = decreasedDate;
            }
        }
    };

    /**
     * Submit Button
     */
    $rootScope.$on('submitTravel',function onSubmitTravel(event, data)
    {
        console.log("submitTravel");
        console.log(defaultRouteData);
        if(defaultRouteData!=null)
        {
            defaultRouteData.isMajorDefault=1;
        }
        if(alternateRouteData!=null){
            alternateRouteData.isMajorDefault = 0;
        }
        if(travelData.withTaxiRome2rioData!=null && travelData.withTaxiRome2rioData.isMajorDefault==1)
        {
            delete travelData.withoutTaxiRome2rioData;
        }
        else
        {
            delete travelData.withTaxiRome2rioData;
        }
        travelData.travelBudget = $scope.travelBudget;
        travelData.minorTravelBudget = $scope.minorBudget;
        travelData = JSON.stringify(travelData);
        var formElement=angular.element('<form>');
        formElement.attr("action","/"+'showPlacesAndHotels');
        formElement.attr("method","POST");
        var d=angular.element("<input type='hidden'/>");
        d.attr("name","travelData");
        d.attr("value",travelData);
        formElement.append(d);
        var body=angular.element(document.querySelectorAll("body"));
        body.append(formElement);
        formElement.submit();
    });

    //$scope.submitTravel = function(){
    //    console.log("submitTravel");
    //    defaultRouteData.isMajorDefault=1;
    //    alternateRouteData.isMajorDefault=0;
    //    travelData.travelBudget = $scope.travelBudget;
    //    travelData.minorTravelBudget = $scope.minorBudget;
    //    travelData = JSON.stringify(travelData);
    //    var formElement=angular.element('<form\>');
    //    formElement.attr("action","/"+'showPlacesAndHotels');
    //    formElement.attr("method","POST");
    //    var d=angular.element("<input type='hidden'/>");
    //    d.attr("name","travelData");
    //    d.attr("value",travelData);
    //    formElement.append(d);
    //    var body=angular.element(document.querySelectorAll("body"));
    //    body.append(formElement);
    //    formElement.submit();
    //};
}]);

/**
 * Created by rkapoor on 26/02/15.
 */
routesModule.controller('suryaController', ['$scope', '$rootScope', '$http', '$q', '$location', 'orderedCities', function($scope, $rootScope, $http, $q, $location, orderedCities) {

    $scope.reorderPanel=false;
    $scope.reorderList=true;
    $scope.draggableObjects = [];

    var pathArray = [];
    var orderComparisonFactor = 1.4;
    $rootScope.$on('orderReceived', function onOrderReceived(event, data) {
        $scope.draggableObjects = orderedCities.getOrderedDestinationCities();
        $scope.originCity=orderedCities.getOriginCity();
        $scope.reorderList=false;
        $rootScope.$emit("plotCities");
        $rootScope.$emit('dataLoaded');
    });

    $scope.onDropComplete = function (index, obj, evt) {
        var otherObj = $scope.draggableObjects[index];
        var otherIndex = $scope.draggableObjects.indexOf(obj);
        $scope.draggableObjects[index] = obj;
        $scope.draggableObjects[otherIndex] = otherObj;

        var currentOrderWeight = 0;
        var originCityID=$scope.originCity.CityID;
        var weightArray=orderedCities.getWeightArray();
        var cityIDs = orderedCities.getCityIDs();
        var destinationsLength=$scope.draggableObjects.length;
        currentOrderWeight+=weightArray[cityIDs.indexOf(originCityID)][cityIDs.indexOf($scope.draggableObjects[0].CityID)];
        for(var i=1;i<destinationsLength;i++)
        {
            var cityIDStart=$scope.draggableObjects[i-1].CityID;
            var cityIDEnd=$scope.draggableObjects[i].CityID;
            var startIndex=cityIDs.indexOf(cityIDStart);
            var endIndex=cityIDs.indexOf(cityIDEnd);
            currentOrderWeight+=weightArray[startIndex][endIndex];
        }
         currentOrderWeight+=weightArray[cityIDs.indexOf($scope.draggableObjects[destinationsLength-1].CityID)][cityIDs.indexOf(originCityID)];
         if(orderedCities.getMinimumWeight()*orderComparisonFactor<currentOrderWeight)
         {
            $rootScope.$emit('showRecommendation','inEfficientOrder');
         }
         else
         {
            $rootScope.$emit('hideRecommendation','order');
         }

        $rootScope.$emit('plotCities');
    };

    $rootScope.$on('showRoutes',function onShowRoutes(event,data){
        $scope.reorderPanel = false;
        $rootScope.$emit('showTravelPanel');
    });

    angular.element(window).ready(function () {
        var currentURL = $location.absUrl();
        //console.log('url:'+currentURL);
        pathArray = currentURL.split('?');
        var destinations = getParameterByName('dsts').split(";");
        if((pathArray.length>1) && (destinations.length>1)){
            $scope.reorderPanel = true;
            $http.get('/getOptimizeOrder?'+pathArray[1]).success(function(data,status){
                    orderedCities.setOrderedDestinationCities(data.trip);
                    orderedCities.setOriginCity(data.origin);
                    orderedCities.setWeightArray(data.weight);
                    orderedCities.setMinimumWeight(data.minWeight);
                    orderedCities.setPathArray(pathArray);
                    orderedCities.setCityIDs(data.cityIDs);
                    $rootScope.$emit('orderReceived');
                }
            );
        }
        else if((pathArray.length>1) && (destinations.length==1))
        {
            //will be taken care by sarathi
        }
        else {
            console.log('Page NOT FOUND');
        }
    });

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
}]);

/**
 * Created by rkapoor on 01/05/15.
 */
var routesModule;
routesModule.controller("indraController", ['$scope', '$rootScope','$location', function($scope, $rootScope,$location) {
    "use strict";
    $scope.isHomeShown = false;
    $scope.isHowItWorksShown = false;
    $scope.isLogInShown = false;
    $scope.isSaveShown = true;
    $scope.isBudgetPercentShown = false;
    $scope.isSignUpShown = false;
    $scope.saveText = "CONTINUE";
    $scope.budgetPercent = 0;
    $scope.submitFunctionName = "";
    var isReorder = true;

    $scope.submitPage = function(){
        var currentURL = $location.absUrl();
        var pathArray = currentURL.split("?");
        var destinations = getParameterByName("dsts").split(";");
        if(pathArray.length>1)
        {
            if(destinations.length==1)
            {
                $rootScope.$emit("submitTravel");
            }
            else if(destinations.length>1)
            {
                console.log("length>1");
                if(isReorder)
                {
                    console.log("reorder true");
                    $rootScope.$emit("showRoutes");
                    isReorder = false;
                }
                else
                {
                    console.log("reorder false");
                    $rootScope.$emit("submitTravel");
                }
            }
        }
    };

    $scope.getSubmitFunction = function(){
        return $scope.submitFunctionName;
    };

    //$rootScope.$on('showBudget',function onShowBudget(event,data){
    //    $scope.budgetPercent = data;
    //    $scope.isBudgetPercentShown = true;
    //});

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
}]);


/**
 * Created by rkapoor on 09/02/15.
 */
routesModule.service('orderedCities', function () {
    var orderedDestinationCities = [];
    var originCity = null;
    var weightArray = [];
    var minimumWeight = 0;
    var pathArray=[];
    var cityIDs=[];

    return {
        getOrderedDestinationCities: function() {
            return orderedDestinationCities;
        },
        getOriginCity: function() {
            return originCity;
        },
        getWeightArray: function() {
            return weightArray;
        },
        getMinimumWeight: function() {
            return minimumWeight;
        },
        getPathArray: function(){
            return pathArray;
        },
        getCityIDs : function(){
            return cityIDs;
        },
        setOrderedDestinationCities: function(orderedCities) {
            orderedDestinationCities = orderedCities;
        },
        setOriginCity: function(origin) {
            originCity = origin;
        },
        setWeightArray: function(weights) {
            weightArray = weights;
        },
        setMinimumWeight: function(minWeight) {
            minimumWeight = minWeight;
        },
        setPathArray: function(path){
            pathArray = path;
        },
        setCityIDs: function(ID){
            cityIDs = ID;
        }
    };
});


/**
 * Created by rajat on 5/7/2015.
 */
routesModule.filter('titleCase', function() {
        return function(input) {
            input = input || '';
            return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        };
    });

/**
 * Created by rajat on 5/7/2015.
 */
routesModule.filter('formatTime', function() {
    return function(input) {
        if(input.length!=8)
        {
            return input;
        }
        return input.substring(0,5);
    };
});

var pageslideDirective = angular.module("pageslide-directive", []);

pageslideDirective.directive('pageslide', [
    function (){
        var defaults = {};

        /* Return directive definition object */

        return {
            restrict: "EA",
            replace: false,
            transclude: false,
            scope: {
                psOpen: "=?",
                psAutoClose: "=?"
            },
            link: function ($scope, el, attrs) {
                /* Inspect */
                //console.log($scope);
                //console.log(el);
                //console.log(attrs);

                /* parameters */
                var param = {};

                param.side = attrs.psSide || 'right';
                param.speed = attrs.psSpeed || '0.5';
                param.size = attrs.psSize || '300px';
                param.zindex = attrs.psZindex || 1000;
                param.className = attrs.psClass || 'ng-pageslide';

                /* DOM manipulation */
                var content = null;
                var slider = null;

                if (!attrs.href && el.children() && el.children().length) {
                    content = el.children()[0];
                } else {

                    var targetId = (attrs.href || attrs.psTarget).substr(1);
                    content = document.getElementById(targetId);
                    slider = document.getElementById('pageslide-target-' + targetId);

                    if (!slider) {
                        slider = document.createElement('div');
                        slider.id = 'pageslide-target-' + targetId;
                    }
                }

                // Check for content
                if (!content)
                    throw new Error('You have to elements inside the <pageslide> or you have not specified a target href');

                slider = slider || document.createElement('div');
                slider.className = param.className;

                /* Style setup */
                slider.style.transitionDuration = param.speed + 's';
                slider.style.webkitTransitionDuration = param.speed + 's';
                slider.style.zIndex = param.zindex;
                slider.style.position = 'fixed';
                slider.style.width = 0;
                slider.style.height = 0;
                slider.style.transitionProperty = 'width, height';

                switch (param.side){
                    case 'right':
                        slider.style.height = attrs.psCustomHeight || '100%';
                        slider.style.top = attrs.psCustomTop ||  '0px';
                        slider.style.bottom = attrs.psCustomBottom ||  '0px';
                        slider.style.right = attrs.psCustomRight ||  '0px';
                        break;
                    case 'left':
                        slider.style.height = attrs.psCustomHeight || '100%';
                        slider.style.top = attrs.psCustomTop || '71px';
                        slider.style.bottom = attrs.psCustomBottom || '0px';
                        slider.style.left = attrs.psCustomLeft || '0px';
                        break;
                    case 'top':
                        slider.style.width = attrs.psCustomWidth || '100%';
                        slider.style.left = attrs.psCustomLeft || '0px';
                        slider.style.top = attrs.psCustomTop || '0px';
                        slider.style.right = attrs.psCustomRight || '0px';
                        break;
                    case 'bottom':
                        slider.style.width = attrs.psCustomWidth || '100%';
                        slider.style.bottom = attrs.psCustomBottom || '0px';
                        slider.style.left = attrs.psCustomLeft || '0px';
                        slider.style.right = attrs.psCustomRight || '0px';
                        break;
                }


                /* Append */
                document.body.appendChild(slider);
                slider.appendChild(content);

                /* Closed */
                function psClose(slider,param){
                    if (slider && slider.style.width !== 0 && slider.style.width !== 0){
                        content.style.display = 'none';
                        switch (param.side){
                            case 'right':
                                slider.style.width = '0px';
                                break;
                            case 'left':
                                slider.style.width = '0px';
                                break;
                            case 'top':
                                slider.style.height = '0px';
                                break;
                            case 'bottom':
                                slider.style.height = '0px';
                                break;
                        }
                    }
                    $scope.psOpen = false;
                }

                /* Open */
                function psOpen(slider,param){
                    if (slider.style.width !== 0 && slider.style.width !== 0){
                        switch (param.side){
                            case 'right':
                                slider.style.width = param.size;
                                break;
                            case 'left':
                                slider.style.width = param.size;
                                break;
                            case 'top':
                                slider.style.height = param.size;
                                break;
                            case 'bottom':
                                slider.style.height = param.size;
                                break;
                        }
                        setTimeout(function(){
                            content.style.display = 'block';
                        },(param.speed * 1000));

                    }
                }

                function isFunction(functionToCheck){
                    var getType = {};
                    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
                }

                /*
                * Watchers
                * */

                if(attrs.psSize){
                    $scope.$watch(function(){
                        return attrs.psSize;
                    }, function(newVal,oldVal) {
                        param.size = newVal;
                        if($scope.psOpen) {
                            psOpen(slider,param);
                        }
                    });
                }

                $scope.$watch("psOpen", function (value){
                    if (!!value) {
                        // Open
                        psOpen(slider,param);
                    } else {
                        // Close
                        psClose(slider,param);
                    }
                });

                // close panel on location change
                if($scope.psAutoClose){
                    $scope.$on("$locationChangeStart", function(){
                        psClose(slider, param);
                        if(isFunction($scope.psAutoClose)) {
                            $scope.psAutoClose();
                        }
                    });
                    $scope.$on("$stateChangeStart", function(){
                        psClose(slider, param);
                        if(isFunction($scope.psAutoClose)) {
                            $scope.psAutoClose();
                        }
                    });
                }



                /*
                * Events
                * */

                $scope.$on('$destroy', function() {
                    document.body.removeChild(slider);
                });

                var close_handler = (attrs.href) ? document.getElementById(attrs.href.substr(1) + '-close') : null;
                if (el[0].addEventListener) {
                    el[0].addEventListener('click',function(e){
                        e.preventDefault();
                        psOpen(slider,param);
                    });

                    if (close_handler){
                        close_handler.addEventListener('click', function(e){
                            e.preventDefault();
                            psClose(slider,param);
                        });
                    }
                } else {
                    // IE8 Fallback code
                    el[0].attachEvent('onclick',function(e){
                        e.returnValue = false;
                        psOpen(slider,param);
                    });

                    if (close_handler){
                        close_handler.attachEvent('onclick', function(e){
                            e.returnValue = false;
                            psClose(slider,param);
                        });
                    }
                }

            }
        };
    }
]);

/*
 *
 * https://github.com/fatlinesofcode/ngDraggable
 */
angular.module("ngDraggable", [])
        .service('ngDraggable', ['$window', function($window) {

            var isDef = function(val) { return typeof val !== 'undefined'; };

            this.getEventProp = function getEventProp(evt, prop, skipOriginal) {
                if (isDef(evt.touches) && evt.touches[0]) {
                    return evt.touches[0][prop];
                }
                if (isDef(evt[prop])) {
                    return evt[prop];
                }
                if (evt.originalEvent && !skipOriginal) {
                    return this.getEventProp(evt.originalEvent, prop, true);
                }
            };

            this.getPrivOffset = function getPrivOffset(docElem) {
                var box = { top: 0, left: 0 };
                if (isDef(docElem[0].getBoundingClientRect)) {
                    box = docElem[0].getBoundingClientRect();
                }
                return {
                    top: box.top + $window.pageYOffset - docElem[0].clientTop,
                    left: box.left + $window.pageXOffset - docElem[0].clientLeft
                };
            }

        }])
        .directive('ngDrag', ['$rootScope', '$parse', '$document', '$window', 'ngDraggable', function ($rootScope, $parse, $document, $window, ngDraggable) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    scope.value = attrs.ngDrag;
                    var offset,_centerAnchor=false,_mx,_my,_tx,_ty,_mrx,_mry;
                    var _hasTouch = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
                    var _pressEvents = 'touchstart mousedown';
                    var _moveEvents = 'touchmove mousemove';
                    var _releaseEvents = 'touchend mouseup';

                    // to identify the element in order to prevent getting superflous events when a single element has both drag and drop directives on it.
                    var _myid = scope.$id;
                    var _data = null;

                    var _dragOffset = null;

                    var _dragEnabled = false;

                    var _pressTimer = null;

                    var onDragSuccessCallback = $parse(attrs.ngDragSuccess) || null;

                    var initialize = function () {
                        element.attr('draggable', 'false'); // prevent native drag
                        toggleListeners(true);
                    };

                    var toggleListeners = function (enable) {
                        if (!enable)return;
                        // add listeners.

                        scope.$on('$destroy', onDestroy);
                        scope.$watch(attrs.ngDrag, onEnableChange);
                        scope.$watch(attrs.ngCenterAnchor, onCenterAnchor);
                        scope.$watch(attrs.ngDragData, onDragDataChange);
                        element.on(_pressEvents, onpress);
                        if(! _hasTouch && element[0].nodeName.toLowerCase() == "img"){
                            element.on('mousedown', function(){ return false;}); // prevent native drag for images
                        }
                    };
                    var onDestroy = function (enable) {
                        toggleListeners(false);
                    };
                    var onDragDataChange = function (newVal, oldVal) {
                        _data = newVal;
                    };
                    var onEnableChange = function (newVal, oldVal) {
                        _dragEnabled = (newVal);
                    };
                    var onCenterAnchor = function (newVal, oldVal) {
                        if(angular.isDefined(newVal))
                        _centerAnchor = (newVal || 'true');
                    }

                    var isClickableElement = function (evt) {
                        return (
                                angular.isDefined(angular.element(evt.target).attr("ng-click"))
                                || angular.isDefined(angular.element(evt.target).attr("ng-dblclick"))
                                || angular.isDefined(angular.element(evt.target).attr("ng-cancel-drag"))
                                );
                    }
                    /*
                     * When the element is clicked start the drag behaviour
                     * On touch devices as a small delay so as not to prevent native window scrolling
                     */
                    var onpress = function(evt) {
                        if(! _dragEnabled)return;

                        // disable drag on clickable element
                        if (isClickableElement(evt)) {
                            return;
                        }

                        if(_hasTouch){
                            cancelPress();
                            _pressTimer = setTimeout(function(){
                                cancelPress();
                                onlongpress(evt);
                            },100);
                            $document.on(_moveEvents, cancelPress);
                            $document.on(_releaseEvents, cancelPress);
                        }else{
                            onlongpress(evt);
                        }

                    };
                    var cancelPress = function() {
                        clearTimeout(_pressTimer);
                        $document.off(_moveEvents, cancelPress);
                        $document.off(_releaseEvents, cancelPress);
                    };
                    var onlongpress = function(evt) {
                        if(! _dragEnabled)return;
                        evt.preventDefault();
                        element.addClass('dragging');
                        offset = ngDraggable.getPrivOffset(element);
                        _dragOffset = offset;

                        element.centerX = element[0].offsetWidth / 2;
                        element.centerY = element[0].offsetHeight / 2;

                        _mx = ngDraggable.getEventProp(evt, 'pageX');
                        _my = ngDraggable.getEventProp(evt, 'pageY');
                        _mrx = _mx - offset.left;
                        _mry = _my - offset.top;
                         if (_centerAnchor) {
                             _tx = _mx - element.centerX - $window.pageXOffset;
                             _ty = _my - element.centerY - $window.pageYOffset;
                        } else {
                             _tx = _mx - _mrx - $window.pageXOffset;
                             _ty = _my - _mry - $window.pageYOffset;
                        }

                        $document.on(_moveEvents, onmove);
                        $document.on(_releaseEvents, onrelease);
                        $rootScope.$broadcast('draggable:start', {x:_mx, y:_my, tx:_tx, ty:_ty, event:evt, element:element, data:_data});
                    }

                    var onmove = function (evt) {
                        if (!_dragEnabled)return;
                        evt.preventDefault();

                        _mx = ngDraggable.getEventProp(evt, 'pageX');
                        _my = ngDraggable.getEventProp(evt, 'pageY');

                        if (_centerAnchor) {
                            _tx = _mx - element.centerX - _dragOffset.left;
                            _ty = _my - element.centerY - _dragOffset.top;
                        } else {
                            _tx = _mx - _mrx - _dragOffset.left;
                            _ty = _my - _mry - _dragOffset.top;
                        }

                        moveElement(_tx, _ty);

                        $rootScope.$broadcast('draggable:move', { x: _mx, y: _my, tx: _tx, ty: _ty, event: evt, element: element, data: _data, uid: _myid });
                    }

                    var onrelease = function(evt) {
                        if (!_dragEnabled)
                            return;
                        evt.preventDefault();
                        $rootScope.$broadcast('draggable:end', {x:_mx, y:_my, tx:_tx, ty:_ty, event:evt, element:element, data:_data, callback:onDragComplete, uid: _myid});
                        element.removeClass('dragging');
                        reset();
                        $document.off(_moveEvents, onmove);
                        $document.off(_releaseEvents, onrelease);
                    }

                    var onDragComplete = function(evt) {
                        if (!onDragSuccessCallback )return;

                        scope.$apply(function () {
                            onDragSuccessCallback(scope, {$data: _data, $event: evt});
                        });
                    }

                    var reset = function() {
                        element.css({transform:'', 'z-index':''});
                    }

                    var moveElement = function (x, y) {
                        element.css({
                            transform: 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, '+x+', '+y+', 0, 1)','z-index': 99999
                            //,margin: '0'  don't monkey with the margin,
                        });
                    }
                    initialize();
                }
            };
        }])

        .directive('ngDrop', ['$parse', '$timeout', '$window', 'ngDraggable', function ($parse, $timeout, $window, ngDraggable) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    scope.value = attrs.ngDrop;

                    var _myid = scope.$id;

                    var _dropEnabled=false;

                    var onDropCallback = $parse(attrs.ngDropSuccess);// || function(){};

                    var onDragStartCallback = $parse(attrs.ngDragStart);
                    var onDragStopCallback = $parse(attrs.ngDragStop);
                    var onDragMoveCallback = $parse(attrs.ngDragMove);
                    var onTouchCallback = $parse(attrs.ngOntouch);

                    var initialize = function () {
                        toggleListeners(true);
                    };

                    var toggleListeners = function (enable) {
                        // remove listeners

                        if (!enable)return;
                        // add listeners.
                        attrs.$observe("ngDrop", onEnableChange);
                        scope.$on('$destroy', onDestroy);
                        scope.$on('draggable:start', onDragStart);
                        scope.$on('draggable:move', onDragMove);
                        scope.$on('draggable:end', onDragEnd);
                    };

                    var onDestroy = function (enable) {
                        toggleListeners(false);
                    };
                    var onEnableChange = function (newVal, oldVal) {
                        _dropEnabled=scope.$eval(newVal);
                    };
                    var onDragStart = function(evt, obj) {
                        if(! _dropEnabled)return;
                        isTouching(obj.x,obj.y,obj.element);

                        $timeout(function(){
                            onDragStartCallback(scope, {$data: obj.data, $event: obj});
                        });
                    };
                    var onDragMove = function(evt, obj) {
                        if(! _dropEnabled)return;
                        isTouching(obj.x,obj.y,obj.element);
                        $timeout(function(){
                            onDragMoveCallback(scope, {$data: obj.data, $event: obj});
                        });
                    }

                    var onDragEnd = function (evt, obj) {

                        // don't listen to drop events if this is the element being dragged
                        if (!_dropEnabled || _myid === obj.uid)return;
                        if (isTouching(obj.x, obj.y, obj.element)) {
                            // call the ngDraggable ngDragSuccess element callback
                           if(obj.callback){
                                obj.callback(obj);
                            }

                            $timeout(function(){
                                onDropCallback(scope, {$data: obj.data, $event: obj});
                            });
                        }
                        $timeout(function(){
                            onDragStopCallback(scope, {$data: obj.data, $event: obj});
                        });
                        updateDragStyles(false, obj.element);
                    }

                    var isTouching = function(mouseX, mouseY, dragElement) {
                        var touching= hitTest(mouseX, mouseY);
                        updateDragStyles(touching, dragElement);
                        return touching;
                    }

                    var updateDragStyles = function(touching, dragElement) {
                        if(touching){
                            element.addClass('drag-enter');
                            dragElement.addClass('drag-over');
                            $timeout(function(){
                                onTouchCallback(scope, {$event: 'touch'});
                            });
                        }else{
                            element.removeClass('drag-enter');
                            dragElement.removeClass('drag-over');
                            $timeout(function(){
                                onTouchCallback(scope, {$event: 'nonTouch'});
                            });
                        }
                    }

                    var hitTest = function(x, y) {
                        var bounds = ngDraggable.getPrivOffset(element);
                        bounds.right = bounds.left + element[0].offsetWidth;
                        bounds.bottom = bounds.top + element[0].offsetHeight;
                        return  x >= bounds.left
                                && x <= bounds.right
                                && y <= bounds.bottom
                                && y >= bounds.top;
                    };

                    initialize();
                }
            };
        }])
        .directive('ngDragClone', ['$parse', '$timeout', 'ngDraggable', function ($parse, $timeout, ngDraggable) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var img, _allowClone=true;
                    var _dragOffset = null;
                    scope.clonedData = {};
                    var initialize = function () {

                        img = element.find('img');
                        element.attr('draggable', 'false');
                        img.attr('draggable', 'false');
                        reset();
                        toggleListeners(true);
                    };


                    var toggleListeners = function (enable) {
                        // remove listeners

                        if (!enable)return;
                        // add listeners.
                        scope.$on('draggable:start', onDragStart);
                        scope.$on('draggable:move', onDragMove);
                        scope.$on('draggable:end', onDragEnd);
                        preventContextMenu();

                    };
                    var preventContextMenu = function() {
                      //  element.off('mousedown touchstart touchmove touchend touchcancel', absorbEvent_);
                        img.off('mousedown touchstart touchmove touchend touchcancel', absorbEvent_);
                      //  element.on('mousedown touchstart touchmove touchend touchcancel', absorbEvent_);
                        img.on('mousedown touchstart touchmove touchend touchcancel', absorbEvent_);
                    };
                    var onDragStart = function(evt, obj, elm) {
                        _allowClone=true;
                        if(angular.isDefined(obj.data.allowClone)){
                            _allowClone=obj.data.allowClone;
                        }
                        if(_allowClone) {
                            scope.$apply(function () {
                                scope.clonedData = obj.data;
                            });
                            element.css('width', obj.element[0].offsetWidth);
                            element.css('height', obj.element[0].offsetHeight);

                            moveElement(obj.tx, obj.ty);
                        }

                        _dragOffset = ngDraggable.getPrivOffset(element);
                    }
                    var onDragMove = function(evt, obj) {
                        if(_allowClone) {

                            _tx = obj.tx + _dragOffset.left;
                            _ty = obj.ty + _dragOffset.top;

                            moveElement(_tx, _ty);
                        }
                    };
                    var onDragEnd = function(evt, obj) {
                        //moveElement(obj.tx,obj.ty);
                        if(_allowClone) {
                            reset();
                        }
                    };

                    var reset = function() {
                        element.css({left:0,top:0, position:'fixed', 'z-index':-1, visibility:'hidden'});
                    };
                    var moveElement = function(x,y) {
                        element.css({
                            transform: 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, '+x+', '+y+', 0, 1)', 'z-index': 99999, 'visibility': 'visible'
                            //,margin: '0'  don't monkey with the margin,
                        });
                    }

                    var absorbEvent_ = function (event) {
                        var e = event.originalEvent;
                        e.preventDefault && e.preventDefault();
                        e.stopPropagation && e.stopPropagation();
                        e.cancelBubble = true;
                        e.returnValue = false;
                        return false;
                    };

                    initialize();
                }
            };
        }])
    .directive('ngPreventDrag', ['$parse', '$timeout', function ($parse, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var initialize = function () {

                    element.attr('draggable', 'false');
                    toggleListeners(true);
                };


                var toggleListeners = function (enable) {
                    // remove listeners

                    if (!enable)return;
                    // add listeners.
                    element.on('mousedown touchstart touchmove touchend touchcancel', absorbEvent_);
                };


                var absorbEvent_ = function (event) {
                    var e = event.originalEvent;
                    e.preventDefault && e.preventDefault();
                    e.stopPropagation && e.stopPropagation();
                    e.cancelBubble = true;
                    e.returnValue = false;
                    return false;
                }

                initialize();
            }
        }
    }])
    .directive('ngCancelDrag', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.find('*').attr('ng-cancel-drag', 'ng-cancel-drag');
            }
        }
    }]);

/**
 * Created by rkapoor on 21/03/15.
 */

var routesModule;
routesModule.controller('balaramaController', ['$scope', '$rootScope', function($scope, $rootScope) {
    "use strict";
    $scope.alerts = [];
    var isBudgetAlertPresent=false;
    var messages =
    {
        budgetExceeds:{kind:'budget',type:'danger',msg:'You may go out of your budget!!'},
        budgetOutOfLimit:{kind:'budget',type:'danger',msg:'You have Exceeded your budget!!'},
        timeExceeds:{kind:'time',type:'danger',msg:'You are spending very less time in ?!!'},
        timeOverlap:{kind:'time',type:'danger',msg:'You are leaving ? before reaching!!'},
        inEfficientOrder:{kind:'order', type:'',msg:'You are covering too much distance!!'}
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $rootScope.$on('showRecommendation',function onShowRecommendation(event,category,params){
        var alert=messages[category];
        var alertClone = JSON.parse(JSON.stringify(alert));
        removeAlert(alertClone.kind);
        if(params!==undefined)
        {
            alertClone.msg = alertClone.msg.replace('?',params);
        }
        $scope.alerts.push(alertClone);
    });

    $rootScope.$on('hideRecommendation',function onHideRecommendation(event,kind){
        removeAlert(kind);
    });

    var removeAlert = function (kind) {
        for (var alertIndex in $scope.alerts) {
            if ($scope.alerts[alertIndex].kind === kind) {
                $scope.alerts.splice(alertIndex, 1);
            }
        }
    };
}]);

/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 * 
 * Requires: 1.2.2+
 */

(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

if ($.event.fixHooks) {
    for ( var i=types.length; i; ) {
        $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
    }
}

$.event.special.mousewheel = {
    setup: function() {
        if ( this.addEventListener ) {
            for ( var i=types.length; i; ) {
                this.addEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = handler;
        }
    },
    
    teardown: function() {
        if ( this.removeEventListener ) {
            for ( var i=types.length; i; ) {
                this.removeEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = null;
        }
    }
};

$.fn.extend({
    mousewheel: function(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },
    
    unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";
    
    // Old school scrollwheel delta
    if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
    if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }
    
    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;
    
    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
        deltaY = 0;
        deltaX = -1*delta;
    }
    
    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
    
    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);
    
    return ($.event.dispatch || $.event.handle).apply(this, args);
}

})(jQuery);

/*!
 * jScrollPane - v2.0.20 - 2014-10-23
 * http://jscrollpane.kelvinluck.com/
 *
 * Copyright (c) 2014 Kelvin Luck
 * Dual licensed under the MIT or GPL licenses.
 */

// Script: jScrollPane - cross browser customisable scrollbars
//
// *Version: 2.0.20, Last updated: 2014-10-23*
//
// Project Home - http://jscrollpane.kelvinluck.com/
// GitHub       - http://github.com/vitch/jScrollPane
// Source       - http://github.com/vitch/jScrollPane/raw/master/script/jquery.jscrollpane.js
// (Minified)   - http://github.com/vitch/jScrollPane/raw/master/script/jquery.jscrollpane.min.js
//
// About: License
//
// Copyright (c) 2014 Kelvin Luck
// Dual licensed under the MIT or GPL Version 2 licenses.
// http://jscrollpane.kelvinluck.com/MIT-LICENSE.txt
// http://jscrollpane.kelvinluck.com/GPL-LICENSE.txt
//
// About: Examples
//
// All examples and demos are available through the jScrollPane example site at:
// http://jscrollpane.kelvinluck.com/
//
// About: Support and Testing
//
// This plugin is tested on the browsers below and has been found to work reliably on them. If you run
// into a problem on one of the supported browsers then please visit the support section on the jScrollPane
// website (http://jscrollpane.kelvinluck.com/) for more information on getting support. You are also
// welcome to fork the project on GitHub if you can contribute a fix for a given issue.
//
// jQuery Versions - tested in 1.4.2+ - reported to work in 1.3.x
// Browsers Tested - Firefox 3.6.8, Safari 5, Opera 10.6, Chrome 5.0, IE 6, 7, 8
//
// About: Release History
//
// 2.0.20 - (2014-10-23) Adds AMD support (thanks @carlosrberto) and support for overflow-x/overflow-y (thanks @darimpulso)
// 2.0.19 - (2013-11-16) Changes for more reliable scroll amount with latest mousewheel plugin (thanks @brandonaaron)
// 2.0.18 - (2013-10-23) Fix for issue with gutters and scrollToElement (thanks @Dubiy)
// 2.0.17 - (2013-08-17) Working correctly when box-sizing is set to border-box (thanks @pieht)
// 2.0.16 - (2013-07-30) Resetting left position when scroll is removed. Fixes #189
// 2.0.15 - (2013-07-29) Fixed issue with scrollToElement where the destX and destY are undefined.
// 2.0.14 - (2013-05-01) Updated to most recent mouse wheel plugin (see #106) and related changes for sensible scroll speed
// 2.0.13 - (2013-05-01) Switched to semver compatible version name
// 2.0.0beta12 - (2012-09-27) fix for jQuery 1.8+
// 2.0.0beta11 - (2012-05-14)
// 2.0.0beta10 - (2011-04-17) cleaner required size calculation, improved keyboard support, stickToBottom/Left, other small fixes
// 2.0.0beta9 - (2011-01-31) new API methods, bug fixes and correct keyboard support for FF/OSX
// 2.0.0beta8 - (2011-01-29) touchscreen support, improved keyboard support
// 2.0.0beta7 - (2011-01-23) scroll speed consistent (thanks Aivo Paas)
// 2.0.0beta6 - (2010-12-07) scrollToElement horizontal support
// 2.0.0beta5 - (2010-10-18) jQuery 1.4.3 support, various bug fixes
// 2.0.0beta4 - (2010-09-17) clickOnTrack support, bug fixes
// 2.0.0beta3 - (2010-08-27) Horizontal mousewheel, mwheelIntent, keyboard support, bug fixes
// 2.0.0beta2 - (2010-08-21) Bug fixes
// 2.0.0beta1 - (2010-08-17) Rewrite to follow modern best practices and enable horizontal scrolling, initially hidden
//							 elements and dynamically sized elements.
// 1.x - (2006-12-31 - 2010-07-31) Initial version, hosted at googlecode, deprecated

(function (plugin, window) {
    var factory = function($){
        return plugin($, window);
    }
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($,window,undefined){

    $.fn.jScrollPane = function(settings)
    {
        // JScrollPane "class" - public methods are available through $('selector').data('jsp')
        function JScrollPane(elem, s)
        {
            var settings, jsp = this, pane, paneWidth, paneHeight, container, contentWidth, contentHeight,
                percentInViewH, percentInViewV, isScrollableV, isScrollableH, verticalDrag, dragMaxY,
                verticalDragPosition, horizontalDrag, dragMaxX, horizontalDragPosition,
                verticalBar, verticalTrack, scrollbarWidth, verticalTrackHeight, verticalDragHeight, arrowUp, arrowDown,
                horizontalBar, horizontalTrack, horizontalTrackWidth, horizontalDragWidth, arrowLeft, arrowRight,
                reinitialiseInterval, originalPadding, originalPaddingTotalWidth, previousContentWidth,
                wasAtTop = true, wasAtLeft = true, wasAtBottom = false, wasAtRight = false,
                originalElement = elem.clone(false, false).empty(),
                mwEvent = $.fn.mwheelIntent ? 'mwheelIntent.jsp' : 'mousewheel.jsp';

            if (elem.css('box-sizing') === 'border-box') {
                originalPadding = 0;
                originalPaddingTotalWidth = 0;
            } else {
                originalPadding = elem.css('paddingTop') + ' ' +
                elem.css('paddingRight') + ' ' +
                elem.css('paddingBottom') + ' ' +
                elem.css('paddingLeft');
                originalPaddingTotalWidth = (parseInt(elem.css('paddingLeft'), 10) || 0) +
                (parseInt(elem.css('paddingRight'), 10) || 0);
            }

            function initialise(s)
            {

                var /*firstChild, lastChild, */isMaintainingPositon, lastContentX, lastContentY,
                    hasContainingSpaceChanged, originalScrollTop, originalScrollLeft,
                    maintainAtBottom = false, maintainAtRight = false;

                settings = s;
                //console.log("settings:"+JSON.stringify(s));
// console.log("pane def:"+pane);
                console.log("elementID"+elem.attr("id"));
// console.log("paneHeight:"+paneHeight);
                if (pane === undefined) {
                    originalScrollTop = elem.scrollTop();
                    originalScrollLeft = elem.scrollLeft();

                    elem.css(
                        {
                            overflow: 'hidden',
                            padding: 0
                        }
                    );
                    // TODO: Deal with where width/ height is 0 as it probably means the element is hidden and we should
                    // come back to it later and check once it is unhidden...
                    //console.log("elem.innerWidth:"+JSON.Stringify(elem)+","+"originalPaddingTotalWidth:"+originalPaddingTotalWidth);
                    paneWidth = elem.innerWidth() + originalPaddingTotalWidth;
                    //paneWidth=350;
                    paneHeight = elem.innerHeight();
                    console.log("element.innerWidth:"+elem.innerWidth());
                    console.log("paneHeight:"+paneHeight);
                    elem.width(paneWidth);

                    pane = $('<div class="jspPane" />').css('padding', originalPadding).append(elem.children());
                    container = $('<div class="jspContainer" />')
                        .css({
                            'width': paneWidth + 'px',
                            'height': paneHeight + 'px'
                        }
                    ).append(pane).appendTo(elem);

                    /*
                     // Move any margins from the first and last children up to the container so they can still
                     // collapse with neighbouring elements as they would before jScrollPane
                     firstChild = pane.find(':first-child');
                     lastChild = pane.find(':last-child');
                     elem.css(
                     {
                     'margin-top': firstChild.css('margin-top'),
                     'margin-bottom': lastChild.css('margin-bottom')
                     }
                     );
                     firstChild.css('margin-top', 0);
                     lastChild.css('margin-bottom', 0);
                     */
                } else {
                    elem.css('width', '');
                    console.log("elem.innerHeight():"+elem.innerHeight());
                    maintainAtBottom = settings.stickToBottom && isCloseToBottom();
                    maintainAtRight  = settings.stickToRight  && isCloseToRight();

                    hasContainingSpaceChanged = elem.innerWidth() + originalPaddingTotalWidth != paneWidth || elem.outerHeight() != paneHeight;
                    //console.log("")
                    // if (hasContainingSpaceChanged) {
                    // 	paneWidth = elem.innerWidth() + originalPaddingTotalWidth;
                    // 	paneHeight = elem.innerHeight();
                    // 	container.css({
                    // 		width: paneWidth + 'px',
                    // 		height: paneHeight + 'px'
                    // 	});
                    // }

                    // If nothing changed since last check...
                    if (!hasContainingSpaceChanged && previousContentWidth == contentWidth && pane.outerHeight() == contentHeight) {
                        elem.width(paneWidth);
                        return;
                    }
                    previousContentWidth = contentWidth;

                    pane.css('width', '');
                    elem.width(paneWidth);

                    container.find('>.jspVerticalBar,>.jspHorizontalBar').remove().end();
                }

                //pane.css('overflow', 'auto');
                if (s.contentWidth) {
                    contentWidth = s.contentWidth;
                } else {
                    contentWidth = pane[0].scrollWidth;
                }

                console.log("transclude:"+$("#transclude")[0].scrollHeight);
//console.log("children height:"+pane.children().height());
                //console.log("children height:"+pane.children().children().height());
                var actualPaneHeight=paneHeight;
                //pane.css("height","auto");
                //var contentHeight = pane.height();
                //contentHeight = 871;
                //console.log("pane.height():"+pane.height());
                console.log("pane[0].scrollHeight:"+pane[0].scrollHeight);
                //console.log("testHeight:"+testHeight);

                pane.css("height",actualPaneHeight);
                //contentHeight = pane[0].scrollHeight;
                // console.log(" pane[0].scrollHeight:"+ pane[0].scrollHeight);
                // console.log("elem[0].scrollHeight():"+elem[0].scrollHeight);
                var transcludeScrollHeight=0;
                if(elem.attr("id")=="travelPanel")
                {
                    transcludeScrollHeight = $("#transcludeTravelPanel")[0].scrollHeight;
                    console.log("withID travelPanel:"+transcludeScrollHeight);
                }
                else if(elem.attr("id")=="travelModesPanel")
                {
                    transcludeScrollHeight = $("#transcludeTravelModesPanel")[0].scrollHeight;
                    console.log("withID travelModesPanel:"+transcludeScrollHeight);
                }
                else if(elem.attr("id")=="destinationsPanel")
                {
                    transcludeScrollHeight = $("#transcludeDestinationsPanel")[0].scrollHeight;
                    console.log("withID transcludeDestinationsPanel:"+transcludeScrollHeight);
                }
                else
                {
                    transcludeScrollHeight = $("#transclude")[0].scrollHeight;
                    console.log("other than else:"+transcludeScrollHeight);
                }

                transcludeScrollHeight+=(transcludeScrollHeight*21)/100;
                if(elem.attr("id")=="destinationsPanel")
                {
                    transcludeScrollHeight = $("#transcludeDestinationsPanel")[0].scrollHeight;
                }
                var contentHeight = transcludeScrollHeight;
                //console.log("pane.first():"+pane.first());
                //var contentHeight = pane.first().first().first()[0].scrollHeight;
                console.log("contentHeight123:"+contentHeight);
                pane.css('overflow', '');
//contentHeight = 500;
//paneHeight = 250;
                percentInViewH = contentWidth / paneWidth;
                percentInViewV = contentHeight / paneHeight;
                isScrollableV = percentInViewV > 1;
//isScrollableV = true;
                //isScrollableH = percentInViewH > 1;
                isScrollableH=false;
                console.log(paneWidth, paneHeight, contentWidth, contentHeight, percentInViewH, percentInViewV, isScrollableH, isScrollableV);

                if (!(isScrollableH || isScrollableV)) {
                    elem.removeClass('jspScrollable');
                    pane.css({
                        top: 0,
                        left: 0,
                        width: container.width() - originalPaddingTotalWidth
                    });
                    removeMousewheel();
                    removeFocusHandler();
                    removeKeyboardNav();
                    removeClickOnTrack();
                } else {
                    elem.addClass('jspScrollable');

                    isMaintainingPositon = settings.maintainPosition && (verticalDragPosition || horizontalDragPosition);
                    if (isMaintainingPositon) {
                        lastContentX = contentPositionX();
                        lastContentY = contentPositionY();
                    }

                    initialiseVerticalScroll(elem);
                    initialiseHorizontalScroll();
                    resizeScrollbars(contentHeight);

                    if (isMaintainingPositon) {
                        scrollToX(maintainAtRight  ? (contentWidth  - paneWidth ) : lastContentX, false);
                        scrollToY(maintainAtBottom ? (contentHeight - paneHeight) : lastContentY, false);
                    }

                    initFocusHandler();
                    initMousewheel();
                    initTouch();

                    if (settings.enableKeyboardNavigation) {
                        initKeyboardNav();
                    }
                    if (settings.clickOnTrack) {
                        initClickOnTrack();
                    }

                    observeHash();
                    if (settings.hijackInternalLinks) {
                        hijackInternalLinks();
                    }
                }

                if (settings.autoReinitialise && !reinitialiseInterval) {
                    reinitialiseInterval = setInterval(
                        function()
                        {
                            initialise(settings);
                        },
                        settings.autoReinitialiseDelay
                    );
                } else if (!settings.autoReinitialise && reinitialiseInterval) {
                    clearInterval(reinitialiseInterval);
                }

                originalScrollTop && elem.scrollTop(0) && scrollToY(originalScrollTop, false);
                originalScrollLeft && elem.scrollLeft(0) && scrollToX(originalScrollLeft, false);

                elem.trigger('jsp-initialised', [isScrollableH || isScrollableV]);
                $('.jspDrag').hide();
// $('.jspScrollable').mouseenter(function(){
//     $(this).find('.jspDrag').stop(true, true).fadeIn('slow');
// });
// $('.jspScrollable').mouseleave(function(){
//     $(this).find('.jspDrag').stop(true, true).fadeOut('slow');
// });
                var id=elem.attr("id");
                $('#'+id).mouseenter(function(){
                    $(".jspDrag."+id).fadeIn('slow');
                    // $(this).find('.jspDrag').stop(true, true).fadeIn('slow');
                });
                $('#'+id).mouseleave(function(){
                    $(".jspDrag."+id).fadeOut('slow');
                    // $(this).find('.jspDrag').stop(true, true).fadeOut('slow');
                });



            }

            function initialiseVerticalScroll(elem)
            {console.log("isScrollableV:"+isScrollableV);
                var id = elem.attr("id");
                if (isScrollableV) {
                    console.log("initialiseVerticalScroll");
                    container.append(
                        $('<div class="jspVerticalBar" />').append(
                            $('<div class="jspCap jspCapTop" />'),
                            $('<div class="jspTrack" />').append(
                                $('<div class="jspDrag '+id+'"/>').append(
                                    $('<div class="jspDragTop" />'),
                                    $('<div class="jspDragBottom" />')
                                )
                            ),
                            $('<div class="jspCap jspCapBottom" />')
                        )
                    );

                    verticalBar = container.find('>.jspVerticalBar');
                    verticalTrack = verticalBar.find('>.jspTrack');
                    verticalDrag = verticalTrack.find('>.jspDrag');

                    if (settings.showArrows) {
                        arrowUp = $('<a class="jspArrow jspArrowUp" />').bind(
                            'mousedown.jsp', getArrowScroll(0, -1)
                        ).bind('click.jsp', nil);
                        arrowDown = $('<a class="jspArrow jspArrowDown" />').bind(
                            'mousedown.jsp', getArrowScroll(0, 1)
                        ).bind('click.jsp', nil);
                        if (settings.arrowScrollOnHover) {
                            arrowUp.bind('mouseover.jsp', getArrowScroll(0, -1, arrowUp));
                            arrowDown.bind('mouseover.jsp', getArrowScroll(0, 1, arrowDown));
                        }

                        appendArrows(verticalTrack, settings.verticalArrowPositions, arrowUp, arrowDown);
                    }

                    verticalTrackHeight = paneHeight;
                    container.find('>.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow').each(
                        function()
                        {
                            verticalTrackHeight -= $(this).outerHeight();
                        }
                    );


                    verticalDrag.hover(
                        function()
                        {
                            verticalDrag.addClass('jspHover');
                        },
                        function()
                        {
                            verticalDrag.removeClass('jspHover');
                        }
                    ).bind(
                        'mousedown.jsp',
                        function(e)
                        {
                            // Stop IE from allowing text selection
                            $('html').bind('dragstart.jsp selectstart.jsp', nil);

                            verticalDrag.addClass('jspActive');

                            var startY = e.pageY - verticalDrag.position().top;

                            $('html').bind(
                                'mousemove.jsp',
                                function(e)
                                {
                                    positionDragY(e.pageY - startY, false);
                                }
                            ).bind('mouseup.jsp mouseleave.jsp', cancelDrag);
                            return false;
                        }
                    );
                    sizeVerticalScrollbar();
                }
            }

            function sizeVerticalScrollbar()
            {
                verticalTrack.height(verticalTrackHeight + 'px');
                verticalDragPosition = 0;
                scrollbarWidth = settings.verticalGutter + verticalTrack.outerWidth();

                // Make the pane thinner to allow for the vertical scrollbar
                pane.width(paneWidth - scrollbarWidth - originalPaddingTotalWidth);

                // Add margin to the left of the pane if scrollbars are on that side (to position
                // the scrollbar on the left or right set it's left or right property in CSS)
                try {
                    if (verticalBar.position().left === 0) {
                        pane.css('margin-left', scrollbarWidth + 'px');
                    }
                } catch (err) {
                }
            }

            function initialiseHorizontalScroll()
            {
                if (isScrollableH) {

                    container.append(
                        $('<div class="jspHorizontalBar" />').append(
                            $('<div class="jspCap jspCapLeft" />'),
                            $('<div class="jspTrack" />').append(
                                $('<div class="jspDrag" />').append(
                                    $('<div class="jspDragLeft" />'),
                                    $('<div class="jspDragRight" />')
                                )
                            ),
                            $('<div class="jspCap jspCapRight" />')
                        )
                    );

                    horizontalBar = container.find('>.jspHorizontalBar');
                    horizontalTrack = horizontalBar.find('>.jspTrack');
                    horizontalDrag = horizontalTrack.find('>.jspDrag');

                    if (settings.showArrows) {
                        arrowLeft = $('<a class="jspArrow jspArrowLeft" />').bind(
                            'mousedown.jsp', getArrowScroll(-1, 0)
                        ).bind('click.jsp', nil);
                        arrowRight = $('<a class="jspArrow jspArrowRight" />').bind(
                            'mousedown.jsp', getArrowScroll(1, 0)
                        ).bind('click.jsp', nil);
                        if (settings.arrowScrollOnHover) {
                            arrowLeft.bind('mouseover.jsp', getArrowScroll(-1, 0, arrowLeft));
                            arrowRight.bind('mouseover.jsp', getArrowScroll(1, 0, arrowRight));
                        }
                        appendArrows(horizontalTrack, settings.horizontalArrowPositions, arrowLeft, arrowRight);
                    }

                    horizontalDrag.hover(
                        function()
                        {
                            horizontalDrag.addClass('jspHover');
                        },
                        function()
                        {
                            horizontalDrag.removeClass('jspHover');
                        }
                    ).bind(
                        'mousedown.jsp',
                        function(e)
                        {
                            // Stop IE from allowing text selection
                            $('html').bind('dragstart.jsp selectstart.jsp', nil);

                            horizontalDrag.addClass('jspActive');

                            var startX = e.pageX - horizontalDrag.position().left;

                            $('html').bind(
                                'mousemove.jsp',
                                function(e)
                                {
                                    positionDragX(e.pageX - startX, false);
                                }
                            ).bind('mouseup.jsp mouseleave.jsp', cancelDrag);
                            return false;
                        }
                    );
                    horizontalTrackWidth = container.innerWidth();
                    sizeHorizontalScrollbar();
                }
            }

            function sizeHorizontalScrollbar()
            {
                container.find('>.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow').each(
                    function()
                    {
                        horizontalTrackWidth -= $(this).outerWidth();
                    }
                );

                horizontalTrack.width(horizontalTrackWidth + 'px');
                horizontalDragPosition = 0;
            }

            function resizeScrollbars(contentofHeight)
            {console.log("contentofHeight:"+contentofHeight);
                if (isScrollableH && isScrollableV) {
                    var horizontalTrackHeight = horizontalTrack.outerHeight(),
                        verticalTrackWidth = verticalTrack.outerWidth();
                    verticalTrackHeight -= horizontalTrackHeight;
                    $(horizontalBar).find('>.jspCap:visible,>.jspArrow').each(
                        function()
                        {
                            horizontalTrackWidth += $(this).outerWidth();
                        }
                    );
                    horizontalTrackWidth -= verticalTrackWidth;
                    paneHeight -= verticalTrackWidth;
                    paneWidth -= horizontalTrackHeight;
                    horizontalTrack.parent().append(
                        $('<div class="jspCorner" />').css('width', horizontalTrackHeight + 'px')
                    );
                    sizeVerticalScrollbar();
                    sizeHorizontalScrollbar();
                }
                // reflow content
                if (isScrollableH) {
                    pane.width((container.outerWidth() - originalPaddingTotalWidth) + 'px');
                }
                // contentHeight = 2*pane.outerHeight();
                // contentHeight = 1001;
                // var transcludeScrollHeight=$("#transclude")[0].scrollHeight;
                // transcludeScrollHeight+=(transcludeScrollHeight*18)/100;
                // console.log("transcludeScrollHeight:"+transcludeScrollHeight);
                // contentHeight = transcludeScrollHeight;
                contentHeight = contentofHeight;
                percentInViewV = contentHeight / paneHeight;

                if (isScrollableH) {
                    horizontalDragWidth = Math.ceil(1 / percentInViewH * horizontalTrackWidth);
                    if (horizontalDragWidth > settings.horizontalDragMaxWidth) {
                        horizontalDragWidth = settings.horizontalDragMaxWidth;
                    } else if (horizontalDragWidth < settings.horizontalDragMinWidth) {
                        horizontalDragWidth = settings.horizontalDragMinWidth;
                    }
                    horizontalDrag.width(horizontalDragWidth + 'px');
                    dragMaxX = horizontalTrackWidth - horizontalDragWidth;
                    _positionDragX(horizontalDragPosition); // To update the state for the arrow buttons
                }
                if (isScrollableV) {
                    verticalDragHeight = Math.ceil(1 / percentInViewV * verticalTrackHeight);
                    if (verticalDragHeight > settings.verticalDragMaxHeight) {
                        verticalDragHeight = settings.verticalDragMaxHeight;
                    } else if (verticalDragHeight < settings.verticalDragMinHeight) {
                        verticalDragHeight = settings.verticalDragMinHeight;
                    }
                    verticalDrag.height(verticalDragHeight + 'px');
                    dragMaxY = verticalTrackHeight - verticalDragHeight;
                    _positionDragY(verticalDragPosition); // To update the state for the arrow buttons
                }
            }

            function appendArrows(ele, p, a1, a2)
            {
                var p1 = "before", p2 = "after", aTemp;

                // Sniff for mac... Is there a better way to determine whether the arrows would naturally appear
                // at the top or the bottom of the bar?
                if (p == "os") {
                    p = /Mac/.test(navigator.platform) ? "after" : "split";
                }
                if (p == p1) {
                    p2 = p;
                } else if (p == p2) {
                    p1 = p;
                    aTemp = a1;
                    a1 = a2;
                    a2 = aTemp;
                }

                ele[p1](a1)[p2](a2);
            }

            function getArrowScroll(dirX, dirY, ele)
            {
                return function()
                {
                    arrowScroll(dirX, dirY, this, ele);
                    this.blur();
                    return false;
                };
            }

            function arrowScroll(dirX, dirY, arrow, ele)
            {
                arrow = $(arrow).addClass('jspActive');

                var eve,
                    scrollTimeout,
                    isFirst = true,
                    doScroll = function()
                    {
                        if (dirX !== 0) {
                            jsp.scrollByX(dirX * settings.arrowButtonSpeed);
                        }
                        if (dirY !== 0) {
                            jsp.scrollByY(dirY * settings.arrowButtonSpeed);
                        }
                        scrollTimeout = setTimeout(doScroll, isFirst ? settings.initialDelay : settings.arrowRepeatFreq);
                        isFirst = false;
                    };

                doScroll();

                eve = ele ? 'mouseout.jsp' : 'mouseup.jsp';
                ele = ele || $('html');
                ele.bind(
                    eve,
                    function()
                    {
                        arrow.removeClass('jspActive');
                        scrollTimeout && clearTimeout(scrollTimeout);
                        scrollTimeout = null;
                        ele.unbind(eve);
                    }
                );
            }

            function initClickOnTrack()
            {
                removeClickOnTrack();
                if (isScrollableV) {
                    verticalTrack.bind(
                        'mousedown.jsp',
                        function(e)
                        {
                            if (e.originalTarget === undefined || e.originalTarget == e.currentTarget) {
                                var clickedTrack = $(this),
                                    offset = clickedTrack.offset(),
                                    direction = e.pageY - offset.top - verticalDragPosition,
                                    scrollTimeout,
                                    isFirst = true,
                                    doScroll = function()
                                    {
                                        var offset = clickedTrack.offset(),
                                            pos = e.pageY - offset.top - verticalDragHeight / 2,
                                            contentDragY = paneHeight * settings.scrollPagePercent,
                                            dragY = dragMaxY * contentDragY / (contentHeight - paneHeight);
                                        if (direction < 0) {
                                            if (verticalDragPosition - dragY > pos) {
                                                jsp.scrollByY(-contentDragY);
                                            } else {
                                                positionDragY(pos);
                                            }
                                        } else if (direction > 0) {
                                            if (verticalDragPosition + dragY < pos) {
                                                jsp.scrollByY(contentDragY);
                                            } else {
                                                positionDragY(pos);
                                            }
                                        } else {
                                            cancelClick();
                                            return;
                                        }
                                        scrollTimeout = setTimeout(doScroll, isFirst ? settings.initialDelay : settings.trackClickRepeatFreq);
                                        isFirst = false;
                                    },
                                    cancelClick = function()
                                    {
                                        scrollTimeout && clearTimeout(scrollTimeout);
                                        scrollTimeout = null;
                                        $(document).unbind('mouseup.jsp', cancelClick);
                                    };
                                doScroll();
                                $(document).bind('mouseup.jsp', cancelClick);
                                return false;
                            }
                        }
                    );
                }

                if (isScrollableH) {
                    horizontalTrack.bind(
                        'mousedown.jsp',
                        function(e)
                        {
                            if (e.originalTarget === undefined || e.originalTarget == e.currentTarget) {
                                var clickedTrack = $(this),
                                    offset = clickedTrack.offset(),
                                    direction = e.pageX - offset.left - horizontalDragPosition,
                                    scrollTimeout,
                                    isFirst = true,
                                    doScroll = function()
                                    {
                                        var offset = clickedTrack.offset(),
                                            pos = e.pageX - offset.left - horizontalDragWidth / 2,
                                            contentDragX = paneWidth * settings.scrollPagePercent,
                                            dragX = dragMaxX * contentDragX / (contentWidth - paneWidth);
                                        if (direction < 0) {
                                            if (horizontalDragPosition - dragX > pos) {
                                                jsp.scrollByX(-contentDragX);
                                            } else {
                                                positionDragX(pos);
                                            }
                                        } else if (direction > 0) {
                                            if (horizontalDragPosition + dragX < pos) {
                                                jsp.scrollByX(contentDragX);
                                            } else {
                                                positionDragX(pos);
                                            }
                                        } else {
                                            cancelClick();
                                            return;
                                        }
                                        scrollTimeout = setTimeout(doScroll, isFirst ? settings.initialDelay : settings.trackClickRepeatFreq);
                                        isFirst = false;
                                    },
                                    cancelClick = function()
                                    {
                                        scrollTimeout && clearTimeout(scrollTimeout);
                                        scrollTimeout = null;
                                        $(document).unbind('mouseup.jsp', cancelClick);
                                    };
                                doScroll();
                                $(document).bind('mouseup.jsp', cancelClick);
                                return false;
                            }
                        }
                    );
                }
            }

            function removeClickOnTrack()
            {
                if (horizontalTrack) {
                    horizontalTrack.unbind('mousedown.jsp');
                }
                if (verticalTrack) {
                    verticalTrack.unbind('mousedown.jsp');
                }
            }

            function cancelDrag()
            {
                $('html').unbind('dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp');

                if (verticalDrag) {
                    verticalDrag.removeClass('jspActive');
                }
                if (horizontalDrag) {
                    horizontalDrag.removeClass('jspActive');
                }
            }

            function positionDragY(destY, animate)
            {console.log("isScrollableV:"+isScrollableV);
                if (!isScrollableV) {
                    return;
                }
                //if(destY===undefined)
                //{
                //    console.log("destY is undefined");
                //    var scrollableHeight = contentHeight - paneHeight;
                //    console.log("scrollableHeight:"+scrollableHeight);
                //    destY=scrollableHeight;
                //}
                 if (destY < 0) {
                    destY = 0;
                }
                else if (destY > dragMaxY) {
                    destY = dragMaxY;
                }

                // can't just check if(animate) because false is a valid value that could be passed in...
                if (animate === undefined) {
                    animate = settings.animateScroll;
                }
                if (animate) {
                    jsp.animate(verticalDrag, 'top', destY,	_positionDragY);
                } else {
                    verticalDrag.css('top', destY);
                    _positionDragY(destY);
                }

            }

            function _positionDragY(destY)
            {
                if (destY === undefined) {
                    destY = verticalDrag.position().top;
                }

                container.scrollTop(0);
                verticalDragPosition = destY || 0;

                var isAtTop = verticalDragPosition === 0,
                    isAtBottom = verticalDragPosition == dragMaxY,
                    percentScrolled = destY/ dragMaxY,
                    destTop = -percentScrolled * (contentHeight - paneHeight);

                if (wasAtTop != isAtTop || wasAtBottom != isAtBottom) {
                    wasAtTop = isAtTop;
                    wasAtBottom = isAtBottom;
                    elem.trigger('jsp-arrow-change', [wasAtTop, wasAtBottom, wasAtLeft, wasAtRight]);
                }

                updateVerticalArrows(isAtTop, isAtBottom);
                pane.css('top', destTop);
                elem.trigger('jsp-scroll-y', [-destTop, isAtTop, isAtBottom]).trigger('scroll');
            }

            function positionDragX(destX, animate)
            {
                if (!isScrollableH) {
                    return;
                }
                if (destX < 0) {
                    destX = 0;
                } else if (destX > dragMaxX) {
                    destX = dragMaxX;
                }

                if (animate === undefined) {
                    animate = settings.animateScroll;
                }
                if (animate) {
                    jsp.animate(horizontalDrag, 'left', destX,	_positionDragX);
                } else {
                    horizontalDrag.css('left', destX);
                    _positionDragX(destX);
                }
            }

            function _positionDragX(destX)
            {
                if (destX === undefined) {
                    destX = horizontalDrag.position().left;
                }

                container.scrollTop(0);
                horizontalDragPosition = destX ||0;

                var isAtLeft = horizontalDragPosition === 0,
                    isAtRight = horizontalDragPosition == dragMaxX,
                    percentScrolled = destX / dragMaxX,
                    destLeft = -percentScrolled * (contentWidth - paneWidth);

                if (wasAtLeft != isAtLeft || wasAtRight != isAtRight) {
                    wasAtLeft = isAtLeft;
                    wasAtRight = isAtRight;
                    elem.trigger('jsp-arrow-change', [wasAtTop, wasAtBottom, wasAtLeft, wasAtRight]);
                }

                updateHorizontalArrows(isAtLeft, isAtRight);
                pane.css('left', destLeft);
                elem.trigger('jsp-scroll-x', [-destLeft, isAtLeft, isAtRight]).trigger('scroll');
            }

            function updateVerticalArrows(isAtTop, isAtBottom)
            {
                if (settings.showArrows) {
                    arrowUp[isAtTop ? 'addClass' : 'removeClass']('jspDisabled');
                    arrowDown[isAtBottom ? 'addClass' : 'removeClass']('jspDisabled');
                }
            }

            function updateHorizontalArrows(isAtLeft, isAtRight)
            {
                if (settings.showArrows) {
                    arrowLeft[isAtLeft ? 'addClass' : 'removeClass']('jspDisabled');
                    arrowRight[isAtRight ? 'addClass' : 'removeClass']('jspDisabled');
                }
            }

            function scrollToY(destY, animate)
            {
                var percentScrolled = destY / (contentHeight - paneHeight);
                positionDragY(percentScrolled * dragMaxY, animate);
            }

            function scrollToX(destX, animate)
            {
                var percentScrolled = destX / (contentWidth - paneWidth);
                positionDragX(percentScrolled * dragMaxX, animate);
            }

            function scrollToElement(ele, stickToTop, animate)
            {
                var e, eleHeight, eleWidth, eleTop = 0, eleLeft = 0, viewportTop, viewportLeft, maxVisibleEleTop, maxVisibleEleLeft, destY, destX;

                // Legal hash values aren't necessarily legal jQuery selectors so we need to catch any
                // errors from the lookup...
                try {
                    e = $(ele);
                } catch (err) {
                    return;
                }
                //e = $(ele);
                console.log("e:"+e);
                eleHeight = e.outerHeight();
                console.log("eleHeight:"+eleHeight);
                eleWidth= e.outerWidth();

                container.scrollTop(0);
                container.scrollLeft(0);

                // loop through parents adding the offset top of any elements that are relatively positioned between
                // the focused element and the jspPane so we can get the true distance from the top
                // of the focused element to the top of the scrollpane...
                while (!e.is('.jspPane')) {
                    eleTop += e.offset().top;
                    eleLeft += e.offset().left;
                    e = e.offsetParent();
                    if (/^body|html$/i.test(e[0].nodeName)) {
                        // we ended up too high in the document structure. Quit!
                        return;
                    }
                }
               // eleTop=100;
                viewportTop = contentPositionY();
                maxVisibleEleTop = viewportTop + paneHeight;
                if (eleTop < viewportTop || stickToTop) { // element is above viewport
                    destY = eleTop - settings.horizontalGutter;
                } else if (eleTop + eleHeight > maxVisibleEleTop) { // element is below viewport
                    destY = eleTop - paneHeight + eleHeight + settings.horizontalGutter;
                }
                if (!isNaN(destY)) {
                    scrollToY(destY, animate);
                }

                //viewportLeft = contentPositionX();
                //maxVisibleEleLeft = viewportLeft + paneWidth;
                //if (eleLeft < viewportLeft || stickToTop) { // element is to the left of viewport
                //    destX = eleLeft - settings.horizontalGutter;
                //} else if (eleLeft + eleWidth > maxVisibleEleLeft) { // element is to the right viewport
                //    destX = eleLeft - paneWidth + eleWidth + settings.horizontalGutter;
                //}
                //if (!isNaN(destX)) {
                //    scrollToX(destX, animate);
                //}

            }

            function contentPositionX()
            {
                return -pane.position().left;
            }

            function contentPositionY()
            {
                return -pane.position().top;
            }

            function isCloseToBottom()
            {
                var scrollableHeight = contentHeight - paneHeight;
                return (scrollableHeight > 20) && (scrollableHeight - contentPositionY() < 10);
            }

            function isCloseToRight()
            {
                var scrollableWidth = contentWidth - paneWidth;
                return (scrollableWidth > 20) && (scrollableWidth - contentPositionX() < 10);
            }

            function initMousewheel()
            {
                container.unbind(mwEvent).bind(
                    mwEvent,
                    function (event, delta, deltaX, deltaY) {

                        if (!horizontalDragPosition) horizontalDragPosition = 0;
                        if (!verticalDragPosition) verticalDragPosition = 0;

                        var dX = horizontalDragPosition, dY = verticalDragPosition, factor = event.deltaFactor || settings.mouseWheelSpeed;
                        jsp.scrollBy(deltaX * factor, -deltaY * factor, false);
                        // return true if there was no movement so rest of screen can scroll
                        return dX == horizontalDragPosition && dY == verticalDragPosition;
                    }
                );
            }

            function removeMousewheel()
            {
                container.unbind(mwEvent);
            }

            function nil()
            {
                return false;
            }

            function initFocusHandler()
            {
                pane.find(':input,a').unbind('focus.jsp').bind(
                    'focus.jsp',
                    function(e)
                    {
                        scrollToElement(e.target, false);
                    }
                );
            }

            function removeFocusHandler()
            {
                pane.find(':input,a').unbind('focus.jsp');
            }

            function initKeyboardNav()
            {
                var keyDown, elementHasScrolled, validParents = [];
                isScrollableH && validParents.push(horizontalBar[0]);
                isScrollableV && validParents.push(verticalBar[0]);

                // IE also focuses elements that don't have tabindex set.
                pane.focus(
                    function()
                    {
                        elem.focus();
                    }
                );

                elem.attr('tabindex', 0)
                    .unbind('keydown.jsp keypress.jsp')
                    .bind(
                    'keydown.jsp',
                    function(e)
                    {
                        if (e.target !== this && !(validParents.length && $(e.target).closest(validParents).length)){
                            return;
                        }
                        var dX = horizontalDragPosition, dY = verticalDragPosition;
                        switch(e.keyCode) {
                            case 40: // down
                            case 38: // up
                            case 34: // page down
                            case 32: // space
                            case 33: // page up
                            case 39: // right
                            case 37: // left
                                keyDown = e.keyCode;
                                keyDownHandler();
                                break;
                            case 35: // end
                                scrollToY(contentHeight - paneHeight);
                                keyDown = null;
                                break;
                            case 36: // home
                                scrollToY(0);
                                keyDown = null;
                                break;
                        }

                        elementHasScrolled = e.keyCode == keyDown && dX != horizontalDragPosition || dY != verticalDragPosition;
                        return !elementHasScrolled;
                    }
                ).bind(
                    'keypress.jsp', // For FF/ OSX so that we can cancel the repeat key presses if the JSP scrolls...
                    function(e)
                    {
                        if (e.keyCode == keyDown) {
                            keyDownHandler();
                        }
                        return !elementHasScrolled;
                    }
                );

                if (settings.hideFocus) {
                    elem.css('outline', 'none');
                    if ('hideFocus' in container[0]){
                        elem.attr('hideFocus', true);
                    }
                } else {
                    elem.css('outline', '');
                    if ('hideFocus' in container[0]){
                        elem.attr('hideFocus', false);
                    }
                }

                function keyDownHandler()
                {
                    var dX = horizontalDragPosition, dY = verticalDragPosition;
                    switch(keyDown) {
                        case 40: // down
                            jsp.scrollByY(settings.keyboardSpeed, false);
                            break;
                        case 38: // up
                            jsp.scrollByY(-settings.keyboardSpeed, false);
                            break;
                        case 34: // page down
                        case 32: // space
                            jsp.scrollByY(paneHeight * settings.scrollPagePercent, false);
                            break;
                        case 33: // page up
                            jsp.scrollByY(-paneHeight * settings.scrollPagePercent, false);
                            break;
                        case 39: // right
                            jsp.scrollByX(settings.keyboardSpeed, false);
                            break;
                        case 37: // left
                            jsp.scrollByX(-settings.keyboardSpeed, false);
                            break;
                    }

                    elementHasScrolled = dX != horizontalDragPosition || dY != verticalDragPosition;
                    return elementHasScrolled;
                }
            }

            function removeKeyboardNav()
            {
                elem.attr('tabindex', '-1')
                    .removeAttr('tabindex')
                    .unbind('keydown.jsp keypress.jsp');
            }

            function observeHash()
            {
                if (location.hash && location.hash.length > 1) {
                    var e,
                        retryInt,
                        hash = escape(location.hash.substr(1)) // hash must be escaped to prevent XSS
                        ;
                    try {
                        e = $('#' + hash + ', a[name="' + hash + '"]');
                    } catch (err) {
                        return;
                    }

                    if (e.length && pane.find(hash)) {
                        // nasty workaround but it appears to take a little while before the hash has done its thing
                        // to the rendered page so we just wait until the container's scrollTop has been messed up.
                        if (container.scrollTop() === 0) {
                            retryInt = setInterval(
                                function()
                                {
                                    if (container.scrollTop() > 0) {
                                        scrollToElement(e, true);
                                        $(document).scrollTop(container.position().top);
                                        clearInterval(retryInt);
                                    }
                                },
                                50
                            );
                        } else {
                            scrollToElement(e, true);
                            $(document).scrollTop(container.position().top);
                        }
                    }
                }
            }

            function hijackInternalLinks()
            {
                // only register the link handler once
                if ($(document.body).data('jspHijack')) {
                    return;
                }

                // remember that the handler was bound
                $(document.body).data('jspHijack', true);

                // use live handler to also capture newly created links
                $(document.body).delegate('a[href*=#]', 'click', function(event) {
                    // does the link point to the same page?
                    // this also takes care of cases with a <base>-Tag or Links not starting with the hash #
                    // e.g. <a href="index.html#test"> when the current url already is index.html
                    var href = this.href.substr(0, this.href.indexOf('#')),
                        locationHref = location.href,
                        hash,
                        element,
                        container,
                        jsp,
                        scrollTop,
                        elementTop;
                    if (location.href.indexOf('#') !== -1) {
                        locationHref = location.href.substr(0, location.href.indexOf('#'));
                    }
                    if (href !== locationHref) {
                        // the link points to another page
                        return;
                    }

                    // check if jScrollPane should handle this click event
                    hash = escape(this.href.substr(this.href.indexOf('#') + 1));

                    // find the element on the page
                    element;
                    try {
                        element = $('#' + hash + ', a[name="' + hash + '"]');
                    } catch (e) {
                        // hash is not a valid jQuery identifier
                        return;
                    }

                    if (!element.length) {
                        // this link does not point to an element on this page
                        return;
                    }

                    container = element.closest('.jspScrollable');
                    jsp = container.data('jsp');

                    // jsp might be another jsp instance than the one, that bound this event
                    // remember: this event is only bound once for all instances.
                    jsp.scrollToElement(element, true);

                    if (container[0].scrollIntoView) {
                        // also scroll to the top of the container (if it is not visible)
                        scrollTop = $(window).scrollTop();
                        elementTop = element.offset().top;
                        if (elementTop < scrollTop || elementTop > scrollTop + $(window).height()) {
                            container[0].scrollIntoView();
                        }
                    }

                    // jsp handled this event, prevent the browser default (scrolling :P)
                    event.preventDefault();
                });
            }

            // Init touch on iPad, iPhone, iPod, Android
            function initTouch()
            {
                var startX,
                    startY,
                    touchStartX,
                    touchStartY,
                    moved,
                    moving = false;

                container.unbind('touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick').bind(
                    'touchstart.jsp',
                    function(e)
                    {
                        var touch = e.originalEvent.touches[0];
                        startX = contentPositionX();
                        startY = contentPositionY();
                        touchStartX = touch.pageX;
                        touchStartY = touch.pageY;
                        moved = false;
                        moving = true;
                    }
                ).bind(
                    'touchmove.jsp',
                    function(ev)
                    {
                        if(!moving) {
                            return;
                        }

                        var touchPos = ev.originalEvent.touches[0],
                            dX = horizontalDragPosition, dY = verticalDragPosition;

                        jsp.scrollTo(startX + touchStartX - touchPos.pageX, startY + touchStartY - touchPos.pageY);

                        moved = moved || Math.abs(touchStartX - touchPos.pageX) > 5 || Math.abs(touchStartY - touchPos.pageY) > 5;

                        // return true if there was no movement so rest of screen can scroll
                        return dX == horizontalDragPosition && dY == verticalDragPosition;
                    }
                ).bind(
                    'touchend.jsp',
                    function(e)
                    {
                        moving = false;
                        /*if(moved) {
                         return false;
                         }*/
                    }
                ).bind(
                    'click.jsp-touchclick',
                    function(e)
                    {
                        if(moved) {
                            moved = false;
                            return false;
                        }
                    }
                );
            }

            function destroy(s){
                var currentY = contentPositionY(),
                    currentX = contentPositionX();
                elem.removeClass('jspScrollable').unbind('.jsp');
                elem.replaceWith(originalElement.append(pane.children()));
                originalElement.scrollTop(currentY);
                originalElement.scrollLeft(currentX);

                // clear reinitialize timer if active
                if (reinitialiseInterval) {
                    clearInterval(reinitialiseInterval);
                }
            }

            function reIntialiseOnAddingDynamicContent(s)
            {
                console.log("in reinitialize n adding dynamically");
                //s=$.fn.jScrollPane.defaults;
                s = $.extend({}, settings, s);
                initialise(s);
            }
            // Public API
            $.extend(
                jsp,
                {
                    // Reinitialises the scroll pane (if it's internal dimensions have changed since the last time it
                    // was initialised). The settings object which is passed in will override any settings from the
                    // previous time it was initialised - if you don't pass any settings then the ones from the previous
                    // initialisation will be used.
                    reinitialise: function(s)
                    {
                        s = $.extend({}, settings, s);
                        initialise(s);
                    },
                    // Scrolls the specified element (a jQuery object, DOM node or jQuery selector string) into view so
                    // that it can be seen within the viewport. If stickToTop is true then the element will appear at
                    // the top of the viewport, if it is false then the viewport will scroll as little as possible to
                    // show the element. You can also specify if you want animation to occur. If you don't provide this
                    // argument then the animateScroll value from the settings object is used instead.
                    scrollToElement: function(ele, stickToTop, animate)
                    {
                        scrollToElement(ele, stickToTop, animate);
                    },
                    // Scrolls the pane so that the specified co-ordinates within the content are at the top left
                    // of the viewport. animate is optional and if not passed then the value of animateScroll from
                    // the settings object this jScrollPane was initialised with is used.
                    scrollTo: function(destX, destY, animate)
                    {
                        scrollToX(destX, animate);
                        scrollToY(destY, animate);
                    },
                    // Scrolls the pane so that the specified co-ordinate within the content is at the left of the
                    // viewport. animate is optional and if not passed then the value of animateScroll from the settings
                    // object this jScrollPane was initialised with is used.
                    scrollToX: function(destX, animate)
                    {
                        scrollToX(destX, animate);
                    },
                    // Scrolls the pane so that the specified co-ordinate within the content is at the top of the
                    // viewport. animate is optional and if not passed then the value of animateScroll from the settings
                    // object this jScrollPane was initialised with is used.
                    scrollToY: function(destY, animate)
                    {
                        scrollToY(destY, animate);
                    },
                    // Scrolls the pane to the specified percentage of its maximum horizontal scroll position. animate
                    // is optional and if not passed then the value of animateScroll from the settings object this
                    // jScrollPane was initialised with is used.
                    scrollToPercentX: function(destPercentX, animate)
                    {
                        scrollToX(destPercentX * (contentWidth - paneWidth), animate);
                    },
                    // Scrolls the pane to the specified percentage of its maximum vertical scroll position. animate
                    // is optional and if not passed then the value of animateScroll from the settings object this
                    // jScrollPane was initialised with is used.
                    scrollToPercentY: function(destPercentY, animate)
                    {
                        scrollToY(destPercentY * (contentHeight - paneHeight), animate);
                    },
                    // Scrolls the pane by the specified amount of pixels. animate is optional and if not passed then
                    // the value of animateScroll from the settings object this jScrollPane was initialised with is used.
                    scrollBy: function(deltaX, deltaY, animate)
                    {
                        jsp.scrollByX(deltaX, animate);
                        jsp.scrollByY(deltaY, animate);
                    },
                    // Scrolls the pane by the specified amount of pixels. animate is optional and if not passed then
                    // the value of animateScroll from the settings object this jScrollPane was initialised with is used.
                    scrollByX: function(deltaX, animate)
                    {
                        var destX = contentPositionX() + Math[deltaX<0 ? 'floor' : 'ceil'](deltaX),
                            percentScrolled = destX / (contentWidth - paneWidth);
                        positionDragX(percentScrolled * dragMaxX, animate);
                    },
                    // Scrolls the pane by the specified amount of pixels. animate is optional and if not passed then
                    // the value of animateScroll from the settings object this jScrollPane was initialised with is used.
                    scrollByY: function(deltaY, animate)
                    {
                        var destY = contentPositionY() + Math[deltaY<0 ? 'floor' : 'ceil'](deltaY),
                            percentScrolled = destY / (contentHeight - paneHeight);
                        positionDragY(percentScrolled * dragMaxY, animate);
                    },
                    // Positions the horizontal drag at the specified x position (and updates the viewport to reflect
                    // this). animate is optional and if not passed then the value of animateScroll from the settings
                    // object this jScrollPane was initialised with is used.
                    positionDragX: function(x, animate)
                    {
                        positionDragX(x, animate);
                    },
                    // Positions the vertical drag at the specified y position (and updates the viewport to reflect
                    // this). animate is optional and if not passed then the value of animateScroll from the settings
                    // object this jScrollPane was initialised with is used.
                    positionDragY: function(y, animate)
                    {
                        positionDragY(y, animate);
                    },
                    // This method is called when jScrollPane is trying to animate to a new position. You can override
                    // it if you want to provide advanced animation functionality. It is passed the following arguments:
                    //  * ele          - the element whose position is being animated
                    //  * prop         - the property that is being animated
                    //  * value        - the value it's being animated to
                    //  * stepCallback - a function that you must execute each time you update the value of the property
                    // You can use the default implementation (below) as a starting point for your own implementation.
                    animate: function(ele, prop, value, stepCallback)
                    {
                        var params = {};
                        params[prop] = value;
                        ele.animate(
                            params,
                            {
                                'duration'	: settings.animateDuration,
                                'easing'	: settings.animateEase,
                                'queue'		: false,
                                'step'		: stepCallback
                            }
                        );
                    },
                    // Returns the current x position of the viewport with regards to the content pane.
                    getContentPositionX: function()
                    {
                        return contentPositionX();
                    },
                    // Returns the current y position of the viewport with regards to the content pane.
                    getContentPositionY: function()
                    {
                        return contentPositionY();
                    },
                    // Returns the width of the content within the scroll pane.
                    getContentWidth: function()
                    {
                        return contentWidth;
                    },
                    // Returns the height of the content within the scroll pane.
                    getContentHeight: function()
                    {
                        return contentHeight;
                    },
                    // Returns the horizontal position of the viewport within the pane content.
                    getPercentScrolledX: function()
                    {
                        return contentPositionX() / (contentWidth - paneWidth);
                    },
                    // Returns the vertical position of the viewport within the pane content.
                    getPercentScrolledY: function()
                    {
                        return contentPositionY() / (contentHeight - paneHeight);
                    },
                    // Returns whether or not this scrollpane has a horizontal scrollbar.
                    getIsScrollableH: function()
                    {
                        return isScrollableH;
                    },
                    // Returns whether or not this scrollpane has a vertical scrollbar.
                    getIsScrollableV: function()
                    {
                        return isScrollableV;
                    },
                    // Gets a reference to the content pane. It is important that you use this method if you want to
                    // edit the content of your jScrollPane as if you access the element directly then you may have some
                    // problems (as your original element has had additional elements for the scrollbars etc added into
                    // it).
                    getContentPane: function()
                    {
                        return pane;
                    },
                    // Scrolls this jScrollPane down as far as it can currently scroll. If animate isn't passed then the
                    // animateScroll value from settings is used instead.
                    scrollToBottom: function(animate)
                    {
                        console.log("scrollTobottom Called:"+dragMaxY);
                        positionDragY(dragMaxY, animate);
                    },
                    // Hijacks the links on the page which link to content inside the scrollpane. If you have changed
                    // the content of your page (e.g. via AJAX) and want to make sure any new anchor links to the
                    // contents of your scroll pane will work then call this function.
                    hijackInternalLinks: $.noop,
                    // Removes the jScrollPane and returns the page to the state it was in before jScrollPane was
                    // initialised.
                    destroy: function()
                    {
                        destroy();
                    },

                    reIntialiseOnAddingDynamicContent: function()
                    {
                        reIntialiseOnAddingDynamicContent();
                    }
                }
            );

            initialise(s);
        }

        // Pluginifying code...
        settings = $.extend({}, $.fn.jScrollPane.defaults, settings);

        // Apply default speed
        $.each(['arrowButtonSpeed', 'trackClickSpeed', 'keyboardSpeed'], function() {
            settings[this] = settings[this] || settings.speed;
        });

        return this.each(
            function()
            {
                var elem = $(this), jspApi = elem.data('jsp');
                if (jspApi) {
                    jspApi.reinitialise(settings);
                } else {
                    $("script",elem).filter('[type="text/javascript"],:not([type])').remove();
                    jspApi = new JScrollPane(elem, settings);
                    elem.data('jsp', jspApi);
                }
            }
        );
    };

    $.fn.jScrollPane.defaults = {
        showArrows					: false,
        maintainPosition			: false,
        stickToBottom				: false,
        stickToRight				: false,
        clickOnTrack				: true,
        autoReinitialise			: false,
        autoReinitialiseDelay		: 500,
        verticalDragMinHeight		: 0,
        verticalDragMaxHeight		: 99999,
        horizontalDragMinWidth		: 0,
        horizontalDragMaxWidth		: 99999,
        contentWidth				: undefined,
        animateScroll				: true,
        animateDuration				: 300,
        animateEase					: 'linear',
        hijackInternalLinks			: false,
        verticalGutter				: 4,
        horizontalGutter			: 4,
        mouseWheelSpeed				: 5,
        arrowButtonSpeed			: 0,
        arrowRepeatFreq				: 50,
        arrowScrollOnHover			: false,
        trackClickSpeed				: 0,
        trackClickRepeatFreq		: 70,
        verticalArrowPositions		: 'split',
        horizontalArrowPositions	: 'split',
        enableKeyboardNavigation	: true,
        hideFocus					: true,
        keyboardSpeed				: 0,
        initialDelay                : 300,        // Delay before starting repeating
        speed						: 40,		// Default speed when others falsey
        scrollPagePercent			: .8		// Percent of visible area scrolled when pageUp/Down or track area pressed
    };

},this));

(function() {
    angular.module("ngJScrollPane", []);

    angular.module("ngJScrollPane").directive("scrollPane", [
        '$timeout', function($timeout) {
            return {
                restrict: 'A',
                transclude: true,
                template: '<div class="scroll-pane"><div id="transclude" ng-transclude></div></div>',
                link: function($scope, $elem, $attrs) {
                    var config, fn;
                    config = {};
                    if ($attrs.scrollConfig) {
                        config = $scope.$eval($attrs.scrollConfig);
                    }
                    $scope.$on("initialize-pane",function(event,id){
                        console.log("initialize-pane:"+id);
                        jQuery("#" + id).jScrollPane(config);
                        return $scope.pane = jQuery("#" + id).data("jsp");
                    });
                    // fn = function() {
                    //    jQuery("#" + $attrs.id).jScrollPane(config);
                    //    return $scope.pane = jQuery("#" + $attrs.id).data("jsp");
                    // };
                    // if ($attrs.scrollTimeout) {
                    //   $timeout(fn, $scope.$eval($attrs.scrollTimeout));
                    // } else {
                    //   fn();
                    // }
                    return $scope.$on("reinit-pane", function(event, id) {
                        if (id === $attrs.id && $scope.pane) {
                            console.log("Reinit pane " + id);
                            settings ={
                                verticalDragMinHeight: 10
                            };
                            $scope.pane.reinitialise(settings);
                            $scope.pane.scrollToBottom(true);
                        }
                    });
                },
                replace: true
            };
        }
    ]);

}).call(this);
