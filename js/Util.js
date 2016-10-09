function drawBody(screen, body){
    screen.fillStyle = body.fillStyle;
    screen.fillRect(body.center.x - body.size.x/2, 
                    body.center.y - body.size.y/2,
                    body.size.x, body.size.y);
};

var explosionSound = document.createElement("audio");
explosionSound.src = "sfx/explosion.mp3";

function explodeBody(screen, body){
    var explosionVelocity = 1;
    if(body.explosionStep == undefined){
        explosionSound.play();
        body.explosionStep = 30;
        body.particles = [];
        for(var i = 0; i < 4; i++){
            var x = body.center.x + (i%2 ? body.size.x/4 : -body.size.x/4);
            var y = body.center.y + (i%2 ? body.size.y/4 : -body.size.y/4);
            body.particles.push({ center: {x: x, y: y}, 
                                  size: {x: body.size.x/2, y: body.size.y/2},
                                  fillStyle: body.fillStyle });
        }
    }
    if(body.explosionStep > 0){
        body.explosionStep--;
        for(var i = 0; i < body.particles.length; i++){
            body.particles[i].center.x += (i%2 ? explosionVelocity : -explosionVelocity);
            body.particles[i].center.y += (i<2 ? -explosionVelocity : explosionVelocity);
        }

        for(var i = 0; i < 4; i++){
            drawBody(screen, body.particles[i]);
        }
    }
};

function isColliding(b1, b2){
    return !( b1 === b2 || (b1 instanceof Bullet && b2 instanceof Bullet) ||
        b1.center.x + b1.size.x/2 <= b2.center.x - b2.size.x/2 ||
        b1.center.y + b1.size.y/2 <= b2.center.y - b2.size.y/2 ||
        b1.center.x - b1.size.x/2 >= b2.center.x + b2.size.x/2 ||
        b1.center.y - b1.size.y/2 >= b2.center.y + b2.size.y/2 );
}


function createInvaders(game){
    var invaders = [];

    for (var i = 0; i < 24; i++) {
        var x = 30 + i % 8 * 30;
        var y = 30 + i % 3 * 30;
        invaders.push(new Invader(game, {x: x, y: y}));
    }

    return invaders;
}