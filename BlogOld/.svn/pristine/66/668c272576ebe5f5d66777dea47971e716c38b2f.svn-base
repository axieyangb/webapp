
var Status = {
    ACCESSIBLE_POINT: 0,
    UNACCESSIBLE_POINT: 1,
    BOUNDARY_POINT: 2,
    CURRENT_POINT: 3,
    EXIT_POINT: 4,
    EVENT_POINT: 5
}

var Direct = {
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
}

var Game = {
    display: null,
    width: null,
    length: null,
    startX: null,
    startY: null,
    currentX: null,
    currentY: null,
    endX: null,
    endY: null,
    radius: null,
    init: function () {
        this.width = 80;
        this.length = 40;
        this.radius = 5;
        this._resetStorage();
        ROT.DEFAULT_WIDTH = this.width;
        ROT.DEFAULT_HEIGHT = this.length;
        this.display = new ROT.Display();
        document.getElementById("Container").innerHTML = "";
        document.getElementById("Container").appendChild(this.display.getContainer());
        this._generateMap();
        this._setStartPoint();
        this._setEndPoint();
        this._initialPartialMap(this.startX, this.startY, this.radius);
        this._presetAvailableEvents();
        this._generateEvents(50);
        setInterval(this._eventsAutoMove, 1000);
        // this._drawWholeMap();
        resize();
    }
}
/*
0-available path,
3- current point,
4- exit point,
1- unavailable places
2-bounday,
*/
Game.map = {};
Game.visitedCells = [];
Game.freeSpace = [];
Game.EventPoints = [];
Game.ActiveEventPoints = [];
Game._resetStorage = function () {
    Game.map = {};
    Game.visitedCells = [];
    Game.freeSpace = [];
    Game.EventPoints = [];
    Game.ActiveEventPoints = [];
}
Game._drawOnePixalMap = function (key) {
    var parts = key.split(",");
    var x = parseInt(parts[0]);
    var y = parseInt(parts[1]);
    var ch;
    if (this.map[key] === Status.ACCESSIBLE_POINT) {
        ch = ".";
    } else if (this.map[key] === Status.CURRENT_POINT) {
        ch = "X";
    } else if (this.map[key] === Status.EXIT_POINT) {
        ch = "O";
    }
    else if (this.map[key] === Status.EVENT_POINT) {
        this.map[key] = 0;
        ch = ".";
    }
    else {
        ch = "";
    }
    var color = "black";
    if (this.map[key] === Status.ACCESSIBLE_POINT || this.map[key] === Status.EVENT_POINT) color = "#333";
    else if (this.map[key] === Status.BOUNDARY_POINT) color = "#999";
    else if (this.map[key] === Status.UNACCESSIBLE_POINT) color = "black";
    this.display.draw(x, y, ch, "#fff", color);
}
Game._eraseOnePixalMap = function (key) {
    var parts = key.split(",");
    var x = parseInt(parts[0]);
    var y = parseInt(parts[1]);
    this.display.draw(x, y, "", "#fff", "black");
}
Game._drawCurrentPoint = function (prevx, prevy, curx, cury) {
    Game.map[prevx + "," + prevy] = Status.ACCESSIBLE_POINT;
    Game.map[curx + "," + cury] = Status.CURRENT_POINT;
    this.display.draw(prevx, prevy, ".", "#fff", "#333");
    this.display.draw(curx, cury, "X", "#fff", "#333");
}

