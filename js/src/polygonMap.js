import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

const samplePolygon = L.polygon([
  [-4.042968750000001, 2.1176816099851083],
  [-1.6347654908895493, 4.924589343401756],
  [2.5136724114418034, 5.204741041764144],
  [7.576171606779099, 4.854532792931999],
  [7.576171606779099, 3.258983314545306],
  [5.994140356779099, 1.2391610649483282],
  [4.412109106779099, 1.5203286348304514],
  [3.498047143220902, 2.574327983494544],
  [1.792968884110451, 3.048365584499324],
  [1.3359379023313522, 1.4324671960870323],
  [2.6367187500000004, 0.21972602392080884],
  [4.886719286441804, -0.008788928355074324],
  [6.591796875000001, -1.8014609294680355],
  [6.082030981779099, -3.188782496583868],
  [4.130859375000001, -4.749434858640033],
  [1.0019532591104507, -3.9256363494468745],
  [-2.320312634110451, -3.5923720419631144],
  [-3.8496093079447746, -1.5027572298285927],
]);

function initMap() {
  /* This code is needed to properly load the images in the Leaflet CSS */
  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });

  const map = L.map('map');

  const drawnItems = L.featureGroup().addTo(map);
  drawnItems.addLayer(samplePolygon);

  map.addControl(new L.Control.Draw({
    draw: {
      polygon: {
        allowIntersection: false,
        showArea: false
      },
      polyline : false,
      rectangle : false,
      circle : false,
      marker: false,
      circlemarker: false
    },
    edit: false
  }));

  const defaultCenter = [0, 0];
  const defaultZoom = 6;
  map.setView(defaultCenter, defaultZoom);

  return {map, drawnItems}
}

export default initMap;
