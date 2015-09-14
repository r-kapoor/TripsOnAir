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
        console.log('addMarker:'+JSON.stringify(position)+' char:'+ char);
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
        removeRoutePaths();
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