Game._drawWholeMap = function () {
    for (var key in this.map) {
        this._drawOnePixalMap(key);
    }
}
Game._generateMap = function () {
    var digger = new ROT.Map.Digger();
    var digCallback = function (x, y, value) {
        this.map[x + "," + y] = value;
        if (value === Status.ACCESSIBLE_POINT) {
            Game.freeSpace.push(x + "," + y);
        }
    }
    digger.create(digCallback.bind(this));
    this._setBoundary();
};
Game._setBoundary = function () {
    for (var key in this.map) {
        if (this.map[key] == 1 || this.map[key] == 2) continue;
        var parts = key.split(",");
        var x = parseInt(parts[0]);
        var y = parseInt(parts[1]);
        try {
            if (this.map[(x - 1) + "," + y] == 1)
                this.map[(x - 1) + "," + y] = 2;
        } catch (err) { };
        try {
            if (this.map[(x + 1) + "," + y] == 1)
                this.map[(x + 1) + "," + y] = 2;
        } catch (err) { };
        try {
            if (this.map[x + "," + (y - 1)] == 1)
                this.map[x + "," + (y - 1)] = 2;
        } catch (err) { };
        try {
            if (this.map[x + "," + (y + 1)] == 1)
                this.map[x + "," + (y + 1)] = 2;
        } catch (err) { };
        try {
            if (this.map[(x + 1) + "," + (y + 1)] == 1)
                this.map[(x + 1) + "," + (y + 1)] = 2;
        } catch (err) { };
        try {
            if (this.map[(x - 1) + "," + (y - 1)] == 1)
                this.map[(x - 1) + "," + (y - 1)] = 2;
        } catch (err) { };
        try {
            if (this.map[(x - 1) + "," + (y + 1)] == 1)
                this.map[(x - 1) + "," + (y + 1)] = 2;
        } catch (err) { };
        try {
            if (this.map[(x + 1) + "," + (y - 1)] == 1)
                this.map[(x + 1) + "," + (y - 1)] = 2;
        } catch (err) { };
    }
}
Game._drawPartialMap = function (prevx, prevy, x, y, radius) {
    var startX = Math.max(x - radius, 0);
    var startY = Math.max(0, y - radius);
    var endX = Math.min((x + radius), Game.width - 1);
    var endY = Math.min(y + radius, Game.length - 1);
    if (y < prevy) {
        if (prevy + radius <= Game.length - 1) {
            //move UP erase the buttom line
            for (var i = startX; i <= endX; i++) {
                this._eraseOnePixalMap(i + "," + (parseInt(endY) + 1));
            }
        }
        if (prevy - radius > 0) {
            //move UP add the top line
            for (var i = startX; i <= endX; i++) {
                this._drawOnePixalMap(i + "," + (parseInt(startY)));
            }
        }
    }
    else if (y > prevy) {
        if (prevy - radius >= 0) {
            //move down erase the top line
            for (var i = startX; i <= endX; i++) {
                this._eraseOnePixalMap(i + "," + (parseInt(startY) - 1));
            }
        }
        if (prevy + radius < Game.length - 1) {
            //move down add the button line
            for (var i = startX; i <= endX; i++) {
                this._drawOnePixalMap(i + "," + (parseInt(endY)));
            }
        }
    } else if (x < prevx) {
        if (prevx + radius <= Game.width - 1) {
            //move left erase the right line
            for (var j = startY; j <= endY; j++) {
                this._eraseOnePixalMap((parseInt(endX) + 1) + "," + j);
            }
        }
        if (prevx > 0) {
            //move left add the left line
            for (var j = startY; j <= endY; j++) {
                this._drawOnePixalMap((parseInt(startX)) + "," + j);
            }
        }
    } else if (x > prevx) {
        if (prevx - radius >= 0) {
            //move right erase the left line
            for (var j = startY; j <= endY; j++) {
                this._eraseOnePixalMap((parseInt(startX) - 1) + "," + j);
            }
        }
        if (prevx + radius < Game.width - 1) {
            //move right add the right line
            for (var j = startY; j <= endY; j++) {
                this._drawOnePixalMap((parseInt(endX)) + "," + j);
            }
        }
    }
}
Game._initialPartialMap=function(x, y, radius)
{
    var startX = Math.max(x - radius, 0);
    var startY = Math.max(0, y - radius);
    var endX = Math.min((x + radius), Game.width - 1);
    var endY = Math.min(y + radius, Game.length - 1);
    for (var i = startX; i <= endX; i++) {
        for (var j = startY; j < endY; j++) {
            this._drawOnePixalMap(i + "," + j);
        }
    }
}
Game._setStartPoint = function () {
    var key = Object.keys(this.map).find(this._findPoint);
    var parts = key.split(',');
    this.currentX = this.startX = parseInt(parts[0]);
    this.currentY = this.startY = parseInt(parts[1]);
    this.map[this.startX + "," + this.startY] = 3;
}
Game._setEndPoint = function () {
    var key = Object.keys(this.map).reverse().find(this._findPoint);
    var parts = key.split(',');
    this.endX = parseInt(parts[0]);
    this.endY = parseInt(parts[1]);
    this.map[this.endX + "," + this.endY] = 4;
}
Game._findPoint = function (p) {
    var parts = p.split(",");
    var x = parseInt(parts[0]);
    var y = parseInt(parts[1]);
    if (x === 0 || y === 0 || x === this.width - 1 || y === this.length - 1) return false;
    return Game.map[x + "," + y] === Status.ACCESSIBLE_POINT && Game.map[(x - 1) + "," + (y - 1)] === Status.ACCESSIBLE_POINT && Game.map[(x - 1) + "," + (y + 1)] === Status.ACCESSIBLE_POINT && Game.map[(x + 1) + "," + (y - 1)] === Status.ACCESSIBLE_POINT && Game.map[(x + 1) + "," + (y + 1)] === Status.ACCESSIBLE_POINT;
}
Game._presetAvailableEvents = function () {
    Game.EventPoints = Game.freeSpace.filter(Game._findPoint);
}
Game._generateEvents = function (num) {
    for (var i = 0; i < num; i++) {
        var index = Math.floor(Math.random() * Game.EventPoints.length);
        Game.map[Game.EventPoints[index]] = Status.EVENT_POINT;
        Game.EventPoints.splice(index, 1);
        Game.ActiveEventPoints.push(Game.EventPoints[index]);
    }

}

