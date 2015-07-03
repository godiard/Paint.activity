define(["sugar-web/graphics/palette", "mustache"],
  function(palette, mustache) {

    var filterspalette = {};

    function canvasInvert(canvas) {
      var context = canvas.getContext("2d");
      var imgd = context.getImageData(0, 0, canvas.width, canvas.height);
      var pix = imgd.data;
      for (var i = 0, n = pix.length; i < n; i += 4) {
        pix[i] = 255 - pix[i]
        pix[i + 1] = 255 - pix[i + 1]
        pix[i + 2] = 255 - pix[i + 2]
      }
      context.putImageData(imgd, 0, 0);
    }

    function canvasToGrayscale(canvas) {
      var context = canvas.getContext("2d");
      var imgd = context.getImageData(0, 0, canvas.width, canvas.height);
      var pix = imgd.data;
      for (var i = 0, n = pix.length; i < n; i += 4) {
        var grayscale = pix[i] * .3 + pix[i + 1] * .59 + pix[i + 2] * .11;
        pix[i] = grayscale;
        pix[i + 1] = grayscale;
        pix[i + 2] = grayscale;
      }
      context.putImageData(imgd, 0, 0);
    }

    function onFilterSelect(event) {
      PaintApp.saveCanvas();
      switch (event.detail.filter) {
        case "invert":
          canvasInvert(PaintApp.elements.canvas);
          break;
        case "grayscale":
          canvasToGrayscale(PaintApp.elements.canvas);
          break;
      }
      PaintApp.saveCanvas();
    }

    function initGui() {
      var filtersButton = document.getElementById("filters-button");
      var filtersPalette = new PaintApp.palettes.filtersPalette.FiltersPalette(filtersButton, undefined);
      filtersPalette.addEventListener('filtersChange', onFilterSelect);
    }

    filterspalette.initGui = initGui;

    filterspalette.FiltersPalette = function(invoker, primaryText) {
      palette.Palette.call(this, invoker, primaryText);

      this.filtersChangeEvent = document.createEvent("CustomEvent");
      this.filtersChangeEvent.initCustomEvent('filtersChange', true, true, {
        'filters': "icons/size-1.svg"
      });

      this.template =
        '<tbody>' +
        '{{#rows}}' +
        '<tr>' +
        '{{#.}}' +
        '<td>' +
        '<button value="{{value}}" style="height:55px; width:55px; background-image: url({{ filters }}); background-repeat: no-repeat; background-position: center; "></button>' +
        '</td>' +
        '{{/.}}' +
        '</tr>' +
        '{{/rows}}' +
        '</tbody>';

      var filterssElem = document.createElement('table');
      filterssElem.className = "filterss";
      var filterssData = {
        rows: [
          [{
            filters: "icons/effect-grayscale.svg",
            value: "grayscale"
          }, {
            filters: "icons/invert-colors.svg",
            value: "invert"
          }, ]
        ]
      };

      filterssElem.innerHTML = mustache.render(this.template, filterssData);
      this.setContent([filterssElem]);

      // Pop-down the palette when a item in the menu is clicked.

      this.buttons = filterssElem.querySelectorAll('button');
      var that = this;

      function popDownOnButtonClick(event) {
        that.filtersChangeEvent.detail.filter = event.target.value;
        that.getPalette().dispatchEvent(that.filtersChangeEvent);
        that.popDown();
      }

      for (var i = 0; i < this.buttons.length; i++) {
        this.buttons[i].addEventListener('click', popDownOnButtonClick);
      }

    };

    var setfilters = function(index) {
      // Click the nth button
      var event = document.createEvent("MouseEvents");
      event.initEvent("click", true, true);
      this.buttons[index].dispatchEvent(event);
    }

    var addEventListener = function(type, listener, useCapture) {
      return this.getPalette().addEventListener(type, listener, useCapture);
    }

    filterspalette.FiltersPalette.prototype =
      Object.create(palette.Palette.prototype, {
        setfilters: {
          value: setfilters,
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

    return filterspalette;

  });
