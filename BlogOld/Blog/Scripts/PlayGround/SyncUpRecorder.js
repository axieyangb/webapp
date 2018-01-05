var searchStartDate = '2016-01-01';
var searchEndDate = '2019-12-31';
var tripRecordTable = null;
$(document).ready(function() {
    initMap();
    tripRecordTable = $('#tripRecordTable').DataTable();
    getTrips();
});


function initMap() {
    var width = $('#mapSection').width();
    var height = $(window).height() - $('#mapSection').offset().top - $('#sub-title').height();
    $('#map').height(Math.min(width, height));
    var map = new google.maps.Map(document.getElementById('map'),
        {
            zoom: 3,
            center: { lat: 0, lng: -180 },
            mapTypeId: 'terrain'
        });

    var flightPlanCoordinates = [
        { lat: 37.772, lng: -122.214 },
        { lat: 21.291, lng: -157.821 },
        { lat: -18.142, lng: 178.431 },
        { lat: -27.467, lng: 153.027 }
    ];

    var flightPath = new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    flightPath.setMap(map);
}


function getTrips() {
    $.ajax({
        method: 'post',
        url: 'GetTripRecord',
        data: {
            startDate: searchStartDate,
            endDate: searchEndDate
        }
    }).done(function (res) {
        var trips = JSON.parse(res);
        
        for (var i = 0; i < trips.length; i++) {
            var trip = trips[i];
            tripRecordTable.row.add([
                trip.StartTime,
                trip.EndTime,
                trip.Minutes,
                trip.Miles,
                trip.StartAddress,
                trip.EndAddress
            ]);
        }

    tripRecordTable.draw();
       
    });
}