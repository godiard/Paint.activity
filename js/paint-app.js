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
    tool: undefined,
    buddyColor: {
      stroke: "#1500A7",
      fill: "#ff0000"
    }
  },

  modes: {

    //The pen mode is a simple drawing mode
    Pen: {
      onMouseDown: function(event) {
        path = new paper.Path();
        path.strokeColor = 'red';
        path.add(event.point);
        p2 = new paper.Point();
        p2.x = event.point.x + 1;
        p2.y = event.point.y + 1;
        path.add(p2);
        paper.view.draw();
      },
      onMouseDrag: function(event) {
        path.add(event.point);
        paper.view.draw();
      },
      onMouseUp: function(event) {}
    },

    //The stamp mode allow to insert SVGs by a click/tap
    Stamp: {
      onMouseDown: function(event) {
        return function() {
          var p = event.point;
          var url = window.location.href.split('/');
          url.pop();
          url = url.join('/') + '/activity/activity-icon.svg';
          var request = new XMLHttpRequest();
          request.open('GET', url, true);
          request.onload = function(e) {
            if (request.status === 200 || request.status === 0) {
              imgSRC = request.responseText;
              imgSRC = changeColors(imgSRC, PaintApp.data.buddyColor.fill, PaintApp.data.buddyColor.stroke);
              var img = new Image();
              img.onload = function() {
                var raster = new paper.Raster(img);
                raster.bounds.width = 80;
                raster.bounds.height = 80;
                raster.position = p;
                paper.view.draw();
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
