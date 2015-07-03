define([], function() {

  function initGui() {
    var undoButton = document.getElementById("undo-button");
    PaintApp.elements.undoButton = undoButton;
    undoButton.addEventListener('click', PaintApp.undoCanvas);
  }

  var undoButton = {
    initGui: initGui
  }

  return undoButton;

})
