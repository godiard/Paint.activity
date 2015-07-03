define([], function() {

  function initGui() {
    PaintApp.elements.penButton = document.getElementById('pen-button');
    PaintApp.paletteModesButtons.push(PaintApp.elements.penButton)
    PaintApp.elements.penButton.addEventListener("click", function() {
      PaintApp.paletteRemoveActiveClass();
      PaintApp.addActiveClassToElement(PaintApp.elements.penButton);
      PaintApp.switchMode("Pen");
    });
  }

  var Pen = {
    initGui: initGui,
    point: undefined,
    onMouseDown: function(event) {
      PaintApp.modes.Pen.point = event.point;
      var ctx = PaintApp.elements.canvas.getContext("2d");
      ctx.beginPath();
      ctx.strokeStyle = PaintApp.data.color.fill;
      ctx.lineCap = 'round';
      ctx.lineWidth = PaintApp.data.size;
      ctx.moveTo(event.point.x + 1, event.point.y + 1);
      ctx.lineTo(event.point.x, event.point.y);
      ctx.stroke();
    },
    onMouseDrag: function(event) {
      if (!PaintApp.modes.Pen.point) {
        return;
      }
      var ctx = PaintApp.elements.canvas.getContext("2d");
      ctx.beginPath();
      ctx.moveTo(PaintApp.modes.Pen.point.x, PaintApp.modes.Pen.point.y);
      ctx.lineTo(event.point.x, event.point.y);
      ctx.stroke();
      PaintApp.modes.Pen.point = event.point;
    },
    onMouseUp: function(event) {
      PaintApp.saveCanvas();
    }
  }

  return Pen;
})
