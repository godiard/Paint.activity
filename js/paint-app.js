//Handle the coloring of a SVG (specific header required)
function changeColors(iconData, fillColor, strokeColor) {
  var fillColorRegex = /<!ENTITY fill_color "(.*?)">/g;
  var strokeColorRegex = /<!ENTITY stroke_color "(.*?)">/g;

  iconData = iconData.replace(fillColorRegex, "<!ENTITY fill_color \"" + fillColor + "\">");
  iconData = iconData.replace(strokeColorRegex, "<!ENTITY stroke_color \"" + strokeColor + "\">");

  return iconData;
}

/* Switch current drawing mode */
function switchMode(newMode) {
  saveCanvas();
  PaintApp.handleCurrentFloatingElement();
  PaintApp.data.tool.onMouseDown = PaintApp.modes[newMode].onMouseDown;
  PaintApp.data.tool.onMouseDrag = PaintApp.modes[newMode].onMouseDrag;
  PaintApp.data.tool.onMouseUp = PaintApp.modes[newMode].onMouseUp;
}

function undoCanvas() {
  if (PaintApp.data.history.undo.length < 2) {
    return;
  }

  PaintApp.modes.Pen.point = undefined;
  var canvas = PaintApp.elements.canvas;
  var ctx = canvas.getContext('2d');
  var img = new Image;
  var imgSrc = PaintApp.data.history.undo[PaintApp.data.history.undo.length - 2]
  var imgSrc2 = PaintApp.data.history.undo[PaintApp.data.history.undo.length - 1]
  img.onload = function() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    ctx.restore();

  };
  img.src = imgSrc;
  PaintApp.data.history.redo.push(imgSrc2);
  PaintApp.data.history.undo.pop()
}

function redoCanvas() {
  if (PaintApp.data.history.redo.length == 0) {
    return;
  }

  PaintApp.modes.Pen.point = undefined;
  var canvas = PaintApp.elements.canvas;
  var ctx = canvas.getContext('2d');
  var img = new Image;
  var imgSrc = PaintApp.data.history.redo[PaintApp.data.history.redo.length - 1]

  img.onload = function() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    ctx.restore();
  };
  img.src = imgSrc;
  PaintApp.data.history.undo.push(imgSrc);
  PaintApp.data.history.redo.pop()
}

function saveCanvas() {
  var canvas = PaintApp.elements.canvas;
  var image = canvas.toDataURL();

  if (PaintApp.data.history.undo.length > 0 && PaintApp.data.history.undo[PaintApp.data.history.undo.length - 1] !== image) {
    PaintApp.data.history.undo.push(image);
    PaintApp.data.history.redo = []
  } else if (PaintApp.data.history.undo.length == 0) {
    PaintApp.data.history.undo.push(image);
    PaintApp.data.history.redo = []
  }
}

function handleCurrentFloatingElement() {
  if (PaintApp.data.currentElement !== undefined) {
    switch (PaintApp.data.currentElement.type) {
      case "text":
        var ctx = PaintApp.elements.canvas.getContext("2d");
        ctx.font = PaintApp.data.currentElement.element.style.fontSize + " Arial";
        ctx.fillStyle = PaintApp.data.color.fill
        var txt = PaintApp.data.currentElement.element.value;
        var top = PaintApp.data.currentElement.element.getBoundingClientRect().top - 55 + PaintApp.data.currentElement.element.getBoundingClientRect().height

        ctx.fillText(
          txt,
          5 + PaintApp.data.currentElement.element.getBoundingClientRect().left,
          top
        );
        PaintApp.data.currentElement.element.parentElement.removeChild(PaintApp.data.currentElement.element);
        break;
      case "stamp":
        var ctx = PaintApp.elements.canvas.getContext("2d");
        ctx.drawImage(PaintApp.data.currentElement.element, PaintApp.data.currentElement.element.getBoundingClientRect().left, PaintApp.data.currentElement.element.getBoundingClientRect().top - 55);
        PaintApp.data.currentElement.element.parentElement.removeChild(PaintApp.data.currentElement.element);
        break;
    }
    PaintApp.data.currentElement = undefined;
    saveCanvas();
  }
}

/* PaintApp, contains the context of the application */
var PaintApp = {
  libs: {
    mustache: undefined
  },

  elements: {},

  data: {
    history: {
      undo: [],
      redo: []
    },
    size: 5,
    color: {
      stroke: "#1500A7",
      fill: "#ff0000"
    },
    tool: undefined,
    buddyColor: {
      stroke: "#1500A7",
      fill: "#ff0000"
    }
  },
  // element.addEventListener('click', function (e) {
  // ctx.drawImage(element, element.getBoundingClientRect().left, element.getBoundingClientRect().top - 55);
  // element.parentElement.removeChild(element);
  // });
  modes: {

    //The pen mode is a simple drawing mode
    Pen: {
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
        saveCanvas();
      }
    },

    Text: {
      onMouseDown: function(event) {
        PaintApp.handleCurrentFloatingElement();
        var element = document.createElement('input');
        element.type = "text"
        element.className = "draggable"
        element.style.position = "absolute"
        element.style.padding = "0px"
        element.size = 1;
        element.style.width = "auto"
        element.style.minWidth = "20px"
        element.style.fontSize = "42px"
        element.style.height = "42px"
        element.style.lineHeight = "42px"
        element.style.opacity = "0.5"
        element.style.border = "1px solid #500"
        element.style.color = PaintApp.data.color.fill;

        element.addEventListener('keyup', function(e) {
          e.target.size = e.target.value.length + 1;
          window.scrollTo(-1000, -1000)
        })

        var left = event.point.x + "px"
        var top = event.point.y + 55 + "px"
        element.style.left = left
        element.style.top = top

        document.body.appendChild(element);
        element.focus()
        window.scrollTo(-1000, -1000)

        PaintApp.data.currentElement = {
          type: "text",
          element: element
        };

      },
      onMouseDrag: function(event) {},
      onMouseUp: function(event) {
        saveCanvas();
      }
    },

    //The stamp mode allow to insert SVGs by a click/tap
    Stamp: {
      onMouseDown: function(event) {
        return function() {

          PaintApp.handleCurrentFloatingElement();
          var left = event.point.x - 25 + "px";
          var top = event.point.y + 25 + "px";
          var url = window.location.href.split('/');
          url.pop();
          url = url.join('/') + "/" + PaintApp.data.stamp; //'/activity/activity-icon.svg';

          var ctx = PaintApp.elements.canvas.getContext("2d");
          var p = event.point;

          var request = new XMLHttpRequest();
          request.open('GET', url, true);
          request.onload = function(e) {

            if (request.status === 200 || request.status === 0) {
              var imgSRC = request.responseText;
              imgSRC = changeColors(imgSRC, PaintApp.data.color.fill, PaintApp.data.color.stroke);

              var element = document.createElement('img');
              element.src = "data:image/svg+xml;base64," + btoa(imgSRC);
              element.className = "draggable"
              element.style.position = "absolute"
              element.style.left = left
              element.style.padding = "5px"
              element.style.border = "1px solid #500"
              element.style.resize = "both"
              element.style.top = top
              document.body.appendChild(element);
              PaintApp.data.currentElement = {
                type: "stamp",
                element: element
              };
            }
          };
          request.send(null);
        }();
      },
      onMouseDrag: function(event) {},
      onMouseUp: function(event) {
        saveCanvas();
      }
    }
  },
  switchMode: switchMode,
  handleCurrentFloatingElement: handleCurrentFloatingElement
};
