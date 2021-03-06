
'use strict';

export var minesweeperModule = (function () {

  const squares = [];
  const indexes = [];
  const mines = [];
  const rows = 9, columns = 9, levelMines = 15;
  const totalSquares = rows * columns;

  // Comunication vars
  const { ReplaySubject } = rxjs;
  const communicatorObservable = new ReplaySubject(1);

  // Game state
  var timer = null;
  var gameStarted = false;
  var gameTimerInitiated = false;
  var seconds = 0;
  var remainingMines = levelMines;
  var remainingSquares = totalSquares - levelMines;

  function startGame() {
    restartGameVariables();

    // initialiting squares
    for (let i = 0; i < totalSquares; i++) {
      let square = {
        id: i,
        row: Math.floor(i / columns) + 1,
        column: (i % columns) + 1,
        value: '',
        state: '',
        siblingsIndexes: [],
        className: [],
        classValue: [],
        initial: true,
        flag: false,
      }
      squares.push(square);
      indexes.push(i);
    }

    // initialiting mines
    for (let i = 0; i < levelMines; i++) {
      let randomPosition = Math.floor(Math.random() * (indexes.length - 1));
      let randomIndex = indexes[randomPosition];
      squares[randomIndex].value = '💣';
      squares[randomIndex].classValue.push('bomb');

      indexes.splice(randomPosition, 1);
      mines.push(squares[randomIndex]);
    }

    // initialiting helping numbers
    var colors = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',]
    for (let i = 0; i < totalSquares; i++) {
      let square = squares[i];

      if (square.column == 1) {
        // top-left
        if (square.row == 1) {
          square.siblingsIndexes.push(i + 1);
          square.siblingsIndexes.push(i + columns);
          square.siblingsIndexes.push(i + columns + 1);
        }
        // bottom-left
        else if (square.row == rows) {
          square.siblingsIndexes.push(i + 1);
          square.siblingsIndexes.push(i - columns);
          square.siblingsIndexes.push(i - columns + 1);
        }
        else {
          square.siblingsIndexes.push(i + 1);
          square.siblingsIndexes.push(i + columns);
          square.siblingsIndexes.push(i + columns + 1);
          square.siblingsIndexes.push(i - columns);
          square.siblingsIndexes.push(i - columns + 1);
        }
      }
      else if (square.column == columns) {
        // top-rigth
        if (square.row == 1) {
          square.siblingsIndexes.push(i - 1);
          square.siblingsIndexes.push(i + columns);
          square.siblingsIndexes.push(i + columns - 1);
        }
        // bottom-rigth
        else if (square.row == rows) {
          square.siblingsIndexes.push(i - 1);
          square.siblingsIndexes.push(i - columns);
          square.siblingsIndexes.push(i - columns - 1);
        }
        else {
          square.siblingsIndexes.push(i - 1);
          square.siblingsIndexes.push(i + columns);
          square.siblingsIndexes.push(i + columns - 1);
          square.siblingsIndexes.push(i - columns);
          square.siblingsIndexes.push(i - columns - 1);
        }
      }
      else {
        // center-top
        if (square.row == 1) {
          square.siblingsIndexes.push(i - 1)
          square.siblingsIndexes.push(i + 1)
          square.siblingsIndexes.push(i + columns - 1)
          square.siblingsIndexes.push(i + columns)
          square.siblingsIndexes.push(i + columns + 1)
        }
        // bottom-top
        else if (square.row == rows) {
          square.siblingsIndexes.push(i - 1)
          square.siblingsIndexes.push(i + 1)
          square.siblingsIndexes.push(i - columns - 1)
          square.siblingsIndexes.push(i - columns)
          square.siblingsIndexes.push(i - columns + 1)
        }
        else {
          square.siblingsIndexes.push(i - 1)
          square.siblingsIndexes.push(i + 1)
          square.siblingsIndexes.push(i + columns - 1)
          square.siblingsIndexes.push(i + columns)
          square.siblingsIndexes.push(i + columns + 1)
          square.siblingsIndexes.push(i - columns - 1)
          square.siblingsIndexes.push(i - columns)
          square.siblingsIndexes.push(i - columns + 1)
        }
      }

      if (square.value != '💣') {
        let siblingMines = square.siblingsIndexes.filter(function getSiblingMines(siblingIndex) { return squares[siblingIndex].value == '💣' }).length;

        if (siblingMines > 0) {
          square.value = String(siblingMines);
          square.className.push('number');
          square.classValue.push(colors[siblingMines]);
        }
      }
    }

    renderBoardSquares(squares);
    gameStarted = true;
    communicatorObservable.next('GAME_LOADED');
  }

  function renderBoardSquares(squares) {
    var parent = document.getElementById('game-board');

    for (let i = 0; i < squares.length; i++) {
      parent.appendChild(createSquareElement(squares[i]));
    }
  }

  function createSquareElement(square) {
    var parent = document.getElementById('game-board');
    var oldChild = document.getElementById(square.id);

    if (oldChild) {
      parent.removeChild(oldChild)
    }

    setSqrState(square);
    setSqrClass(square);

    var squareElement = document.createElement('div');
    squareElement.setAttribute('id', square.id)
    squareElement.innerHTML = square.state;
    var squareClassName = square.className.join(' ');
    squareElement.setAttribute('class', 'square' + ' ' + squareClassName);
    var squareStyle = squareElement.style;
    squareStyle.gridRow = `${square.row}`;
    squareStyle.gridColumn = `${square.column}`;

    squareElement.addEventListener('touchstart', function (e) { onTouchStart(e, square) }, false);
    squareElement.addEventListener('touchend', function (e) { onTouchEnd(e, square) }, false);
    squareElement.addEventListener('click', function (e) { onClick(e, square) }, false);
    squareElement.addEventListener('contextmenu', function (e) { onRigthClick(e, square) }, false);
    return squareElement;
  }

  function setSqrState(square) {
    if (square.initial) {
      if (square.flag) {
        square.state = '🚩';
      }
      else {
        square.state = ''
      }
    }
    else {
      square.state = square.value;
    }
  }

  function setSqrClass(square) {
    if (square.initial) {
      if (square.flag) {
        square.className = ['square-initial', 'flag'];
      }
      else {
        square.className = ['square-initial'];
      }
    }
    else if (square.value == '❌') {
      square.className = ['false-flag'];
    }
    else {
      square.className = ['square-final', ...square.classValue];
    }
  }

  function resolveSquare(square) {
    if (gameStarted && square.initial && !square.flag) {
      square.initial = false;

      if (!gameTimerInitiated) {
        gameTimerInitiated = true;
        timer = setInterval(function () {
          seconds++;
          renderGameTimeUpdate(seconds);
        }, 1000);
        communicatorObservable.next('hold for adding flags');
      }

      if (square.value == '') {
        square.siblingsIndexes.forEach(siblingIndex => {
          resolveSquare(squares[siblingIndex]);
        });
      }

      if (square.value == '💣') {
        square.value = '💥';
        resolveGame();
        communicatorObservable.next('try again my friend!');
      } else {
        remainingSquares--;

        if (remainingSquares == 3) {
          communicatorObservable.next('You can\'t win mate!');
        }

        if (remainingSquares == 0) {
          win();
          communicatorObservable.next('Bastard!')
        }
      }

      renderBoardSquares([square]);
    }
  }

  function renderGameTimeUpdate(time) {
    let result;
    if (String(time).length >= 2) {
      result = `0${String(time)}`
    } else {
      result = `00${String(time)}`
    }
    var counterTime = document.getElementById('counter-time');
    counterTime.innerHTML = result;
  }

  function updateRemainingMines(update) {
    remainingMines += update;
    let result;
    if (String(remainingMines).length >= 2) {
      result = `0${String(remainingMines)}`
    } else {
      result = `00${String(remainingMines)}`
    }
    let remaining = document.getElementById('counter-mines');
    remaining.innerHTML = `<span>${result}</span >`;
  }

  function stopTimer() {
    clearInterval(timer);
    gameTimerInitiated = false;
  }

  function resolveGame() {
    gameStarted = false;
    stopTimer();
    setFaceEmoji('🙁');


    mines.forEach(squareWithMine => {
      if (!squareWithMine.flag) {
        squareWithMine.initial = false;
        renderBoardSquares([squareWithMine]);
      }
    });

    squares.forEach(square => {
      if (square.flag && square.value != '💣') {
        square.value = '❌';
        square.initial = false;
        renderBoardSquares([square]);
      }
    });

  }

  function win() {
    gameStarted = false;
    stopTimer();
    setFaceEmoji('😎');
    communicatorObservable.next({ winner: { score: seconds } });
  }

  function setFaceEmoji(emoji) {
    let faceElement = document.getElementById('restart');
    faceElement.innerHTML = emoji;
  }

  function restartGameVariables() {
    squares.splice(0, squares.length);
    indexes.splice(0, indexes.length);
    mines.splice(0, mines.length);
    gameStarted = false;
    gameTimerInitiated = false;
    seconds = 0;
    if (timer) {
      stopTimer();
      timer = null;
    };
    renderGameTimeUpdate(Number('000'));
    remainingMines = levelMines;
    updateRemainingMines(0);
    remainingSquares = totalSquares - levelMines;
    setFaceEmoji('🙂');
  }

  /* ================ EVENT HANDLERS ================================================================== */
  var touchEndTimer;

  function onTouchStart(ev, square) {
    ev.preventDefault();
    if (!touchEndTimer) {
      touchEndTimer = setTimeout(function () { onFlagSquare(square) }, 300);
    }
  }

  function onTouchEnd(ev, square) {
    ev.preventDefault();
    if (touchEndTimer) {
      clearTimeout(touchEndTimer);
      touchEndTimer = null;
    }
    resolveSquare(square);
  }

  function onClick(ev, square) {
    ev.preventDefault();
    resolveSquare(square)
  }

  function onRigthClick(ev, square) {
    ev.preventDefault();
    onFlagSquare(square)
  }

  function onFlagSquare(square) {
    if (square.initial) {
      square.flag = !square.flag;
      renderBoardSquares([square]);
      updateRemainingMines(square.flag ? - 1 : 1);
    }
  }

  const restartButton = document.getElementById('restart');
  restartButton.addEventListener('touchend', function (e) { handleGameStartEvent(e) }, false);
  restartButton.addEventListener('click', function (e) { handleGameStartEvent(e) }, false);

  function handleGameStartEvent(ev) {
    ev.preventDefault();
    startGame();
  }

  startGame();

  return {
    communicator: communicatorObservable,
  }

})();