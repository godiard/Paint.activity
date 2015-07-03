define([], function() {

  function initGui() {
    function onSizeClick() {
      var sizeSVG = "1";
      var size = PaintApp.data.size;

      switch (size) {
        case 5:
          size = 10;
          sizeSVG = "2";
          break;
        case 10:
          size = 15;
          sizeSVG = "3";
          break;
        case 15:
          size = 20;
          sizeSVG = "4";
          break;
        case 20:
          size = 5;
          sizeSVG = "1";
          break;
      }

      PaintApp.data.size = size;
      sizeButton.style.backgroundImage = "url(icons/size-" + sizeSVG + ".svg)";
    }

    var sizeButton = document.getElementById("size-button");
    sizeButton.addEventListener('click', onSizeClick);
  }

  var sizeButton = {
    initGui: initGui
  }

  return sizeButton;

})
