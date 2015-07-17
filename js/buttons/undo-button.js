/* Undo button will undo the canvas using the history */
define([], function() {
  function undo() {
    var data = PaintApp.undoCanvas();

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
    var undoButton = document.getElementById('undo-button');
    PaintApp.elements.undoButton = undoButton;
    undoButton.addEventListener('click', undo);
  }

  function hideGui() {
    var undoButton = document.getElementById('undo-button');
    PaintApp.elements.undoButton = undoButton;
    PaintApp.elements.undoButton.disabled = true;
  }

  var undoButton = {
    initGui: initGui,
    hideGui: hideGui
  };

  return undoButton;
});
