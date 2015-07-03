define([], function() {

  function initGui() {
    var clearButton = document.getElementById("clear-button");
    clearButton.addEventListener('click', PaintApp.clearCanvas)
  }

  var clearButton = {
    initGui: initGui
  }

  return clearButton;

})
