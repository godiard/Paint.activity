/* Initialization of the UI */
function initGui() {
  PaintApp.elements.canvas = document.getElementById('paint-canvas');
  PaintApp.elements.canvas.style.height = parseInt(window.innerHeight) - 55 + "px"
  PaintApp.elements.canvas.style.width = parseInt(window.innerWidth) + "px"
  paper.setup(PaintApp.elements.canvas);

  PaintApp.data.tool = new paper.Tool();
  PaintApp.data.tool.distanceThreshold = 0;

  PaintApp.modes.Text.initGui();
  PaintApp.modes.Eraser.initGui();
  PaintApp.modes.Pen.initGui();
  PaintApp.modes.Bucket.initGui();
  PaintApp.modes.Stamp.initGui();
  PaintApp.modes.Copy.initGui();
  PaintApp.modes.Paste.initGui();

  PaintApp.palettes.filtersPalette.initGui();
  PaintApp.palettes.drawingsPalette.initGui();
  PaintApp.palettes.colorPalette.initGui();

  initPresence();

/*  var networkButton = document.getElementById("network-button");
   presencepalette = new presencepalette.PresencePalette(networkButton, undefined);
   presencepalette.addEventListener('shared', shareActivity);
   */

  PaintApp.buttons.sizeButton.initGui();
  PaintApp.buttons.clearButton.initGui();
  PaintApp.buttons.undoButton.initGui();
  PaintApp.buttons.redoButton.initGui();

  PaintApp.displayUndoRedoButtons();
  PaintApp.elements.penButton.click();
  window.scrollTo(0, -1000)
  PaintApp.switchMode("Pen");
  window.onresize = onResize
}


function onResize() {

  var canvas = PaintApp.elements.canvas;
  var image = canvas.toDataURL();

  PaintApp.elements.canvas.style.height = parseInt(window.innerHeight) - 55 + "px"
  PaintApp.elements.canvas.style.width = parseInt(window.innerWidth) + "px"

  PaintApp.elements.canvas.setAttribute("width", PaintApp.elements.canvas.getBoundingClientRect().width)
  PaintApp.elements.canvas.setAttribute("height", parseInt(window.innerHeight) - 55)

  var ctx = canvas.getContext('2d');
  var img = new Image;

  img.onload = function() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    ctx.restore();
  };

  img.src = image;
}

function initPresence() {
  var networkButton = document.getElementById("network-button");
		presencepalette = new PaintApp.palettes.presencePalette.PresencePalette(networkButton, undefined);
		presencepalette.addEventListener('shared', shareActivity);

		// Launched with a shared id, activity is already shared
		if (window.top.sugar.environment.sharedId) {
			shareActivity();
			presencepalette.setShared(true);
		}
}
