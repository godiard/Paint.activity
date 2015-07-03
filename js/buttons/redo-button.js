define([], function() {

  function initGui() {
    var redoButton = document.getElementById("redo-button");
    PaintApp.elements.redoButton = redoButton;
    redoButton.addEventListener('click', PaintApp.redoCanvas);
  }

  var redoButton = {
    initGui: initGui
  }

  return redoButton;

})
