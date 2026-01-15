var map = L.map('map').setView([35.1072, -83.0930], 14); // Center on Cashiers, NC

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var routingControl = L.Routing.control({
    waypoints: [],
    routeWhileDragging: true,
    geocoder: L.Control.Geocoder.nominatim(),
    show: true,
    collapsible: true
}).addTo(map);

function calculateRoute() {
    var startAddr = document.getElementById('startAddress').value.trim();
    var endAddr = document.getElementById('endAddress').value.trim();

    if (!startAddr || !endAddr) {
        alert('Please enter both start and end addresses.');
        return;
    }

    routingControl.setWaypoints([]);

    L.Control.Geocoder.nominatim().geocode(startAddr, function(results) {
        if (results && results.length > 0) {
            var startPoint = results[0].center;

            L.Control.Geocoder.nominatim().geocode(endAddr, function(endResults) {
                if (endResults && endResults.length > 0) {
                    var endPoint = endResults[0].center;

                    routingControl.setWaypoints([
                        L.latLng(startPoint.lat, startPoint.lng),
                        L.latLng(endPoint.lat, endPoint.lng)
                    ]);

                    routingControl.on('routesfound', function(e) {
                        var bounds = L.latLngBounds(e.routes[0].coordinates);
                        map.fitBounds(bounds);
                    });
                } else {
                    alert('Could not find end address.');
                }
            });
        } else {
            alert('Could not find start address.');
        }
    });
}

// Automatically calculate route with defaults on page load
window.onload = function() {
    calculateRoute();
};