Game._eventsAutoMove = function () {
    var cloneArr = Game.ActiveEventPoints.slice(0);
    Game.ActiveEventPoints = [];
    var startX = Math.max(Game.currentX - Game.radius, 0);
    var startY = Math.max(0, Game.currentY - Game.radius);
    var endX = Math.min(Game.currentX + Game.radius, Game.width);
    var endY = Math.min(Game.currentY + Game.radius, Game.length);
    for (var i = 0; i < cloneArr.length; i++) {
        var directs = []; if (cloneArr[i] == undefined) continue;
        var parts = cloneArr[i].split(",");
        var x = parseInt(parts[0]);
        var y = parseInt(parts[1]);
        if (Game.map[(x + 1) + "," + y] === Status.ACCESSIBLE_POINT) {
            directs.push(Direct.DOWN);
        }
        if (Game.map[(x - 1) + "," + y] === Status.ACCESSIBLE_POINT) {
            directs.push(Direct.UP);
        }
        if (Game.map[x + "," + (y + 1)] === Status.ACCESSIBLE_POINT) {
            directs.push(Direct.RIGHT);
        }
        if (Game.map[x + "," + (y - 1)] === Status.ACCESSIBLE_POINT) {
            directs.push(Direct.LEFT);
        }
        var randomDirect = directs[Math.floor(Math.random() * directs.length)];
        Game.map[x + "," + y] = Status.ACCESSIBLE_POINT;
        if (x <= endX && x >= startX && y <= endY && y >= startY)
            Game.display.draw(x, y, ".", "#fff", "#333");
        if (randomDirect === Direct.UP) {
            Game.map[(x - 1) + "," + y] = Status.EVENT_POINT;
            if ((x - 1) <= endX && (x - 1) >= startX && y <= endY && y >= startY)
                Game.display.draw(x - 1, y, "P", "#fff", "#333");
            Game.ActiveEventPoints.push((x - 1) + "," + y);
        }
        else if (randomDirect === Direct.DOWN) {
            Game.map[(x + 1) + "," + y] = Status.EVENT_POINT;
            if ((x + 1) <= endX && (x + 1) >= startX && y <= endY && y >= startY)
                Game.display.draw(x + 1, y, "P", "#fff", "#333");
            Game.ActiveEventPoints.push((x + 1) + "," + y);
        }
        else if (randomDirect === Direct.LEFT) {
            Game.map[x + "," + (y - 1)] = Status.EVENT_POINT;
            if (x <= endX && x >= startX && (y - 1) <= endY && (y - 1) >= startY)
                Game.display.draw(x, y - 1, "P", "#fff", "#333");
            Game.ActiveEventPoints.push(x + "," + (y - 1));
        }
        else if (randomDirect === Direct.RIGHT) {
            Game.map[x + "," + (y + 1)] = Status.EVENT_POINT;
            if (x <= endX && x >= startX && (y + 1) <= endY && (y + 1) >= startY)
                Game.display.draw(x, y + 1, "P", "#fff", "#333");
            Game.ActiveEventPoints.push(x + "," + (y + 1));
        }
    }
}
document.addEventListener("keydown", function (event) {
    if (event.which != 37 && event.which != 38 && event.which != 39 && event.which != 40) return;
    var prevX = Game.currentX;
    var prevY = Game.currentY;
    if (event.which == 37) { Game.currentX -= 1; }
    if (event.which == 39) { Game.currentX += 1; }
    if (event.which == 38) { Game.currentY -= 1; }
    if (event.which == 40) { Game.currentY += 1; }
    if (Game.map[Game.currentX + "," + Game.currentY] != 0) {
        if (Game.map[Game.currentX + "," + Game.currentY] == 4) {
            Game.init();
            resize();
            return;
        }
        Game.currentX = prevX;
        Game.currentY = prevY;
        return;
    }
    Game._drawCurrentPoint(prevX, prevY, Game.currentX, Game.currentY);
    Game._drawPartialMap(prevX, prevY, Game.currentX, Game.currentY, 5);
});

function touchControl(direct) {
    var prevX = Game.currentX;
    var prevY = Game.currentY;
    if (direct === "left") { Game.currentX -= 1; }
    else if (direct === "right") { Game.currentX += 1; }
    else if (direct === "up") { Game.currentY -= 1; }
    else if (direct === "down") { Game.currentY += 1; }
    if (Game.map[Game.currentX + "," + Game.currentY] != 0) {
        if (Game.map[Game.currentX + "," + Game.currentY] == 4) {
            Game.init();
            resize();
            return;
        }
        Game.currentX = prevX;
        Game.currentY = prevY;
        return;
    }
    Game._drawCurrentPoint(prevX, prevY, Game.currentX, Game.currentY);
    Game._drawPartialMap(Game.currentX, Game.currentY, 5);
}

function resize() {
    var ratio = 0.8;
    var height = $('#Container > canvas').attr('height');
    var width = $('#Container > canvas').attr('width');
    var winWidth = $(window).width();
    var winHeight = $(window).height();
    if (winWidth - width > winHeight - height) {
        $('#Container > canvas').height(winHeight * ratio);
        $('#Container > canvas').width(width / height * winHeight * ratio);
    } else {
        $('#Container > canvas').width(winWidth * ratio);
        $('#Container > canvas').height(height / width * winWidth * ratio);
    }
    $('#Container > canvas').css({
        "padding-left": (($(window).width() - $('#Container > canvas').width()) / 2 + 'px')
    });
    $('#Container > canvas').css({
        "padding-top": "15px"
    });
}