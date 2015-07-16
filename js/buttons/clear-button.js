define([], function() {

  function onClearClick() {
    PaintApp.clearCanvas();
    if (PaintApp.data.isShared) {
      PaintApp.data.presence.sendMessage(PaintApp.data.presence.getSharedInfo().id, {
        user: PaintApp.data.presence.getUserInfo(),
        content: {
          action: "clearCanvas"
        }
      })
    }
  }

  function initGui() {
    var clearButton = document.getElementById("clear-button");
    clearButton.addEventListener('click', onClearClick)
  }

  var clearButton = {
    initGui: initGui
  }

  return clearButton;

})
