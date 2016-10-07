window.addEventListener("load", function(){
    new Game(document.body);
});

function Game(parent){
    this.canvas = document.createElement("canvas");
    this.canvas.width = 310;
    this.canvas.height = 310;
    this.ctx = this.canvas.getContext("2d");
    parent.appendChild(this.canvas);

    this.size = {x: this.canvas.width, y: this.canvas.height};
    this.center = {x: this.size.x/2, y: this.size.y/2};

    this.bodies = createInvaders(this); 
    this.bodies.push(new Player(this));

    var self = this;
    function tick(){
        self.update();
        self.draw(self.ctx);
        requestAnimationFrame(tick);
    };

    tick();
};

Game.prototype.update = function(){
    var self = this;
    function notCollidingWith(b1){
        return self.bodies.filter(function(b2){
            return isColliding(b1, b2);
        }).length === 0;
    };

    this.bodies = this.bodies.filter(notCollidingWith);

    for (var i = 0; i < this.bodies.length; i++) {
        this.bodies[i].update();
    }
};

Game.prototype.draw = function(screen){
    screen.clearRect(0, 0, this.size.x, this.size.y);
    for (var i = 0; i < this.bodies.length; i++) {
        this.bodies[i].draw(screen);
    }
};

Game.prototype.addBody = function(body){
    this.bodies.push(body);
};

Game.prototype.invadersBelow = function(invader){
    return this.bodies.filter(function(i){
        return i instanceof Invader && 
               i.center.y > invader.center.y && 
               Math.abs(i.center.x - invader.center.x) > invader.size.x;
    }).length > 0;
};

function Player(game){
    this.game = game;
    this.size = {x: 15, y: 15};
    this.center = {x: game.center.x, y: game.size.y - 15};
    this.keyboarder = new Keyboarder();
};

Player.prototype.update = function(){
    if(this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)){
        this.center.x -= 2;
    }
    if(this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)){
        this.center.x += 2;
    }
    if(this.keyboarder.isDown(this.keyboarder.KEYS.SPACE)){
        this.game.addBody(new Bullet(this.game, 
                                    {x: this.center.x, y: this.center.y - this.size.y}, 
                                    {x: 0, y: -6}));
    }
};

Player.prototype.draw = function(screen){
    drawBody(screen, this);
};

function Invader(game, center){
    this.game = game;
    this.size = {x: 15, y: 15};
    this.center = center;
    this.patrolX = 0;
    this.speedX = 0.3;
};

Invader.prototype.update = function(){
    if(this.patrolX < 0 || this.patrolX > 40){
        this.speedX = -this.speedX;
    }
    this.center.x += this.speedX;
    this.patrolX += this.speedX;

    if(Math.random() > 0.995 && !this.game.invadersBelow(this)){
        this.game.addBody(new Bullet(this.game, 
                                    {x: this.center.x, y: this.center.y + this.size.y}, 
                                    {x: 0, y: 2}));
    }
};

Invader.prototype.draw = function(screen){
    drawBody(screen, this);
};

function createInvaders(game){
    var invaders = [];

    for (var i = 0; i < 24; i++) {
        var x = 30 + i % 8 * 30;
        var y = 30 + i % 3 * 30;
        invaders.push(new Invader(game, {x: x, y: y}));
    }

    return invaders;
}

function Bullet(game, center, velocity){
    this.game = game;
    this.size = {x: 3, y: 3};
    this.center = center;
    this.velocity = velocity;
};

Bullet.prototype.update = function(){
    this.center.x += this.velocity.x;
    this.center.y += this.velocity.y;
};

Bullet.prototype.draw = function(screen){
    drawBody(screen, this);
};

function drawBody(screen, body){
    screen.fillRect(body.center.x - body.size.x/2, 
                    body.center.y - body.size.y/2,
                    body.size.x, body.size.y);
};

function Keyboarder(){
    this.KEYS = {LEFT: 37, RIGHT: 39, SPACE: 32};
    var keyState = {};
    window.addEventListener("keydown", function(e){
        keyState[e.keyCode] = true;
    });
    window.addEventListener("keyup", function(e){
        keyState[e.keyCode] = false;
    });

    this.isDown = function(keyCode){
        return keyState[keyCode];
    };
};

function isColliding(b1, b2){
    return !( b1 === b2 ||
            b1.center.x + b1.size.x/2 <= b2.center.x + b2.size.x/2 ||
            b1.center.y + b1.size.y/2 <= b2.center.y + b2.size.y/2 ||
            b1.center.x - b1.size.x/2 >= b2.center.x - b2.size.x/2 ||
            b1.center.y - b1.size.y/2 >= b2.center.y - b2.size.y/2 );
}