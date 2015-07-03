define(["sugar-web/graphics/palette", "mustache"],
  function(palette, mustache) {

    var stamppalette = {};

    stamppalette.StampPalette = function(invoker, primaryText) {
      palette.Palette.call(this, invoker, primaryText);

      this.stampChangeEvent = document.createEvent("CustomEvent");
      this.stampChangeEvent.initCustomEvent('stampChange', true, true, {
        'stamp': "icons/size-1.svg"
      });

      this.template =
        '<tbody>' +
        '{{#rows}}' +
        '<tr>' +
        '{{#.}}' +
        '<td>' +
        '<button value="{{stamp}}" style="height:55px; width:55px; background-image: url({{ stamp }}); background-repeat: no-repeat; background-position: center; "></button>' +
        '</td>' +
        '{{/.}}' +
        '</tr>' +
        '{{/rows}}' +
        '</tbody>';

      var stampsElem = document.createElement('table');
      stampsElem.className = "stamps";
      var stampsData = {
        rows: [
          [
            {stamp: "icons/female-0.svg"},
            {stamp: "icons/female-1.svg"},
            {stamp: "icons/female-2.svg"}
          ],
          [
            {stamp: "icons/female-3.svg"},
            {stamp: "icons/female-4.svg"},
            {stamp: "icons/female-5.svg"}
          ],
          [
            {stamp: "icons/female-6.svg"},
            {stamp: "icons/female-7.svg"},
            {stamp: "icons/male-0.svg"}
          ],
          [
            {stamp: "icons/male-0.svg"},
            {stamp: "icons/male-1.svg"},
            {stamp: "icons/male-2.svg"}
          ],
          [
            {stamp: "icons/male-3.svg"},
            {stamp: "icons/male-4.svg"},
            {stamp: "icons/male-5.svg"}
          ],
          [
            {stamp: "icons/male-6.svg"},
            {stamp: "icons/male-7.svg"},
            {stamp: "icons/school-server.svg"}
          ]
        ]
      };

      stampsElem.innerHTML = mustache.render(this.template, stampsData);
      this.setContent([stampsElem]);

      // Pop-down the palette when a item in the menu is clicked.

      this.buttons = stampsElem.querySelectorAll('button');
      var that = this;

      function popDownOnButtonClick(event) {
        that.stampChangeEvent.detail.stamp = event.target.value;
        that.getPalette().dispatchEvent(that.stampChangeEvent);
        that.popDown();
      }

      for (var i = 0; i < this.buttons.length; i++) {
        this.buttons[i].addEventListener('click', popDownOnButtonClick);
      }

    };

    var setStamp = function(index) {
      // Click the nth button
      var event = document.createEvent("MouseEvents");
      event.initEvent("click", true, true);
      this.buttons[index].dispatchEvent(event);
    }

    var addEventListener = function(type, listener, useCapture) {
      return this.getPalette().addEventListener(type, listener, useCapture);
    }

    stamppalette.StampPalette.prototype =
      Object.create(palette.Palette.prototype, {
        setStamp: {
          value: setStamp,
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

    return stamppalette;

  });