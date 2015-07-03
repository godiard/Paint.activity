define([], function() {

  function initGui() {
    PaintApp.elements.bucketButton = document.getElementById('bucket-button');
    PaintApp.paletteModesButtons.push(PaintApp.elements.bucketButton)
    PaintApp.elements.bucketButton.addEventListener("click", function() {
      PaintApp.paletteRemoveActiveClass();
      PaintApp.addActiveClassToElement(PaintApp.elements.bucketButton);
      PaintApp.switchMode("Bucket");
    });
  }

  //Floodfill functions
  function floodfill(x, y, fillcolor, ctx, width, height, tolerance) {
    var img = ctx.getImageData(0, 0, width, height);
    var data = img.data;
    var length = data.length;
    var Q = [];
    var i = (x + y * width) * 4;
    var e = i,
      w = i,
      me, mw, w2 = width * 4;
    var targetcolor = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    var targettotal = data[i] + data[i + 1] + data[i + 2] + data[i + 3];

    if (!pixelCompare(i, targetcolor, targettotal, fillcolor, data, length, tolerance)) {
      return false;
    }
    Q.push(i);
    while (Q.length) {
      i = Q.pop();
      if (pixelCompareAndSet(i, targetcolor, targettotal, fillcolor, data, length, tolerance)) {
        e = i;
        w = i;
        mw = parseInt(i / w2) * w2;
        me = mw + w2;
        while (mw < (w -= 4) && pixelCompareAndSet(w, targetcolor, targettotal, fillcolor, data, length, tolerance));
        while (me > (e += 4) && pixelCompareAndSet(e, targetcolor, targettotal, fillcolor, data, length, tolerance));
        for (var j = w; j < e; j += 4) {
          if (j - w2 >= 0 && pixelCompare(j - w2, targetcolor, targettotal, fillcolor, data, length, tolerance)) Q.push(j - w2);
          if (j + w2 < length && pixelCompare(j + w2, targetcolor, targettotal, fillcolor, data, length, tolerance)) Q.push(j + w2);
        }
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  function pixelCompare(i, targetcolor, targettotal, fillcolor, data, length, tolerance) {

    if (i < 0 || i >= length) return false;
    if (data[i + 3] === 0) return true;

    if (
      (targetcolor[3] === fillcolor.a) &&
      (targetcolor[0] === fillcolor.r) &&
      (targetcolor[1] === fillcolor.g) &&
      (targetcolor[2] === fillcolor.b)
    ) return false;

    if (
      (targetcolor[3] === data[i + 3]) &&
      (targetcolor[0] === data[i]) &&
      (targetcolor[1] === data[i + 1]) &&
      (targetcolor[2] === data[i + 2])
    ) return true;

    if (
      Math.abs(targetcolor[3] - data[i + 3]) <= (255 - tolerance) &&
      Math.abs(targetcolor[0] - data[i]) <= tolerance &&
      Math.abs(targetcolor[1] - data[i + 1]) <= tolerance &&
      Math.abs(targetcolor[2] - data[i + 2]) <= tolerance
    ) return true;

    return false;
  }

  function pixelCompareAndSet(i, targetcolor, targettotal, fillcolor, data, length, tolerance) {
    if (pixelCompare(i, targetcolor, targettotal, fillcolor, data, length, tolerance)) {
      data[i] = fillcolor.r;
      data[i + 1] = fillcolor.g;
      data[i + 2] = fillcolor.b;
      data[i + 3] = 255;
      return true;
    }
    return false;
  }


  var Bucket = {
    initGui: initGui,
    lock: false,
    onMouseDown: function(event) {
      if (PaintApp.modes.Bucket.lock) {
        return;
      }
      var ctx = PaintApp.elements.canvas.getContext("2d");
      var colorFillStrings = PaintApp.data.color.fill.slice(4, -1).split(',')
      var colorFill = [parseInt(colorFillStrings[0]), parseInt(colorFillStrings[1]), parseInt(colorFillStrings[2]), 0]

      var colorHex = colorFill.map(function(x) {
        x = parseInt(x).toString(16);
        return (x.length == 1) ? "0" + x : x;
      })

      var fillColor = {
        a: 1,
        r: parseInt(colorFill[0]),
        g: parseInt(colorFill[1]),
        b: parseInt(colorFill[2])
      }

      var p = ctx.getImageData(event.point.x * window.devicePixelRatio, event.point.y * window.devicePixelRatio, 1, 1).data;
      if (Math.abs(p[0] - fillColor.r) <= 10 && Math.abs(p[1] - fillColor.g) <= 10 && Math.abs(p[2] - fillColor.b) <= 10) {
        PaintApp.modes.Bucket.lock = false
        return;
      }
      floodfill(parseInt(event.point.x * window.devicePixelRatio), parseInt(event.point.y * window.devicePixelRatio), fillColor, ctx, ctx.canvas.width, ctx.canvas.height, 20);
      PaintApp.saveCanvas();
      PaintApp.modes.Bucket.lock = false
    },

    onMouseDrag: function(event) {},

    onMouseUp: function(event) {}
  };

  return Bucket;

})
