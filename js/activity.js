/* Start of the app, we require everything that is needed */
define(function(require) {
  var activity = require("sugar-web/activity/activity");
  var colorpalette = require("activity/colorpalette");
  var stamppalette = require("activity/stamppalette");

  require("activity/paint-app");
  require("activity/paint-activity");
  PaintApp.libs.activity = activity;

  require(['domReady!', 'sugar-web/datastore', 'paper-core'], function(doc, datastore, _paper) {
    //Launch of the activity, color and data fetch
    PaintApp.libs.colorpalette = colorpalette;
    PaintApp.libs.stamppalette = stamppalette;
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
