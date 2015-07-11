/* Initialization of the UI */
function initGui() {
  PaintApp.elements.canvas = document.getElementById('paint-canvas');
  PaintApp.elements.canvas.style.height = parseInt(window.innerHeight) - 55 + "px"
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

  PaintApp.buttons.sizeButton.initGui();
  PaintApp.buttons.clearButton.initGui();
  PaintApp.buttons.undoButton.initGui();
  PaintApp.buttons.redoButton.initGui();
  PaintApp.buttons.redoButton.initGui();

  PaintApp.displayUndoRedoButtons();
  PaintApp.elements.penButton.click();
  window.scrollTo(0, -1000)
  PaintApp.switchMode("Pen");
}
