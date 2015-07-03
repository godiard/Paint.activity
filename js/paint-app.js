define([], function() {

  /* Function to disable all active class inside the toolbar */
  function paletteRemoveActiveClass() {
    for (var i = 0; i < PaintApp.paletteModesButtons.length; i++) {
      PaintApp.paletteModesButtons[i].className = PaintApp.paletteModesButtons[i].className.replace(/(?:^|\s)active(?!\S)/g, '');
    }
  }

  /* Function to add active class to a specific element */
  function addActiveClassToElement(element) {
    element.className += " active";
  }

  /* Switch current drawing mode */
  function switchMode(newMode) {
    saveCanvas();
    PaintApp.handleCurrentFloatingElement();
    PaintApp.data.tool.onMouseDown = PaintApp.modes[newMode].onMouseDown;
    PaintApp.data.tool.onMouseDrag = PaintApp.modes[newMode].onMouseDrag;
    PaintApp.data.tool.onMouseUp = PaintApp.modes[newMode].onMouseUp;
  }

  function clearCanvas() {
    var ctx = PaintApp.elements.canvas.getContext("2d");
    ctx.clearRect(0, 0, PaintApp.elements.canvas.width, PaintApp.elements.canvas.height);
    PaintApp.saveCanvas();
  }

  function undoCanvas() {
    PaintApp.handleCurrentFloatingElement();
    if (PaintApp.data.history.undo.length < 2) {
      return;
    }

    PaintApp.modes.Pen.point = undefined;
    var canvas = PaintApp.elements.canvas;
    var ctx = canvas.getContext('2d');
    var img = new Image;
    var imgSrc = PaintApp.data.history.undo[PaintApp.data.history.undo.length - 2]
    var imgSrc2 = PaintApp.data.history.undo[PaintApp.data.history.undo.length - 1]

    img.onload = function() {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    };

    img.src = imgSrc;
    PaintApp.data.history.redo.push(imgSrc2);
    PaintApp.data.history.undo.pop()

    displayUndoRedoButtons();
  }

  function redoCanvas() {
    handleCurrentFloatingElement();

    if (PaintApp.data.history.redo.length == 0) {
      return;
    }

    PaintApp.modes.Pen.point = undefined;
    var canvas = PaintApp.elements.canvas;
    var ctx = canvas.getContext('2d');
    var img = new Image;
    var imgSrc = PaintApp.data.history.redo[PaintApp.data.history.redo.length - 1]

    img.onload = function() {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    };

    img.src = imgSrc;
    PaintApp.data.history.undo.push(imgSrc);
    PaintApp.data.history.redo.pop()
    displayUndoRedoButtons();
  }

  function displayUndoRedoButtons() {
    if (PaintApp.data.history.redo.length == 0) {
      PaintApp.elements.redoButton.style.opacity = "0.4"
    } else {
      PaintApp.elements.redoButton.style.opacity = "1"
    }

    if (PaintApp.data.history.undo.length <= 1) {
      PaintApp.elements.undoButton.style.opacity = "0.4"
    } else {
      PaintApp.elements.undoButton.style.opacity = "1"
    }
  }

  function saveCanvas() {
    var canvas = PaintApp.elements.canvas;
    var image = canvas.toDataURL();

    if (PaintApp.data.history.undo.length > 0 && PaintApp.data.history.undo[PaintApp.data.history.undo.length - 1] !== image) {
      PaintApp.data.history.undo.push(image);
      PaintApp.data.history.redo = []
    } else if (PaintApp.data.history.undo.length == 0) {
      PaintApp.data.history.undo.push(image);
      PaintApp.data.history.redo = []
    }

    if (PaintApp.data.history.redo.length > PaintApp.data.history.limit) {
      PaintApp.data.history.redo = PaintApp.data.history.redo.slice(1)
    }

    if (PaintApp.data.history.undo.length > PaintApp.data.history.limit) {
      PaintApp.data.history.undo = PaintApp.data.history.undo.slice(1)
    }
    displayUndoRedoButtons()
  }

  function handleCurrentFloatingElement() {
    if (PaintApp.data.currentElement !== undefined) {
      PaintApp.data.currentElement.element.parentElement.removeChild(PaintApp.data.currentElement.element);
      PaintApp.data.currentElement = undefined;
    }
  }

  /* PaintApp, contains the context of the application */
  var PaintApp = {
    libs: {},
    palettes: {},
    elements: {},
    buttons: {},
    paletteModesButtons: [],

    data: {
      history: {
        limit: 15,
        undo: [],
        redo: []
      },
      size: 5,
      color: {
        stroke: "#1500A7",
        fill: "#ff0000"
      },
      tool: undefined
    },
    modes: {},
    switchMode: switchMode,
    undoCanvas: undoCanvas,
    redoCanvas: redoCanvas,
    displayUndoRedoButtons: displayUndoRedoButtons,
    saveCanvas: saveCanvas,
    clearCanvas: clearCanvas,
    paletteRemoveActiveClass: paletteRemoveActiveClass,
    addActiveClassToElement: addActiveClassToElement,
    handleCurrentFloatingElement: handleCurrentFloatingElement
  };

  return PaintApp;
});
