import initMap from './polygonMap';
import JogDial from './jogDial';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import L from "leaflet";
import {efd, efdOffsets} from "./efdCoefficients";
import updateRows from "./tableRowsFromCoefficients";

const {map, drawnItems} = initMap();
const numEllipsesInput = document.getElementById('num_ellipses');
const tableBody = document.getElementById('coefficients_table_body');
const locusBox = document.getElementById('locus');

map.on(L.Draw.Event.CREATED, (event) => {
  drawnItems.eachLayer((layer) => drawnItems.removeLayer(layer));
  const layer = event.layer;
  drawnItems.addLayer(layer);
  const drawnPoints = event.layer.editing.latlngs[0][0];
  console.log(drawnPoints);

  // Reverse axis order to match x-longitude/y-latitude!
  const coords = drawnPoints.map(latLng => [latLng.lng, latLng.lat]);
  const numberOfEllipses = Number(numEllipsesInput.value);

  efdOffsets(coords)
    .then(offsets => offsets.map(offset => offset.toPrecision(8)))
    .then(offsets => locusBox.value = offsets)
    .catch(console.error);

  return efd(coords, numberOfEllipses)
    .then((coefficients) => updateRows(tableBody, coefficients))
    .catch(console.error)
});

const options = {
  debug: false,
  wheelSize: "80%",
  minDegree: 1
};

const jogDial = document.getElementById('jog_dial');

JogDial(jogDial, options)
  .on("mouseup", (event) => {
    const numberOfEllipses = Math.round(event.target.rotation * 0.25);
    numEllipsesInput.value = numberOfEllipses;

    let layers = [];
    drawnItems.eachLayer((layer) => layers.push(layer));
    const drawnPoints = layers[0].editing.latlngs[0][0];
    const coords = drawnPoints.map(latLng => [latLng.lng, latLng.lat]);

    efdOffsets(coords)
      .then(offsets => offsets.map(offset => offset.toPrecision(8)))
      .then(offsets => locusBox.value = offsets)
      .catch(console.error);

    return efd(coords, numberOfEllipses)
      .then((coefficients) => updateRows(tableBody, coefficients))
      .catch(console.error)
  });
