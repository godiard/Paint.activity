/* Start of the app, we require everything that is needed */
define(function(require) {
  var activity = require("sugar-web/activity/activity");

  window.PaintApp = require("activity/paint-app");
  require("activity/paint-activity");

  PaintApp.libs.activity = activity;

  /* Fetching and storing of the palettes */
  PaintApp.palettes.presencePalette = require("sugar-web/graphics/presencepalette");
  PaintApp.palettes.colorPalette = require("activity/palettes/color-palette");
  PaintApp.palettes.stampPalette = require("activity/palettes/stamp-palette");
  PaintApp.palettes.textPalette = require("activity/palettes/text-palette");
  PaintApp.palettes.drawingsPalette = require("activity/palettes/drawings-palette");
  PaintApp.palettes.filtersPalette = require("activity/palettes/filters-palette");

  /* Fetching and storing of the buttons */
  PaintApp.buttons.sizeButton = require("activity/buttons/size-button");
  PaintApp.buttons.clearButton = require("activity/buttons/clear-button");
  PaintApp.buttons.undoButton = require("activity/buttons/undo-button");
  PaintApp.buttons.redoButton = require("activity/buttons/redo-button");

  /* Fetching and storing of the modes */
  PaintApp.modes.Pen = require("activity/modes/modes-pen");
  PaintApp.modes.Eraser = require("activity/modes/modes-eraser");
  PaintApp.modes.Bucket = require("activity/modes/modes-bucket");
  PaintApp.modes.Text = require("activity/modes/modes-text");
  PaintApp.modes.Stamp = require("activity/modes/modes-stamp");
  PaintApp.modes.Copy = require("activity/modes/modes-copy");
  PaintApp.modes.Paste = require("activity/modes/modes-paste");


  require(['domReady!', 'sugar-web/datastore', 'paper-core', 'mustache', 'lzstring'], function(doc, datastore, _paper, mustache, lzstring) {

    /* Fetching and storing libraries */
    PaintApp.libs.mustache = mustache;
    PaintApp.libs.lzstring = lzstring;

    //Setup of the activity
    activity.setup();

    //Get user color
    activity.getXOColor(function(s, color) {
      if (color !== undefined) {
        PaintApp.data.color = color;
      }
    });

    /* Fetch and store UI elements */
    initGui();

    //Fetch of the history if not starting shared
    if (!window.top.sugar.environment.sharedId) {
      activity.getDatastoreObject().loadAsText(function(error, metadata, jsonData) {
        var data = JSON.parse(jsonData);
        if (data !== undefined) {
          PaintApp.data.painting = data;
        }
      });
    }

    // If starting in shared mode, we disable undo/redo
    if (window.top.sugar.environment.sharedId) {
      PaintApp.data.isHost = false;
      PaintApp.buttons.undoButton.hideGui();
      PaintApp.buttons.redoButton.hideGui();
      PaintApp.displayUndoRedoButtons();
      shareActivity();
    }

  });

});

/* Enabling an activity to be shared with the presenceObject */
function shareActivity() {
  var activity = PaintApp.libs.activity;
  PaintApp.data.presence = activity.getPresenceObject(function(error, presence) {
    // Unable to join
    if (error) {
      console.log("error");
      return;
    }

    PaintApp.data.isShared = true;


    // Store settings
    userSettings = presence.getUserInfo();
    console.log("connected");

    // Not found, create a new shared activity
    if (!window.top.sugar.environment.sharedId) {
      presence.createSharedActivity('org.olpcfrance.PaintActivity', function(groupId) {});
    }

    // Show a disconnected message when the WebSocket is closed.
    presence.onConnectionClosed(function(event) {
      console.log(event);
      console.log("Connection closed");
    });

    // Display connection changed
    presence.onSharedActivityUserChanged(function(msg) {
      PaintApp.onSharedActivityUserChanged(msg);
    });

    // Handle messages received
    presence.onDataReceived(function(msg) {
      PaintApp.onDataReceived(msg);

    });
  });
}
