import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-mouse-position';
import * as tf from '@tensorflow/tfjs';

const samplePolygon = L.polygon([
  [-4.042968750000001, 2.1176816099851083],
  [-1.634765490889549, 4.924589343401756],
  [ 2.513672411441803, 5.204741041764144],
  [ 7.576171606779099, 4.854532792931999],
  [ 7.576171606779099, 3.258983314545306],
  [ 5.994140356779099, 1.2391610649483282],
  [ 4.412109106779099, 1.5203286348304514],
  [ 3.498047143220902, 2.574327983494544],
  [ 1.792968884110451, 3.048365584499324],
  [ 1.335937902331352, 1.4324671960870323],
  [ 2.636718750000000, 0.21972602392080884],
  [ 4.886719286441804, -0.008788928355074324],
  [ 6.591796875000001, -1.8014609294680355],
  [ 6.082030981779099, -3.188782496583868],
  [ 4.130859375000001, -4.749434858640033],
  [ 1.001953259110450, -3.9256363494468745],
  [-2.320312634110451, -3.5923720419631144],
  [-3.849609307944774, -1.5027572298285927],
]);

export function initMap() {
  /* This code is needed to properly load the images in the Leaflet CSS */
  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });

  const map = L.map('map');

  const reconstructionItems = L.featureGroup().addTo(map);
  const animationItems = L.featureGroup().addTo(map);
  const drawnItems = L.featureGroup().addTo(map);
  drawnItems.addLayer(samplePolygon);

  // Controls
  L.control.mousePosition().addTo(map);
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

  const defaultCenter = [2, 0];
  const defaultZoom = 5;
  map.setView(defaultCenter, defaultZoom);

  return {map, drawnItems, reconstructionItems, animationItems}
}

export function drawReconstruction(featureGroup, coordinates) {
  featureGroup.eachLayer((layer) => {
    layer.setStyle({
      opacity: layer.options.opacity ? layer.options.opacity * 0.3 : 0.5,
      fillOpacity: layer.options.fillOpacity ? layer.options.fillOpacity * 0.3 : 0.1
    })
  });
  const reconstructionPolygon = L.polygon(coordinates, {color: 'orange'});
  featureGroup.addLayer(reconstructionPolygon);
}

export function animateEllipses(featureGroup, ellipses, locus) {
  featureGroup.clearLayers();

  // Already add the centroid to the first polygon
  const locusTensor = tf.tensor(locus);
  const firstEllipse = tf.tensor([ellipses[0]])
    .add(locusTensor);
  // Re-assemble the offset first poly with the other polygons
  const ellipsesTensor = tf.concat([
    firstEllipse,
    tf.tensor(ellipses.slice([1], [ellipses.length])) // auto-resolves to undefined if only one ellipse
  ]);

  ellipses = ellipsesTensor.arraySync();

  // Draw the first polygon as is
  // const ellipsePolygon = L.polygon(ellipses[0], {color: 'green'});
  // featureGroup.addLayer(ellipsePolygon);
  //
  // Re-arrange to have list of points, each element of which contains the cooordinates for each ellipse
  const pointSets = ellipsesTensor.transpose([1, 0, 2]).arraySync();
  const timeout = 100;

  // Iterate over the points
  const pointSetIndex = 0;

  function drawEllipses(pointSets, pointIndex, ellipses) {
    return setTimeout(() => {
      const pointSetTensor = tf.tensor(pointSets[pointIndex]);

      ellipses.forEach((ellipse, index) => {
        const ellipseTensor = tf.tensor(ellipse);
        let offsetSum = tf.tensor([0, 0]);

        let centroid;
        if (index > 0) {
          // Compute the offset sum of the previous ellipses
          offsetSum = pointSetTensor.slice([0], [index])
            .sum(0);
          centroid = offsetSum.arraySync();
        } else {
          centroid = ellipseTensor.mean(0).arraySync();
        }

        ellipse = ellipseTensor.add(offsetSum).arraySync();
        plotEllipse(featureGroup, ellipse);
        plotLine(featureGroup, centroid, ellipse[pointIndex]);
      });

      if (pointIndex < pointSets.length - 1){
        drawEllipses(pointSets, pointIndex + 1, ellipses)
      }

      return featureGroup.eachLayer((layer) => {
        layer.setStyle({
          opacity: layer.options.opacity ? layer.options.opacity * 0.5 : 0.5,
          fillOpacity: layer.options.fillOpacity ? layer.options.fillOpacity * 0.5 : 0.2
        });

        if (layer.options.opacity < 0.1) {
          featureGroup.removeLayer(layer);
        }
      });
    }, timeout);
  }

  drawEllipses(pointSets, pointSetIndex, ellipses);
}

function plotEllipse(featureGroup, ellipse) {
  const ellipsePoly = L.polygon(ellipse, {color: 'green'});
  featureGroup.addLayer(ellipsePoly);
}

function plotLine(featureGroup, centroid, target) {
  /**
   * Plots a yellow line on a feature group from a centroid to a target coordinate
   */

  const line = L.polyline([centroid, target], {color: 'yellow'});
  return featureGroup.addLayer(line);
}