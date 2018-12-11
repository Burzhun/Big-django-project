$(function () {
    if (typeof google !== 'undefined') {
        var latlng = new google.maps.LatLng(55.798302, 37.604549);
        var myOptions = {
            zoom: 16,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"),
            myOptions);
        new google.maps.Marker({
            position: latlng,
            map: map,
            title: "Издательский дом Москоутаймс"
        });
    }
});