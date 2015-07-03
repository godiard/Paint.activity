define([], function() {

  function initGui() {
    PaintApp.elements.eraserButton = document.getElementById('eraser-button');
    PaintApp.paletteModesButtons.push(PaintApp.elements.eraserButton)
    PaintApp.elements.eraserButton.addEventListener("click", function() {
      PaintApp.paletteRemoveActiveClass();
      PaintApp.addActiveClassToElement(PaintApp.elements.eraserButton);
      PaintApp.switchMode("Eraser");
    });
  }

  var Eraser = {
    initGui: initGui,
    onMouseDown: function(event) {
      PaintApp.modes.Eraser.point = event.point;
      var ctx = PaintApp.elements.canvas.getContext("2d");
      ctx.beginPath();
      ctx.strokeStyle = "#fff";
      ctx.lineCap = 'round';
      ctx.lineWidth = PaintApp.data.size;
      ctx.moveTo(event.point.x + 1, event.point.y + 1);
      ctx.lineTo(event.point.x, event.point.y);
      ctx.stroke();
    },

    onMouseDrag: function(event) {
      if (!PaintApp.modes.Eraser.point) {
        return;
      }
      var ctx = PaintApp.elements.canvas.getContext("2d");
      ctx.beginPath();
      ctx.moveTo(PaintApp.modes.Eraser.point.x, PaintApp.modes.Eraser.point.y);
      ctx.lineTo(event.point.x, event.point.y);
      ctx.stroke();
      PaintApp.modes.Eraser.point = event.point;
    },

    onMouseUp: function(event) {
      PaintApp.saveCanvas();
    }
  };

  return Eraser;
})
