define([], function() {

  function undo() {
    var data = PaintApp.undoCanvas()

    if (PaintApp.data.isShared && data) {
      PaintApp.data.presence.sendMessage(PaintApp.data.presence.getSharedInfo().id, {
        user: PaintApp.data.presence.getUserInfo(),
        content: {
          action: "toDataURL",
          data: data
        }
      })
    }
  }

  function initGui() {
    var undoButton = document.getElementById("undo-button");
    PaintApp.elements.undoButton = undoButton;
    undoButton.addEventListener('click', undo);
  }

  function hideGui() {
    var undoButton = document.getElementById("undo-button");
    PaintApp.elements.undoButton = undoButton;
    PaintApp.elements.undoButton.disabled = true
  }

  var undoButton = {
    initGui: initGui,
    hideGui: hideGui
  }

  return undoButton;

})
