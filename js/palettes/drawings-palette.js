define(["sugar-web/graphics/palette", "mustache"],
  function(palette, mustache) {

    var drawingspalette = {};

    function onDrawingSelect(event) {
      var url = window.location.href.split('/');
      url.pop();
      url = url.join('/') + "/" + event.detail.drawings; //'/activity/activity-icon.svg';

      var ctx = PaintApp.elements.canvas.getContext("2d");

      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.onload = function(e) {

        if (request.status === 200 || request.status === 0) {
          var imgSRC = request.responseText;

          var element = document.createElement('img');
          element.src = "data:image/svg+xml;base64," + btoa(imgSRC);
          element.onload = function() {
            var ctx = PaintApp.elements.canvas.getContext("2d");

            var imgWidth = element.width;
            var imgHeight = element.height;
            var maxWidth = PaintApp.elements.canvas.getBoundingClientRect().width;
            var maxHeight = PaintApp.elements.canvas.getBoundingClientRect().height;
            var ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
            var newWidth = ratio * imgWidth;
            var newHeight = ratio * imgHeight;

            ctx.clearRect(0, 0, PaintApp.elements.canvas.width, PaintApp.elements.canvas.height);

            ctx.drawImage(element,
              0,
              0,
              newWidth,
              newHeight)
            PaintApp.saveCanvas();
          }
        }
      };
      request.send(null);
    }

    function initGui() {
      var drawingsButton = document.getElementById("drawings-button");
      var drawingsPalette = new PaintApp.palettes.drawingsPalette.DrawingsPalette(drawingsButton, undefined);
      drawingsPalette.addEventListener('drawingsChange', onDrawingSelect);
    }

    drawingspalette.initGui = initGui;

    drawingspalette.DrawingsPalette = function(invoker, primaryText) {
      palette.Palette.call(this, invoker, primaryText);

      this.drawingsChangeEvent = document.createEvent("CustomEvent");
      this.drawingsChangeEvent.initCustomEvent('drawingsChange', true, true, {
        'drawings': "icons/size-1.svg"
      });

      this.template =
        '<tbody>' +
        '{{#rows}}' +
        '<tr>' +
        '{{#.}}' +
        '<td>' +
        '<button value="{{drawings}}" style="height:55px; width:55px; background-image: url({{ drawings }}); background-repeat: no-repeat; background-position: center; "></button>' +
        '</td>' +
        '{{/.}}' +
        '</tr>' +
        '{{/rows}}' +
        '</tbody>';

      var drawingssElem = document.createElement('table');
      drawingssElem.className = "drawingss";
      var drawingssData = {
        rows: [
          [{
            drawings: "drawings/woodpecker.svg"
          }, {
            drawings: "drawings/tortoise.svg"
          }, {
            drawings: "drawings/manatee.svg"
          }],
          [{
            drawings: "drawings/dog.svg"
          }, {
            drawings: "drawings/goldfinch.svg"
          }, {
            drawings: "drawings/mammoth.svg"
          }]
        ]
      };

      drawingssElem.innerHTML = mustache.render(this.template, drawingssData);
      this.setContent([drawingssElem]);

      // Pop-down the palette when a item in the menu is clicked.

      this.buttons = drawingssElem.querySelectorAll('button');
      var that = this;

      function popDownOnButtonClick(event) {
        that.drawingsChangeEvent.detail.drawings = event.target.value;
        that.getPalette().dispatchEvent(that.drawingsChangeEvent);
        that.popDown();
      }

      for (var i = 0; i < this.buttons.length; i++) {
        this.buttons[i].addEventListener('click', popDownOnButtonClick);
      }

    };

    var setdrawings = function(index) {
      // Click the nth button
      var event = document.createEvent("MouseEvents");
      event.initEvent("click", true, true);
      this.buttons[index].dispatchEvent(event);
    }

    var addEventListener = function(type, listener, useCapture) {
      return this.getPalette().addEventListener(type, listener, useCapture);
    }

    drawingspalette.DrawingsPalette.prototype =
      Object.create(palette.Palette.prototype, {
        setdrawings: {
          value: setdrawings,
          enumerable: true,
          configurable: true,
          writable: true
        },
        addEventListener: {
          value: addEventListener,
          enumerable: true,
          configurable: true,
          writable: true
        }
      });

    return drawingspalette;

  });
