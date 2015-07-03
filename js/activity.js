/* Start of the app, we require everything that is needed */
define(function(require) {
  var activity = require("sugar-web/activity/activity");
  var colorpalette = require("activity/colorpalette");
  var stamppalette = require("activity/stamppalette");

  require("activity/paint-app");
  require("activity/paint-app");
  require("activity/paint-activity");
  PaintApp.libs.activity = activity;

  require(['domReady!', 'sugar-web/datastore', 'paper-core', 'mustache', 'interact'], function(doc, datastore, _paper, mustache, interact) {


    interact('.draggable')
      .draggable({
        inertia: false,
        restrict: {
          endOnly: false,
          elementRect: {
            top: 0,
            left: 0,
            bottom: 1,
            right: 1
          }
        },
        onmove: dragMoveListener,
      });

    function dragMoveListener(event) {
      var target = event.target,
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      target.style.webkitTransform =
        target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    }

    window.dragMoveListener = dragMoveListener


    //Launch of the activity, color and data fetch
    PaintApp.libs.colorpalette = colorpalette;
    PaintApp.libs.stamppalette = stamppalette;
    PaintApp.libs.mustache = mustache;
    activity.setup();
    activity.getXOColor(function(s, color) {
      if (color !== undefined) {
        PaintApp.data.buddyColor = color;
      }
    });

    activity.getDatastoreObject().loadAsText(function(error, metadata, jsonData) {
      var data = JSON.parse(jsonData);
      if (data !== undefined) {
        PaintApp.data.painting = data;
      }
    });

    //We can launch the app
    initGui();
  });

});
