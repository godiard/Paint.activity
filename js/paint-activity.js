/* Function to disable all active class inside the toolbar */
function paletteRemoveActiveClass() {
  var paletteElements = [
    PaintApp.elements.penButton,
    PaintApp.elements.stampsButton
  ];

  for (var i = 0; i < paletteElements.length; i++) {
    paletteElements[i].className = paletteElements[i].className.replace(/(?:^|\s)active(?!\S)/g, '');
  }
}

/* Function to add active class to a specific element */
function addActiveClassToElement(element) {
  element.className += " active";
}

/* Initialization of the UI */
function initGui() {
  var canvas = document.getElementById('canvas');
  paper.setup(canvas);

  PaintApp.data.tool = new paper.Tool();
  PaintApp.data.tool.distanceThreshold = 0;
  PaintApp.switchMode("Pen");

  PaintApp.elements.stampsButton = document.getElementById('stamps-button');
  PaintApp.elements.stampsButton.addEventListener("click", function() {
    paletteRemoveActiveClass();
    addActiveClassToElement(PaintApp.elements.stampsButton);
    PaintApp.switchMode("Stamp");
  });

  PaintApp.elements.penButton = document.getElementById('pen-button');
  PaintApp.elements.penButton.addEventListener("click", function() {
    paletteRemoveActiveClass();
    addActiveClassToElement(PaintApp.elements.penButton);
    PaintApp.switchMode("Pen");
  });
}
