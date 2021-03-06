/**
 * Created at 15/11/18.
 * @Author Ling.
 * @Email i@zeroling.com
 */
let canvas = document.getElementById('canvas');
let stage = new Stage(canvas);
let createBall = radius => {
    radius = (radius === undefined) ? 20 : radius;
    let r = Math.floor(Math.random() * 255),
        g = Math.floor(Math.random() * 255),
        b = Math.floor(Math.random() * 255);
    return new CVS.$sprite(stage.ctx, {
        x: 0,
        y: 0,
        width: radius * 2,
        draw: function () {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2, true);
            this.ctx.closePath();
            this.ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + Math.min(1, this.width / (2 * radius)) + ')';
            this.ctx.fill();
        }
    });
};

let initialize = () => {
    let focalLength = 250,
        ballR = 5,
        ballN = 20,
        balls = [],
        vpx = 0,
        vpy = 0,
        angleY = 0,
        angleX = 0;

    for (var i = 0; i < ballN; i++) {
        let ball = createBall(ballR);
        stage.addChild(ball);
        ball.xpos = Math.random() * 200 - 100;
        ball.ypos = Math.random() * 200 - 100;
        ball.zpos = Math.random() * 200 - 100;
        balls.push(ball);
    }
    vpx = canvas.width / 2;
    vpy = canvas.height / 2;

    stage.addEventListener('mousemove', function (x, y) {
        angleY = (x - vpx) * .001;
        angleX = (y - vpy) * .001;
    });

    function rotateY(ball, angleY) {
        let cosy = Math.cos(angleY),
            siny = Math.sin(angleY),
            x1 = ball.xpos * cosy - ball.zpos * siny,
            z1 = ball.zpos * cosy + ball.xpos * siny;
        ball.xpos = x1;
        ball.zpos = z1;
    }

    function rotateX(ball, angleX) {
        var cosx = Math.cos(angleX),
            sinx = Math.sin(angleX),
            y1 = ball.ypos * cosx - ball.zpos * sinx,
            z1 = ball.zpos * cosx + ball.ypos * sinx;
        ball.ypos = y1;
        ball.zpos = z1;
    }

    function render(ball) {
        if ( ball.zpos > -focalLength ) {
            var scale = focalLength / (focalLength + ball.zpos);
            ball.x = vpx + ball.xpos * scale;
            ball.y = vpy + ball.ypos * scale;
            ball.width = ballR * 2 * scale;

            var ck = document.getElementById('ck').checked;
            if ( ck == false ) ball.width = 0;
        }
    }

    function drawLinesBetweenBalls() {
        var ctx = stage.ctx;
        ctx.beginPath();
        ctx.moveTo(balls[0].x, balls[0].y);
        for (var i = 0; i < balls.length; i++) {
            ctx.lineTo(balls[i].x, balls[i].y);
        }
        ctx.closePath();
        ctx.stroke();
    }

    function sortZ() {
        balls.sort(function (a, b) {
            return b.zpos - a.zpos
        });
        stage.children.sort(function (a, b) {
            return b.zpos - a.zpos
        });
    }

    stage.onRefresh = function () {
        for (var i = 0, ball; ball = balls[i]; i++) {
            rotateX(ball, angleX);
            rotateY(ball, angleY);
            render(ball);
        }
        //sortZ();
        drawLinesBetweenBalls();
    };

    stage.start();
};

window.addEventListener('load', initialize, false);