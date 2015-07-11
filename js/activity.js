/* Start of the app, we require everything that is needed */
define(function(require) {
  var activity = require("sugar-web/activity/activity");

  window.PaintApp = require("activity/paint-app");
  require("activity/paint-activity");

  PaintApp.libs.activity = activity;

  PaintApp.palettes.colorPalette = require("activity/palettes/color-palette");
  PaintApp.palettes.stampPalette = require("activity/palettes/stamp-palette");
  PaintApp.palettes.textPalette = require("activity/palettes/text-palette");
  PaintApp.palettes.drawingsPalette = require("activity/palettes/drawings-palette");
  PaintApp.palettes.filtersPalette = require("activity/palettes/filters-palette");

  PaintApp.buttons.sizeButton = require("activity/buttons/size-button");
  PaintApp.buttons.clearButton = require("activity/buttons/clear-button");
  PaintApp.buttons.undoButton = require("activity/buttons/undo-button");
  PaintApp.buttons.redoButton = require("activity/buttons/redo-button");


  PaintApp.modes.Pen = require("activity/modes/modes-pen");
  PaintApp.modes.Eraser = require("activity/modes/modes-eraser");
  PaintApp.modes.Bucket = require("activity/modes/modes-bucket");
  PaintApp.modes.Text = require("activity/modes/modes-text");
  PaintApp.modes.Stamp = require("activity/modes/modes-stamp");
  PaintApp.modes.Copy = require("activity/modes/modes-copy");
  PaintApp.modes.Paste = require("activity/modes/modes-paste");


  require(['domReady!', 'sugar-web/datastore', 'paper-core', 'mustache'], function(doc, datastore, _paper, mustache) {

    //Setup of the activity
    PaintApp.libs.mustache = mustache;
    activity.setup();

    //Get user color
    activity.getXOColor(function(s, color) {
      if (color !== undefined) {
        PaintApp.data.color = color;
      }
    });

    //Fetch of the history
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
