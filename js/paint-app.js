define([], function() {

  /* Function to disable all active class inside the toolbar */
  function paletteRemoveActiveClass() {
    for (var i = 0; i < PaintApp.paletteModesButtons.length; i++) {
      PaintApp.paletteModesButtons[i].className = PaintApp.paletteModesButtons[i].className.replace(/(?:^|\s)active(?!\S)/g, '');
    }
  }

  /* Function to add active class to a specific element */
  function addActiveClassToElement(element) {
    element.className += " active";
  }

  /* Switch current drawing mode */
  function switchMode(newMode) {
    saveCanvas();
    PaintApp.data.mode = newMode
    PaintApp.handleCurrentFloatingElement();
    PaintApp.data.tool.onMouseDown = PaintApp.modes[newMode].onMouseDown;
    PaintApp.data.tool.onMouseDrag = PaintApp.modes[newMode].onMouseDrag;
    PaintApp.data.tool.onMouseUp = PaintApp.modes[newMode].onMouseUp;
  }

  function clearCanvas() {
    var ctx = PaintApp.elements.canvas.getContext("2d");
    ctx.clearRect(0, 0, PaintApp.elements.canvas.width, PaintApp.elements.canvas.height);
    PaintApp.saveCanvas();
  }

  function undoCanvas() {
    PaintApp.handleCurrentFloatingElement();
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

    displayUndoRedoButtons();
    return imgSrc
  }

  function redoCanvas() {
    handleCurrentFloatingElement();

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
    displayUndoRedoButtons();
    return imgSrc;
  }

  function displayUndoRedoButtons() {
    if (PaintApp.data.isShared && !PaintApp.data.isHost) {
      PaintApp.elements.redoButton.style.opacity = "0.4"
      PaintApp.elements.undoButton.style.opacity = "0.4"

      return;
    }

    if (PaintApp.data.history.redo.length == 0) {
      PaintApp.elements.redoButton.style.opacity = "0.4"
    } else {
      PaintApp.elements.redoButton.style.opacity = "1"
    }

    if (PaintApp.data.history.undo.length <= 1) {
      PaintApp.elements.undoButton.style.opacity = "0.4"
    } else {
      PaintApp.elements.undoButton.style.opacity = "1"
    }
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

    if (PaintApp.data.history.redo.length > PaintApp.data.history.limit) {
      PaintApp.data.history.redo = PaintApp.data.history.redo.slice(1)
    }

    if (PaintApp.data.history.undo.length > PaintApp.data.history.limit) {
      PaintApp.data.history.undo = PaintApp.data.history.undo.slice(1)
    }
    displayUndoRedoButtons()

    if (PaintApp.data.isShared && !PaintApp.data.isHost) {
      PaintApp.data.presence.sendMessage(PaintApp.data.presence.getSharedInfo().id, {
        user: PaintApp.data.presence.getUserInfo(),
        content: {
          action: "saveCanvas"
        }
      })
    }
  }

  function handleCurrentFloatingElement() {

    if (PaintApp.data.currentElement !== undefined) {

      if (PaintApp.data.currentElement.type != "copy/paste") {
        PaintApp.data.currentElement.element.parentElement.removeChild(PaintApp.data.currentElement.element);
        PaintApp.data.currentElement = undefined;
      } else {
        if (PaintApp.data.mode != "Copy" && PaintApp.data.mode != "Paste") {
          PaintApp.data.currentElement.element.parentElement.removeChild(PaintApp.data.currentElement.element);
          PaintApp.data.currentElement = undefined;
        }
      }
    }
  }

  function onDataReceived(msg) {
    if (PaintApp.data.presence.getUserInfo().networkId === msg.user.networkId) {
      return;
    }
    var userName = msg.user.name.replace('<', '&lt;').replace('>', '&gt;');
    switch (msg.content.action) {
      case "path":
        var ctx = PaintApp.elements.canvas.getContext("2d");
        ctx.beginPath();
        ctx.strokeStyle = msg.content.data.strokeStyle;
        ctx.lineCap = msg.content.data.lineCap;
        ctx.lineWidth = msg.content.data.lineWidth;
        ctx.moveTo(msg.content.data.from.x, msg.content.data.from.y);
        ctx.lineTo(msg.content.data.to.x, msg.content.data.to.y);
        ctx.stroke();
        break;
      case "text":
        var ctx = PaintApp.elements.canvas.getContext("2d");

        ctx.font = msg.content.data.font;
        ctx.fillStyle = msg.content.data.fillStyle
        ctx.textAlign = msg.content.data.textAlign
        ctx.fillText(
          msg.content.data.text,
          msg.content.data.left,
          msg.content.data.top
        );
        break;
      case "drawImage":

        var ctx = PaintApp.elements.canvas.getContext("2d");

        var img = new Image()

        img.onload = function() {
          console.log("DRAW")
          ctx.drawImage(img,
            msg.content.data.left,
            msg.content.data.top,
            msg.content.data.width,
            msg.content.data.height)
        }
        img.src = msg.content.data.src
        break;
      case "drawStamp":
        var platform = "webkit";
        var isFirefox = typeof InstallTrigger !== 'undefined'
        if (isFirefox) {
          platform = "gecko"
        }
        var ctx = PaintApp.elements.canvas.getContext("2d");
        var stampURL = msg.content.data.stampBase.replace("{platform}", platform)

        var url = window.location.href.split('/');
        url.pop();
        url = url.join('/') + "/" + stampURL;

        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onload = function(e) {
          if (request.status === 200 || request.status === 0) {
            var stamp = PaintApp.modes.Stamp.changeColors(request.responseText, msg.content.data.color.fill, msg.content.data.color.stroke)
            var img = new Image()

            img.onload = function() {
              console.log("DRAW")
              ctx.drawImage(img,
                msg.content.data.left,
                msg.content.data.top,
                msg.content.data.width,
                msg.content.data.height)
            }
            img.src = "data:image/svg+xml;base64," + btoa(stamp)
          }
        }
        request.send(null);

        break;
      case "entranceToDataURL":
        if (PaintApp.data.isHost || PaintApp.data.entranceToDataURL) {
          return;
        }
        PaintApp.data.entranceToDataURL = true
        PaintApp.clearCanvas()
        var img = new Image()
        img.onload = function() {
          PaintApp.elements.canvas.getContext("2d").drawImage(img, 0, 0, PaintApp.data.width, PaintApp.data.height);
        }
        img.src = msg.content.data.src
        break;
      case "toDataURL":
        PaintApp.clearCanvas()
        var img = new Image()
        img.onload = function() {
          PaintApp.elements.canvas.getContext("2d").drawImage(img, 0, 0, PaintApp.data.width, PaintApp.data.height);
        }
        img.src = msg.content.data.src
        break;
      case "clearCanvas":
        PaintApp.clearCanvas()
        break;
      case "saveCanvas":
        if (PaintApp.data.isHost) {
          saveCanvas()
        }
        break;
    }
  }

  function onSharedActivityUserChanged(msg) {
    var userName = msg.user.name.replace('<', '&lt;').replace('>', '&gt;');
    if (PaintApp.data.presence.getUserInfo().networkId === msg.user.networkId) {
      return;
    }

    if (msg.move === 1) {
      PaintApp.data.presence.sendMessage(PaintApp.data.presence.getSharedInfo().id, {
        user: PaintApp.data.presence.getUserInfo(),
        content: {
          action: "entranceToDataURL",
          data: {
            width: PaintApp.elements.canvas.width
            width: PaintApp.elements.canvas.height
            src: PaintApp.elements.canvas.toDataURL()
          }
        }
      })
    }
    console.log(msg.move, userName);
  }

  /* PaintApp, contains the context of the application */
  var PaintApp = {
    libs: {},
    palettes: {},
    elements: {},
    buttons: {},
    paletteModesButtons: [],

    data: {
      isHost: true,
      history: {
        limit: 15,
        undo: [],
        redo: []
      },
      size: 5,
      color: {
        stroke: "#1500A7",
        fill: "#ff0000"
      },
      tool: undefined
    },
    modes: {},
    switchMode: switchMode,
    undoCanvas: undoCanvas,
    redoCanvas: redoCanvas,
    displayUndoRedoButtons: displayUndoRedoButtons,
    saveCanvas: saveCanvas,
    clearCanvas: clearCanvas,
    paletteRemoveActiveClass: paletteRemoveActiveClass,
    addActiveClassToElement: addActiveClassToElement,
    handleCurrentFloatingElement: handleCurrentFloatingElement,
    onDataReceived: onDataReceived,
    onSharedActivityUserChanged: onSharedActivityUserChanged
  };

  return PaintApp;
});
