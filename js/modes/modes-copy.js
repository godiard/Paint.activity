define([], function() {

  function initGui() {
    PaintApp.elements.copyButton = document.getElementById('copy-button');
    PaintApp.paletteModesButtons.push(PaintApp.elements.copyButton)
    PaintApp.elements.copyButton.addEventListener("click", function() {
      PaintApp.paletteRemoveActiveClass();
      PaintApp.addActiveClassToElement(PaintApp.elements.copyButton);
      PaintApp.switchMode("Copy");
    });
  }

  var Copy = {
    initGui: initGui,
    begin: undefined,
    end: undefined,

    onMouseDown: function(event) {
      begin = event.point;

      var element = document.createElement('div');
      element.style.position = "absolute"
      element.style.padding = "0px"
      element.style.width = "1px"
      element.style.height = "1px"
      element.style.opacity = "0.5"
      element.style.borderRadius = "0px"
      element.style.border = "5px dotted #500"

      var left = event.point.x + "px"
      var top = event.point.y + 55 + "px"
      element.style.left = left
      element.style.top = top
      element.style.verticalAlign = "bottom";

      document.body.appendChild(element);
      element.style.left = parseInt(left) - element.getBoundingClientRect().width / 2 + "px"
      element.style.top = parseInt(top) - element.getBoundingClientRect().height / 2 + "px"
      PaintApp.data.currentElement = {
        type: "text",
        element: element,
        startPoint: {
          x: parseInt(element.style.left) + element.getBoundingClientRect().width / 2,
          y: parseInt(element.style.top) + element.getBoundingClientRect().height / 2
        }
      };
    },

    onMouseDrag: function(event) {
      var end = event.point;

      if (begin.x <= end.x) {
        PaintApp.data.currentElement.element.style.width = end.x - begin.x + "px"
      } else {
        PaintApp.data.currentElement.element.style.width = 0 + "px"
      }

      if (begin.y <= end.y) {
        PaintApp.data.currentElement.element.style.height = Math.abs(begin.y - end.y) + "px"
      } else {
        PaintApp.data.currentElement.element.style.height = 0 + "px"
      }
    },

    onMouseUp: function(event) {
      var end = event.point;
      end.y = end.y + 55;

      var width = parseInt(PaintApp.data.currentElement.element.style.width);
      var height = parseInt(PaintApp.data.currentElement.element.style.height);

      var canvas = PaintApp.elements.canvas;
      var ctx = PaintApp.elements.canvas.getContext("2d");
      if (begin.x < end.x && begin.y < end.y) {
        PaintApp.modes.Paste.data = canvas.toDataURL();

        var imgData = ctx.getImageData(
          begin.x * window.devicePixelRatio,
          begin.y * window.devicePixelRatio,
          width * window.devicePixelRatio,
          height * window.devicePixelRatio);

        var canvas = document.createElement('canvas');
        canvas.width = width * window.devicePixelRatio
        canvas.height = height * window.devicePixelRatio
        canvas.getContext("2d").putImageData(imgData, 0, 0);
        imgData = canvas.toDataURL();
        console.log(imgData)
        PaintApp.modes.Paste.dataImage = {
          width: width / window.devicePixelRatio,
          height: height / window.devicePixelRatio,
          data: imgData
        };
      }
      PaintApp.data.currentElement.element.parentElement.removeChild(PaintApp.data.currentElement.element);
      PaintApp.data.currentElement = undefined;
    }

  };

  return Copy;
})
