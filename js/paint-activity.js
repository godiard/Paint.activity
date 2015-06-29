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
  PaintApp.elements.canvas = document.getElementById('paint-canvas');
  paper.setup(PaintApp.elements.canvas);

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

  function onColorChangeFill(event) {
    PaintApp.data.color.fill = event.detail.color;
    colorsButtonFill.style.backgroundColor = event.detail.color;
    colorInvokerFill.style.backgroundColor = event.detail.color;
  }

  function onColorChangeStroke(event) {
    PaintApp.data.color.stroke = event.detail.color;
    colorsButtonStroke.style.backgroundColor = event.detail.color;
    colorInvokerStroke.style.backgroundColor = event.detail.color;
  }

  function onStampChange(event) {
    console.log(event.detail.stamp)
    PaintApp.data.stamp = event.detail.stamp;
  }

  var stampButton = document.getElementById("stamps-button");
  var stampPalette = new PaintApp.libs.stamppalette.StampPalette(stampButton, undefined);
  stampPalette.addEventListener('stampChange', onStampChange);
  var stampInvoker = stampPalette.getPalette().querySelector('.palette-invoker');
  stampPalette.setStamp(0);

  var colorsButtonFill = document.getElementById("colors-button-fill");
  var colorPaletteFill = new PaintApp.libs.colorpalette.ColorPalette(colorsButtonFill, undefined);
  colorPaletteFill.addEventListener('colorChange', onColorChangeFill);
  var colorInvokerFill = colorPaletteFill.getPalette().querySelector('.palette-invoker');
  colorPaletteFill.setColor(0);

  var colorsButtonStroke = document.getElementById("colors-button-stroke");
  var colorPaletteStroke = new PaintApp.libs.colorpalette.ColorPalette(colorsButtonStroke, undefined);
  colorPaletteStroke.addEventListener('colorChange', onColorChangeStroke);
  var colorInvokerStroke = colorPaletteStroke.getPalette().querySelector('.palette-invoker');
  colorPaletteStroke.setColor(2);

  function onSizeClick() {
    var sizeSVG = "1";
    var size = PaintApp.data.size;

    switch (size) {
      case 5:
        size = 10;
        sizeSVG = "2";
        break;
      case 10:
        size = 15;
        sizeSVG = "3";
        break;
      case 15:
        size = 20;
        sizeSVG = "4";
        break;
      case 20:
        size = 5;
        sizeSVG = "1";
        break;
    }

    PaintApp.data.size = size;
    sizeButton.style.backgroundImage = "url(icons/size-" + sizeSVG + ".svg)";
  }

  var sizeButton = document.getElementById("size-button");
  sizeButton.addEventListener('click', onSizeClick);

  PaintApp.elements.penButton.click();
}
