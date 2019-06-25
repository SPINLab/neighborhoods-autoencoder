import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

/* This code is needed to properly load the images in the Leaflet CSS */
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const map = L.map('map');

const drawnItems = L.featureGroup().addTo(map);

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

map.on(L.Draw.Event.CREATED, function (event) {
  const layer = event.layer;
  drawnItems.addLayer(layer);
  const drawnCoords = event.layer.editing.latlngs[0][0];
});

const defaultCenter = [0, 0];
const defaultZoom = 12;
map.setView(defaultCenter, defaultZoom);
