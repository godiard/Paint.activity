/* Color palette to choose the primary and secondary color */

define([
  'sugar-web/graphics/palette',
  'mustache'
], function (palette, mustache) {
  var colorpalette = {};

  function initGui() {
    /* Init of the two palettes for primary and secondary primary */
    function onColorChangeFill(event) {
      PaintApp.data.color.fill = event.detail.color;
      colorsButtonFill.style.backgroundColor = event.detail.color;
      colorInvokerFill.style.backgroundColor = event.detail.color;
    }

    function onColorChangeStroke(event) {
      PaintApp.data.color.stroke = event.detail.color;
      colorsButtonStroke.style.backgroundColor = event.detail.color;
      colorInvokerStroke.style.backgroundColor = event.detail.color;
    }

    var colorsButtonFill = document.getElementById('colors-button-fill');
    var colorPaletteFill = new PaintApp.palettes.colorPalette.ColorPalette(colorsButtonFill, undefined);
    colorPaletteFill.addEventListener('colorChange', onColorChangeFill);
    var colorInvokerFill = colorPaletteFill.getPalette().querySelector('.palette-invoker');
    colorPaletteFill.setColor(1);
    var colorsButtonStroke = document.getElementById('colors-button-stroke');
    var colorPaletteStroke = new PaintApp.palettes.colorPalette.ColorPalette(colorsButtonStroke, undefined);
    colorPaletteStroke.addEventListener('colorChange', onColorChangeStroke);
    var colorInvokerStroke = colorPaletteStroke.getPalette().querySelector('.palette-invoker');
    colorPaletteStroke.setColor(18);
  }

  colorpalette.initGui = initGui;

  /* We setup the palette with Sugar colors */
  colorpalette.ColorPalette = function (invoker, primaryText) {
    palette.Palette.call(this, invoker, primaryText);
    this.colorChangeEvent = document.createEvent('CustomEvent');
    this.colorChangeEvent.initCustomEvent('colorChange', true, true, { 'color': '#ed2529' });
    this.template = '<tbody>' + '{{#rows}}' + '<tr>' + '{{#.}}' + '<td>' + '<button style="background-color: {{ color }}"></button>' + '</td>' + '{{/.}}' + '</tr>' + '{{/rows}}' + '</tbody>';
    var colorsElem = document.createElement('table');
    colorsElem.className = 'colors';
    var colorsData = {
      rows: [
        [
          { color: '#FF2B34' },
          { color: '#E6000A' },
          { color: '#B20008' }
        ],
        [
          { color: '#9A5200' },
          { color: '#C97E00' },
          { color: '#FF8F00' }
        ],
        [
          { color: '#BE9E00' },
          { color: '#FFC169' },
          { color: '#F8E800' }
        ],
        [
          { color: '#FFFA00' },
          { color: '#8BFF7A' },
          { color: '#00EA11' }
        ],
        [
          { color: '#FFFA00' },
          { color: '#8BFF7A' },
          { color: '#00EA11' }
        ],
        [
          { color: '#008009' },
          { color: '#807500' },
          { color: '#00588C' }
        ],
        [
          { color: '#005FE4' },
          { color: '#00A0FF' },
          { color: '#BCCEFF' }
        ],
        [
          { color: '#BCCDFF' },
          { color: '#D1A3FF' },
          { color: '#AC32FF' }
        ],
        [
          { color: '#A700FF' },
          { color: '#9900E6' },
          { color: '#7F00BF' }
        ],
        [
          { color: '#5E008C' },
          { color: '#FFADCE' },
          { color: '#00B20D' }
        ],
        [
          { color: '#000000' },
          { color: '#919496' },
          { color: '#ffffff' }
        ]
      ]
    };
    colorsElem.innerHTML = mustache.render(this.template, colorsData);
    this.setContent([colorsElem]);
    colorsElem.parentNode.style.width = '180px';
    colorsElem.parentNode.style.height = '160px';
    colorsElem.parentNode.style.overflowY = 'auto';
    colorsElem.parentNode.style.overflowX = 'hidden';

    // Pop-down the palette when a item in the menu is clicked.
    this.buttons = colorsElem.querySelectorAll('button');
    var that = this;
    function popDownOnButtonClick(event) {
      that.colorChangeEvent.detail.color = event.target.style.backgroundColor;
      that.getPalette().dispatchEvent(that.colorChangeEvent);
      that.popDown();
    }
    for (var i = 0; i < this.buttons.length; i++) {
      this.buttons[i].addEventListener('click', popDownOnButtonClick);
    }
  };

  var setColor = function (index) {
    // Click the nth button
    var event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    this.buttons[index].dispatchEvent(event);
  };

  var addEventListener = function (type, listener, useCapture) {
    return this.getPalette().addEventListener(type, listener, useCapture);
  };
  
  colorpalette.ColorPalette.prototype = Object.create(palette.Palette.prototype, {
    setColor: {
      value: setColor,
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
  return colorpalette;
});
