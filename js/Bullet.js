function Bullet(game, center, velocity){
    this.fillStyle = "rgb(200, 0, 0)";
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

Bullet.prototype.explode = function(screen){
};
