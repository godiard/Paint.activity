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
  PaintApp.data.tool.onMouseDown = PaintApp.modes[newMode].onMouseDown;
  PaintApp.data.tool.onMouseDrag = PaintApp.modes[newMode].onMouseDrag;
  PaintApp.data.tool.onMouseUp = PaintApp.modes[newMode].onMouseUp;
}

/* PaintApp, contains the context of the application */
var PaintApp = {
  libs: {},

  elements: {},

  data: {
    size: 5,
    color: {
      stroke: "#1500A7",
      fill: "#ff0000"
    },
    items: [],
    tool: undefined,
    buddyColor: {
      stroke: "#1500A7",
      fill: "#ff0000"
    }
  },

  modes: {

    //The pen mode is a simple drawing mode
    Pen: {
      point: undefined,
      onMouseDown: function(event) {
        PaintApp.modes.Pen.point = event.point;
        var ctx = PaintApp.elements.canvas.getContext("2d");
        ctx.strokeStyle = PaintApp.data.color.fill;
        ctx.lineCap = 'round';
        ctx.lineWidth = PaintApp.data.size;
        ctx.moveTo(event.point.x + 1, event.point.y + 1);
        ctx.lineTo(event.point.x, event.point.y);
        ctx.stroke();
      },
      onMouseDrag: function(event) {
        var ctx = PaintApp.elements.canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(PaintApp.modes.Pen.point.x, PaintApp.modes.Pen.point.y);
        ctx.lineTo(event.point.x, event.point.y);
        ctx.stroke();
        PaintApp.modes.Pen.point = event.point;
      },
      onMouseUp: function(event) {}
    },

    //The stamp mode allow to insert SVGs by a click/tap
    Stamp: {
      onMouseDown: function(event) {
        return function() {
          var ctx = PaintApp.elements.canvas.getContext("2d");
          var p = event.point;
          var url = window.location.href.split('/');
          url.pop();
          url = url.join('/') + "/" + PaintApp.data.stamp;//'/activity/activity-icon.svg';
          var request = new XMLHttpRequest();
          request.open('GET', url, true);
          request.onload = function(e) {

            if (request.status === 200 || request.status === 0) {
              imgSRC = request.responseText;
              imgSRC = changeColors(imgSRC, PaintApp.data.color.fill, PaintApp.data.color.stroke);
              var img = new Image();
              img.onload = function() {
                var size = PaintApp.data.size * 10;
                ctx.drawImage(img, event.point.x - size / 2, event.point.y - size / 2, size, size);
              };
              img.src = "data:image/svg+xml;base64," + btoa(imgSRC);
            }
          };
          request.send(null);
        }();
      },
      onMouseDrag: function(event) {},
      onMouseUp: function(event) {}
    }
  },
  switchMode: switchMode
};
