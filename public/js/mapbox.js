console.log('helo')

const locations = JSON.parse( document.getElementById('map').dataset.locations);
// console.log(locations)
var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {});
map.setView({
    mapTypeId: Microsoft.Maps.MapTypeId.aerial,
    center: new Microsoft.Maps.Location(35.027222, -111.0225),
    zoom: 15
});