/* PaintApp is a big object containing UI stuff, libraries and helpers */
define([], function() {
  /* Function to disable all active class inside the toolbar */
  function paletteRemoveActiveClass() {
    for (var i = 0; i < PaintApp.paletteModesButtons.length; i++) {
      PaintApp.paletteModesButtons[i].className = PaintApp.paletteModesButtons[i].className.replace(/(?:^|\s)active(?!\S)/g, '');
    }
  }

  /* Function to add active class to a specific element */
  function addActiveClassToElement(element) {
    element.className += ' active';
  }

  /* Switch current drawing mode */
  function switchMode(newMode) {
    saveCanvas();

    PaintApp.data.mode = newMode;
    PaintApp.handleCurrentFloatingElement();

    PaintApp.data.tool.onMouseDown = PaintApp.modes[newMode].onMouseDown;
    PaintApp.data.tool.onMouseDrag = PaintApp.modes[newMode].onMouseDrag;
    PaintApp.data.tool.onMouseUp = PaintApp.modes[newMode].onMouseUp;
  }

  /* Clear the canvas */
  function clearCanvas() {
    var ctx = PaintApp.elements.canvas.getContext('2d');
    ctx.clearRect(0, 0, PaintApp.elements.canvas.width, PaintApp.elements.canvas.height);
    PaintApp.saveCanvas();
  }

  /* Trigger undo click, undo using the history */
  function undoCanvas() {
    //Removing any floating element
    PaintApp.handleCurrentFloatingElement();
    if (PaintApp.data.history.undo.length < 2) {
      return;
    }

    PaintApp.modes.Pen.point = undefined;
    var canvas = PaintApp.elements.canvas;
    var ctx = canvas.getContext('2d');
    var img = new Image();
    var imgSrc = PaintApp.data.history.undo[PaintApp.data.history.undo.length - 2];
    var imgSrc2 = PaintApp.data.history.undo[PaintApp.data.history.undo.length - 1];

    /* Loading of the image stored in history */
    img.onload = function() {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    };
    img.src = imgSrc;

    PaintApp.data.history.redo.push(imgSrc2);
    PaintApp.data.history.undo.pop();

    /* Update the availability of undo/redo */
    displayUndoRedoButtons();

    return imgSrc;
  }

  /* Trigger redo click, undo using the history */
  function redoCanvas() {
    //Removing any floating element
    handleCurrentFloatingElement();
    if (PaintApp.data.history.redo.length === 0) {
      return;
    }

    PaintApp.modes.Pen.point = undefined;
    var canvas = PaintApp.elements.canvas;
    var ctx = canvas.getContext('2d');
    var img = new Image();
    var imgSrc = PaintApp.data.history.redo[PaintApp.data.history.redo.length - 1];

    /* Loading of the image stored in history */
    img.onload = function() {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    };
    img.src = imgSrc;

    PaintApp.data.history.undo.push(imgSrc);
    PaintApp.data.history.redo.pop();

    /* Update the availability of undo/redo */
    displayUndoRedoButtons();

    return imgSrc;
  }

  /* Update the availability of undo/redo */
  function displayUndoRedoButtons() {
    var notAvailableOpacity = '0.4';
    var availableOpacity = '1';

    /* If activity is shared and we are not the host we cannot do undo/redo */
    if (PaintApp.data.isShared && !PaintApp.data.isHost) {
      PaintApp.elements.redoButton.style.opacity = notAvailableOpacity;
      PaintApp.elements.undoButton.style.opacity = notAvailableOpacity;
      return;
    }

    /* Check of the ability to use redo */
    if (PaintApp.data.history.redo.length === 0) {
      PaintApp.elements.redoButton.style.opacity = notAvailableOpacity;
    } else {
      PaintApp.elements.redoButton.style.opacity = availableOpacity;
    }

    /* Check of the ability to do use undo */
    if (PaintApp.data.history.undo.length <= 1) {
      PaintApp.elements.undoButton.style.opacity = notAvailableOpacity;
    } else {
      PaintApp.elements.undoButton.style.opacity = availableOpacity;
    }
  }

  /* Storing canvas onto history */
  function saveCanvas() {
    var canvas = PaintApp.elements.canvas;
    var image = canvas.toDataURL();

    /* If doing a new action, setting redo to an empty list */
    if ((PaintApp.data.history.undo.length > 0 && PaintApp.data.history.undo[PaintApp.data.history.undo.length - 1] !== image) || (PaintApp.data.history.undo.length === 0)) {
      PaintApp.data.history.undo.push(image);
      PaintApp.data.history.redo = [];
    }

    /* Limiting history size*/
    if (PaintApp.data.history.redo.length > PaintApp.data.history.limit) {
      PaintApp.data.history.redo = PaintApp.data.history.redo.slice(1);
    }

    /* Limiting history size*/
    if (PaintApp.data.history.undo.length > PaintApp.data.history.limit) {
      PaintApp.data.history.undo = PaintApp.data.history.undo.slice(1);
    }

    /* Refreshing undo / redo */
    displayUndoRedoButtons();

    /* If sharedActivity and not the host, tell the host to save his copy of the canvas */
    if (PaintApp.data.isShared && !PaintApp.data.isHost) {
      PaintApp.data.presence.sendMessage(PaintApp.data.presence.getSharedInfo().id, {
        user: PaintApp.data.presence.getUserInfo(),
        content: {
          action: 'saveCanvas'
        }
      });
    }
  }

  /* Removing floating elements used by copy/paste, stamps, text */
  function handleCurrentFloatingElement() {
    if (PaintApp.data.currentElement !== undefined) {
      if (PaintApp.data.currentElement.type != 'copy/paste') {
        PaintApp.data.currentElement.element.parentElement.removeChild(PaintApp.data.currentElement.element);
        PaintApp.data.currentElement = undefined;
      } else {
        if (PaintApp.data.mode != 'Copy' && PaintApp.data.mode != 'Paste') {
          PaintApp.data.currentElement.element.parentElement.removeChild(PaintApp.data.currentElement.element);
          PaintApp.data.currentElement = undefined;
        }
      }
    }
  }

  /* Handle data reception in shared activity */
  function onDataReceived(msg) {
    /* Ignore messages coming from ourselves */
    if (PaintApp.data.presence.getUserInfo().networkId === msg.user.networkId) {
      return;
    }

    var userName = msg.user.name.replace('<', '&lt;').replace('>', '&gt;');

    switch (msg.content.action) {

      /* Request to draw points/line */
      case 'path':
        ctx = PaintApp.elements.canvas.getContext('2d');
        ctx.beginPath();
        ctx.strokeStyle = msg.content.data.strokeStyle;
        ctx.lineCap = msg.content.data.lineCap;
        ctx.lineWidth = msg.content.data.lineWidth;
        ctx.moveTo(msg.content.data.from.x, msg.content.data.from.y);
        ctx.lineTo(msg.content.data.to.x, msg.content.data.to.y);
        ctx.stroke();
        break;

        /* Request to draw text */
      case 'text':
        ctx = PaintApp.elements.canvas.getContext('2d');
        ctx.font = msg.content.data.font;
        ctx.fillStyle = msg.content.data.fillStyle;
        ctx.textAlign = msg.content.data.textAlign;
        ctx.fillText(msg.content.data.text, msg.content.data.left, msg.content.data.top);
        break;

        /* Request to draw image */
      case 'drawImage':
        ctx = PaintApp.elements.canvas.getContext('2d');
        var img = new Image();
        img.onload = function() {
          console.log('DRAW');
          ctx.drawImage(img, msg.content.data.left, msg.content.data.top, msg.content.data.width, msg.content.data.height);
        };
        img.src = msg.content.data.src;
        break;

        /* Request to draw stamp */
      case 'drawStamp':
        var platform = 'webkit';
        var isFirefox = typeof InstallTrigger !== 'undefined';
        if (isFirefox) {
          platform = 'gecko';
        }
        ctx = PaintApp.elements.canvas.getContext('2d');
        var stampURL = msg.content.data.stampBase.replace('{platform}', platform);
        var url = window.location.href.split('/');
        url.pop();
        url = url.join('/') + '/' + stampURL;
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onload = function(e) {
          if (request.status === 200 || request.status === 0) {
            var stamp = PaintApp.modes.Stamp.changeColors(request.responseText, msg.content.data.color.fill, msg.content.data.color.stroke);
            var img = new Image();
            img.onload = function() {
              console.log('DRAW');
              ctx.drawImage(img, msg.content.data.left, msg.content.data.top, msg.content.data.width, msg.content.data.height);
            };
            img.src = 'data:image/svg+xml;base64,' + btoa(stamp);
          }
        };
        request.send(null);
        break;

        /* When entering inside the collaboration mode this message will be used to get the current paint  */
      case 'entranceToDataURL':
        if (PaintApp.data.isHost) {
          //|| PaintApp.data.entranceToDataURL) {
          return;
        }
        PaintApp.data.entranceToDataURL = true;
        PaintApp.clearCanvas();
        img = new Image();
        img.onload = function() {
          PaintApp.elements.canvas.getContext('2d').drawImage(img, 0, 0, msg.content.data.width, msg.content.data.height);
        };
        img.src = msg.content.data.src;
        break;

        /* Request to redraw the canvas  */
      case 'toDataURL':
        PaintApp.clearCanvas();
        img = new Image();
        img.onload = function() {
          PaintApp.elements.canvas.getContext('2d').drawImage(img, 0, 0, msg.content.data.width, msg.content.data.height);
        };
        img.src = msg.content.data.src;
        break;

        /* Request to clear the canvas  */
      case 'clearCanvas':
        PaintApp.clearCanvas();
        break;

        /* Request to save the canvas  */
      case 'saveCanvas':
        if (PaintApp.data.isHost) {
          saveCanvas();
        }
        break;
    }
  }

  /* Function to handle user enter/exit  */
  function onSharedActivityUserChanged(msg) {

    /* Ignore messages coming from ourselves */
    if (PaintApp.data.presence.getUserInfo().networkId === msg.user.networkId) {
      return;
    }

    var userName = msg.user.name.replace('<', '&lt;').replace('>', '&gt;');

    /* Send current paint when a user enters inside the shared activity */
    if (msg.move === 1) {
      PaintApp.data.presence.sendMessage(PaintApp.data.presence.getSharedInfo().id, {
        user: PaintApp.data.presence.getUserInfo(),
        content: {
          action: 'entranceToDataURL',
          data: {
            width: PaintApp.elements.canvas.width,
            height: PaintApp.elements.canvas.height,
            src: PaintApp.elements.canvas.toDataURL()
          }
        }
      });
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
        stroke: '#1500A7',
        fill: '#ff0000'
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
