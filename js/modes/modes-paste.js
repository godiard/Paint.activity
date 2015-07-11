define([], function() {

  function initGui() {
    PaintApp.elements.pasteButton = document.getElementById('paste-button');
    PaintApp.paletteModesButtons.push(PaintApp.elements.pasteButton)
    PaintApp.elements.pasteButton.addEventListener("click", function() {
      PaintApp.paletteRemoveActiveClass();
      PaintApp.addActiveClassToElement(PaintApp.elements.pasteButton);
      PaintApp.switchMode("Paste");
    });
  }

  var Copy = {
    dataImage: undefined,
    initGui: initGui,
    onMouseDown: function(event) {
      return function() {
        PaintApp.modes.Paste.releasedFinger = false;
        PaintApp.handleCurrentFloatingElement();

        var left = event.point.x - PaintApp.modes.Paste.dataImage.width / 2 + "px";
        var top = event.point.y + 55 - PaintApp.modes.Paste.dataImage.height / 2 + "px";

        var ctx = PaintApp.elements.canvas.getContext("2d");
        var p = event.point;

        var element = document.createElement('img');
        element.src = PaintApp.modes.Paste.dataImage.data;
        element.style.width = PaintApp.modes.Paste.dataImage.width + "px"
        element.style.height = PaintApp.modes.Paste.dataImage.height + "px"
        element.style.position = "absolute"
        element.style.left = left
        element.style.padding = "0px"
        element.style.border = "5px dotted #500"
        element.style.top = top
        document.body.appendChild(element);
        PaintApp.data.currentElement = {
          type: "paste",
          element: element,
          startPoint: {
            x: parseInt(element.style.left) + element.getBoundingClientRect().width / 2,
            y: parseInt(element.style.top) + element.getBoundingClientRect().height / 2
          }
        };

        if (PaintApp.modes.Paste.releasedFinger) {
          var ctx = PaintApp.elements.canvas.getContext("2d");
          ctx.drawImage(PaintApp.data.currentElement.element,
            5 + PaintApp.data.currentElement.element.getBoundingClientRect().left,
            PaintApp.data.currentElement.element.getBoundingClientRect().top - 55 + 5);
          PaintApp.data.currentElement.element.parentElement.removeChild(PaintApp.data.currentElement.element);
          PaintApp.data.currentElement = undefined;
          PaintApp.saveCanvas();
        }
      }();
    },
    onMouseDrag: function(event) {
      if (!PaintApp.data.currentElement) {
        return;
      }
      var distanceX = Math.abs(event.point.x - PaintApp.data.currentElement.startPoint.x)
      var distanceY = Math.abs(event.point.y - PaintApp.data.currentElement.startPoint.y + 55)
      if (distanceX > distanceY) {
        distance = distanceX;
      } else {
        distance = distanceY;
      }
      PaintApp.data.currentElement.element.style.width = PaintApp.modes.Paste.dataImage.width + PaintApp.modes.Paste.dataImage.width * distance / 30 + "px";
      PaintApp.data.currentElement.element.style.height = PaintApp.modes.Paste.dataImage.height + PaintApp.modes.Paste.dataImage.height * distance / 30 + "px";

      PaintApp.data.currentElement.element.style.left = PaintApp.data.currentElement.startPoint.x - PaintApp.data.currentElement.element.getBoundingClientRect().width / 2 + "px"
      PaintApp.data.currentElement.element.style.top = PaintApp.data.currentElement.startPoint.y - PaintApp.data.currentElement.element.getBoundingClientRect().height / 2 + "px"
    },
    onMouseUp: function(event) {
      PaintApp.modes.Paste.releasedFinger = true;
      if (!PaintApp.data.currentElement) {
        return;
      }

      var ctx = PaintApp.elements.canvas.getContext("2d");
      ctx.drawImage(PaintApp.data.currentElement.element,
        PaintApp.data.currentElement.element.getBoundingClientRect().left,
        PaintApp.data.currentElement.element.getBoundingClientRect().top - 55,
        PaintApp.data.currentElement.element.getBoundingClientRect().width,
        PaintApp.data.currentElement.element.getBoundingClientRect().height);
      PaintApp.data.currentElement.element.parentElement.removeChild(PaintApp.data.currentElement.element);
      PaintApp.data.currentElement = undefined;
      PaintApp.saveCanvas();
    }
  };

  return Copy;
})
