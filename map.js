// Geojson provided by http://zetashapes.com/

$(document).ready(function(){

var promise1 = $.getJSON("nyc.geojson");
var promise2 = $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?", { tagmode: "any", format: "json" });

  $.when(promise1, promise2).fail(function(){alert("data error");}).done(function(promise1, promise2) {

    var map;
    var infoWindow;
    var features = promise1[0].features;
    var obArr = [];
    var coordArr = [];
    var labelArr = [];
    infoWindow = new google.maps.InfoWindow();

    function showArrays(event) {

      var contentString = '<h2>' + this.label + '</h2><br>';
      var feedString = function(name) {
        var flickrImg = $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?", { tags: name, tagmode: "any", format: "json" }).done(function(data) {
          var imgArr = [];

          for (var i = 0; i < 8; i +=1) {
            var images = data.items[i].media.m;
            imgArr.push(images);
          }

          contentString += '<div id="image-container"><div><img width="140" src="' + imgArr[0] + '">' +
                            '<img width="140" src="' + imgArr[1] + '"></div>' +
                            '<div><img width="140" src="' + imgArr[2] + '">' +
                            '<img width="140" src="' + imgArr[3] + '"></div>' +
                            '<div><img width="140" src="' + imgArr[4] + '">' +
                            '<img width="140" src="' + imgArr[5] + '"></div>' +
                            '<div><img width="140" src="' + imgArr[6] + '">' +
                            '<img width="140" src="' + imgArr[7] + '"></div></div>';

          infoWindow.setContent(contentString);
        });
      };

      feedString(this.label);
      infoWindow.setPosition(event.latLng);
      infoWindow.open(map);

    }

    function initialize() {
      var mapOptions = {
        center: new google.maps.LatLng(40.7843865, -73.9544081),
        zoom: 12
        };

      map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

      for (var i = 0; i < features.length; i += 1){
        obArr.push(features[i]);
      }

      function create(arr) {
        for (var i = 0; i < arr.length; i += 1) {
          var coord = arr[i].geometry.coordinates[0];

            for (var j = 0; j < coord.length; j += 1) {
              var a = coord[j][0];
              var b = coord[j][1];
              a = Number(a);
              b = Number(b);
              coordArr.push(new google.maps.LatLng(b,a));
            }

            var poly;

            poly = new google.maps.Polygon({
            paths: coordArr,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.25
            });

            poly.label = features[i].properties.label;
            poly.setMap(map);

            google.maps.event.addListener(poly,"mouseover",function(){
              this.setOptions({fillOpacity: 0.85});
            });

            google.maps.event.addListener(poly,"mouseout",function(){
              this.setOptions({fillOpacity: 0.25});
            });

            google.maps.event.addListener(poly, 'click', showArrays);

            coordArr = [];
          }
        }
    create(obArr);
    }

  google.maps.event.addDomListener(window, 'load', initialize);

  });

});