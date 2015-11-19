/**
 * Created at 15/11/19.
 * @Author Ling.
 * @Email i@zeroling.com
 */
"use strict";

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var fe = ["王晨宇", "黄卿怡", "赵晏", "张启超", "何雨欣", "蒋清瀚", "杨潇涵", "祝敬驰", "李敏娴", "罗方霞", "杭景帆", "於光晶", "曾玉", "王静怡", "杨新雷", "张曦镱", "李超", "刘荣博", "李立平", "王思成", "王威", "郑杰", "徐菁馨", "王鹏", "白政英", "卢薇", "李慧彤", "张兰秋月", "张欣悦", "荆磊", "刘婷婷", "介鑫博", "王明杰", "雷恒林", "刘竣豪", "文俊霖", "毛润", "陈强", "何聆宇", "陈文雅", "张彦", "图尔荪阿依", "田金箫", "钟思远", "张智勇", "秦银泽", "杨飞", "胡佩雯", "吴光敏", "文琅", "游舒婕", "叶舟"];

function range(x, y) {
    var r = Math.random();
    while (r == 0) {
        r = Math.random(); //避免0
    }
    return r * (y - x) + x;
}

var Name = (function (_Sprite) {
    _inherits(Name, _Sprite);

    function Name(stage, option) {
        _classCallCheck(this, Name);

        _get(Object.getPrototypeOf(Name.prototype), "constructor", this).call(this, stage.ctx, option);
        var self = this;
        this.name = option.name;
        this.width = this.name.length * 16;
        this.height = 16;
        this.direction = new Vector2(range(-2, 2), range(-2, 2));
        this.x = range(0, stage.width - this.name.length * 16);
        this.y = range(this.height, stage.height);
        this.draw = function () {
            self.ctx.fillStyle = 'red';
            self.ctx.fillText(option.name, 0, 0);
            self.ctx.font = "16px Arial";
            self.ctx.fill();
        };
    }

    return Name;
})(Sprite);

var $canvas = document.getElementById('canvas');
$canvas.width = window.innerWidth;
var stage = new CVS.Stage($canvas);
var objNames = fe.map(function (name) {
    var _n = new Name(stage, {
        name: name
    });
    stage.addChild(_n);
    return _n;
});
stage.onRefresh = function () {
    objNames.forEach(function (objName, i) {
        if (objName.x <= 0 || objName.x + objName.width >= stage.width) {
            objName.direction.x = -objName.direction.x;
        }

        if (objName.y - objName.height <= 0 || objName.y >= stage.height) {
            objName.direction.y = -objName.direction.y;
        }

        objName.x += objName.direction.x;
        objName.y += objName.direction.y;
    });
};

var mouseCircle = new Sprite(stage.ctx, {
    x: 0,
    y: 0,
    width: 25 * 2,
    draw: function draw() {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fill();
    }
});

function listener(x, y) {
    mouseCircle.x = x;
    mouseCircle.y = y;
    if (+new Date() - startTime > 3000) {
        for (var i = 0; i < objNames.length; i++) {
            if ((objNames[i].x - x) * (objNames[i].x - x) + (objNames[i].y - y) * (objNames[i].y - y) < 25 * 25) {
                alert(objNames[i].name);
                stage.removeEventListener('mousemove', listener);
                stage.removeEventListener('touchmove', listener);
                clearInterval(clearIntervalFlag);
                timeDom.innerHTML = -3000;
                return stage.clear();
            }
        }
    }
}
stage.addChild(mouseCircle);

var timeDom = document.getElementById('time');
timeDom.innerHTML = -3000;
var state = false;
var startTime, clearIntervalFlag;
document.getElementById('btn').addEventListener('click', function () {
    if (!stage.isStart) {
        stage.addEventListener('mousemove', listener);
        stage.addEventListener('touchmove', listener);
        startTime = +new Date();
        clearIntervalFlag = setInterval(function () {
            timeDom.innerHTML = parseInt(timeDom.innerHTML) + 100;
        }, 100);
        stage.start();
    } else {
        stage.removeEventListener('mousemove', listener);
        stage.removeEventListener('touchmove', listener);
        startTime = null;
        clearInterval(clearIntervalFlag);
        timeDom.innerHTML = -3000;
        stage.stop();
    }
});

//# sourceMappingURL=main-compiled.js.map