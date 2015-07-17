/* Redo button will redo the canvas using the history */
define([], function () {
  function redo() {
    var data = PaintApp.redoCanvas();

    /* If the activity is shared, will send the instruction to everyone */
    if (PaintApp.data.isShared && data) {
      PaintApp.data.presence.sendMessage(PaintApp.data.presence.getSharedInfo().id, {
        user: PaintApp.data.presence.getUserInfo(),
        content: {
          action: 'toDataURL',
          data: {
            width: PaintApp.elements.canvas.width,
            height: PaintApp.elements.canvas.height,
            src: PaintApp.elements.canvas.toDataURL()
          }
        }
      });
    }
  }
  function initGui() {
    var redoButton = document.getElementById('redo-button');
    PaintApp.elements.redoButton = redoButton;
    redoButton.addEventListener('click', redo);
  }
  function hideGui() {
    var redoButton = document.getElementById('redo-button');
    PaintApp.elements.redoButton = redoButton;
    PaintApp.elements.redoButton.disabled = 'none';
  }
  var redoButton = {
    initGui: initGui,
    hideGui: hideGui
  };
  return redoButton;
});
