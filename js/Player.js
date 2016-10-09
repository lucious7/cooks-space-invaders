function Player(game){
    this.fillStyle = "rgb(255, 255, 255)";
    this.game = game;
    this.size = {x: 15, y: 15};
    this.center = {x: game.center.x, y: game.size.y - this.size.y * 2.5};
    this.keyboarder = new Keyboarder();
    this.bulletDelay = 0;
    this.shootSound = document.createElement("audio");
    this.shootSound.src = "sfx/shoot.mp3";
};

Player.prototype.update = function(){
    if(this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)){
        if(this.center.x - this.size.x/2 > 0){
            this.center.x -= 2;
        }
    }
    if(this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)){
        if(this.center.x + this.size.x/2 < this.game.canvas.width){
            this.center.x += 2;
        } 
    }
    if(this.keyboarder.isDown(this.keyboarder.KEYS.SPACE) ||
        this.keyboarder.isDown(this.keyboarder.KEYS.UP)){
        if(this.bulletDelay <= 0){
            this.shootSound.play();
            this.game.addBody(new Bullet(this.game, 
                                        {x: this.center.x, y: this.center.y - this.size.y}, 
                                        {x: 0, y: -6}));
            this.bulletDelay = 30
        }
    }
    this.bulletDelay--;
};

Player.prototype.draw = function(screen){
    drawBody(screen, this);
};

Player.prototype.explode = function(screen){
    explodeBody(screen, this);
};
