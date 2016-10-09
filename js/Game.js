function Game(parent){
    this.canvas = document.createElement("canvas");
    this.canvas.width = 310;
    this.canvas.height = 310;
    this.ctx = this.canvas.getContext("2d");
    parent.appendChild(this.canvas);

    this.size = {x: this.canvas.width, y: this.canvas.height};
    this.center = {x: this.size.x/2, y: this.size.y/2};

    this.player = new Player(this);
    this.bodies = createInvaders(this); 
    this.bodies.push(this.player);
    this.bodiesColliding = [];
    this.finalDelay = 30;

    var self = this;
    function tick(){
        if(!self.status || self.finalDelay > 0){
            if(self.status) self.finalDelay--;
            self.update();
            self.draw();
        }
        if(self.status === "LOSE"){
            self.gameOver();
        } else if(self.status === "WON"){
            self.victory();
        }
        requestAnimationFrame(tick);
    };

    tick();
};

Game.prototype.update = function(){
    var self = this;
    this.bodies.forEach(function(b1){
        self.bodies.forEach(function(b2){
            if(isColliding(b1,b2)){
                b1.colliding = b2.colliding = true;
            }
        });
    });

    this.bodiesColliding = this.bodies.concat(this.bodiesColliding)
                                .filter(function(b){ return b.colliding && b.explosionStep!=0; });
    this.bodies = this.bodies.filter(function(b){ return !b.colliding; });

    if(this.bodies.filter(b => b instanceof Invader).length === 0){
        this.status = "WON";
    } else if(this.bodiesColliding.includes(this.player)){
        this.status = "LOSE";
    } else {
        for (var i = 0; i < this.bodies.length; i++) {
            this.bodies[i].update();
        }
    }
};

Game.prototype.draw = function(){
    var screen = this.ctx;
    screen.fillStyle = "rgb(0,0,0)";
    screen.fillRect(0, 0, this.size.x, this.size.y);
    for (var i = 0; i < this.bodies.length; i++) {
        this.bodies[i].draw(screen);
    }
    for(var i = 0; i < this.bodiesColliding.length; i++){
        this.bodiesColliding[i].explode(screen);
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

Game.prototype.gameOver = function(){
    console.log("GAME OVER!!!");
    this.ctx.font = 30+this.finalDelay + "px Verdana";
    this.ctx.strokeStyle = "rgba(255, 255, 255,0.5)";
    this.ctx.strokeText("GAME OVER...", this.center.x - this.size.x/3, this.center.y);
};

Game.prototype.victory = function(){
    console.log("VICTORY!!!");
    this.ctx.font = 30+this.finalDelay + "px Arial";
    this.ctx.strokeStyle = "rgba(255, 255, 255,0.5)";
    this.ctx.strokeText("YOU WON...", this.center.x - this.size.x/4, this.center.y);
};
