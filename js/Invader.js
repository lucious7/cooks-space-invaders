function Invader(game, center){
    this.fillStyle = "rgb(0, 200, 0)";
    this.game = game;
    this.size = {x: 15, y: 15};
    this.center = center;
    this.patrolX = 0;
    this.speedX = 0.3;
};

Invader.prototype.update = function(){
    if(this.patrolX < -20 || this.patrolX > 150){
        this.speedX = -(Math.abs(this.speedX * 1.5) > 2 ? this.speedX : this.speedX * 1.5);
        this.center.y += this.size.y; 
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

Invader.prototype.explode = function(screen){
    explodeBody(screen, this);
};
