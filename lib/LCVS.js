/**
 * Created at 15/11/17.
 * @Author Ling.
 * @Email i@zeroling.com
 * namespace CVS
 * canvas 封装
 * ES6
 */
let isTouchDevice = navigator.plugins.length === 0;

class Class {}

/**
 * 可视图形类
 */
class DisplayClass extends Class {
    constructor(option) {
        super();
        option = option || {};
        this.x = option.x || 0;
        this.y = option.y || 0;
        this.width = option.width || 0;
        this.height = option.height || 0;
        this.state = option.stage || null;
        this.draw = option.draw || function () {};
    }
}

/**
 * 交互对象
 */
class InteractiveClass extends DisplayClass {
    constructor(option) {
        super(option);
        this.eventListener = {};
    }
    addEventListener(type, func) {
        if (!this.eventListener[type]) {
            this.eventListener[type] = [];
        }
        this.eventListener[type].push(func);
    }
    removeEventListener(type, func) {
        if (!this.eventListener[type]) {
            return;
        }
        //删除监听器
        this.eventListener[type].filter(_func => _func === func);
        if (this.eventListener[type].length === 0) {
            delete this.eventListener[type];
        }
    }
    removeAllEventListener (type) {
        if (!this.eventListener[type]) {
            return;
        }
        delete this.eventListener[type];
    }
    hasEventListener (type) {
        return !!(this.eventListener[type] && this.eventListener[type].length);
    }
}

/**
 * Sprite 容器
 */
class ObjectContainerClass extends InteractiveClass {
    constructor(ctx, option) {
        super(option);
        this.ctx = ctx;
        this.children = [];
        this.maxWidth = this.maxHeight = 0;
        this.hoverChildren = [];
    }
    getContext() {
        return this.ctx;
    }
    _addChild(child) {
        if (this.maxWidth < child.x + child.width) {
            this.maxWidth = child.x + child.width;
        }
        if (this.maxHeight < child.y + child.height) {
            this.maxHeight = child.y + child.height;
        }
        child.state = this;
        return child;
    }
    addChild(child) {
        child = this._addChild(child);
        this.children.push(child);
    }
    addChildAt(child, index) {
        child = this._addChild(child);
        this.children.splice(index, 0, child);
    }
    _fixMaxHW(child) {
        //fix最大宽高
        if (this.maxWidth== child.x + child.width) {
            this.maxWidth = 0;
            for (let _child of this.children) {
                if (this.maxWidth < _child.x + _child.width) {
                    this.maxWidth = _child.x + _child.width;
                }
            }
        }
        if (this.maxHeight = child.y + child.height) {
            this.maxHeight = 0;
            for (let _child of this.children) {
                if (this.maxHeight < _child.y + _child.height) {
                    this.maxHeight = _child.y + _child.hei;
                }
            }
        }
    }
    removeChild(child) {
        this.children.splice(this.getChildIndex(child), 1);
        // 如果是支撑最大宽高的child被移除了，重新处理最大宽高
        this._fixMaxHW(child);
    }
    removeChildAt(index) {
        this.children[index].stage = null;
        let child = this.children.splice(index, 1);
        this._fixMaxHW(child);// 如果是支撑最大宽高的child被移除了，重新处理最大宽高
    }
    getChildAt(index) {
        return this.children[index];
    }
    getChildIndex(child) {
        let i = 0;
        for (let _child of this.children) {
            if (_child === child) {
                return i;
            }
            i++;
        }
        return -1;
    }
    contains(child) {
        return this.getChildIndex(child) !== -1;
    }

    //鼠标事件
    dispatchMouseEvent(type, x, y) {
        let mouseX = x,
            mouseY = y;
        let _hoverChildren = [];
        //检测是不是在内部
        function isMouseover (child) {
            let ret = false;
            //checkType rect|circle|poly
            child.checkType = child.checkType || 'rect';
            switch (child.checkType) {
                case 'rect':
                    ret = (mouseX > child.x &&
                    mouseX < child.x + child.width &&
                    mouseY > child.y &&
                    mouseY < child.y + child.width);
                    break;
                case 'circle':
                    if (typeof child.radius !== 'number') {
                        throw new TypeError("No radius or radius is not a number!");
                    }
                    ret = Math.sqrt(Math.pow(mouseX - child.x, 2) + Math.pow(mouseY - child.y, 2)) < radius;
                    break;
                case 'poly':
                    //todo being continued
                    break;
            }
            return ret;
        }

        for(let i = this.children.length; i >= 0; i--){
            let child = this.children[i];
            if (!child) continue;
            child.dispatchMouseEvent && child.dispatchMouseEvent(type, mouseX - child.x, mouseY - child.y);

            if (isMouseover(child)) {//鼠标悬浮于子对象上面
                if (type === 'mousemove' && !_hoverChildren.length) {
                    _hoverChildren.push(child);
                }
                if (!child.eventListener[type]) {// 没有事件监听器
                    continue;
                }
                for (let _func of child.eventListener[type]) {// 有事件监听则遍历执行
                    _func.call(child, mouseX - child.x, mouseY - child.y);
                }
                // 按照绘制的倒序，只要找到第一个（最前的，亦是最后绘制的） 就 break;
                // 阻止事件冒泡
                break;
            }
        }

        if (type !== 'mousemove') {
            return; // 不是mousemove事件则到此结束
        }
        // 以下是处理mousemove事件
        for (let k = 0, len = this.hoverChildren.length; k < len; k++) {
            // 原来hoverChildren中有的，现在没有的，转而执行 mouseout
            let has = false, _obj = this.hoverChildren[k];
            for (let _hoverChild of _hoverChildren) {
                if (_obj === _hoverChild) {
                    has = true;
                }
            }
            if (!has) {
                //不存在了，处理 this.hoverChildren[k] 的mouseout
                // 刚好又有事件在监听mouseout，则执行
                if (this.hoverChildren[k].eventListener['mouseout']) {
                    for (let _mouseoutFunc of _obj.eventListener['mouseout']) {
                        _mouseoutFunc.call(_obj, mouseX - _obj.x, mouseY - _obj.y);
                    }
                }
                // 处理完后就销毁
                delete this.hoverChildren[k];
                break;
            }
        }
        // 原来hoverChildren中没有的，现在有了，证明mouseover
        for (let k = 0, len = _hoverChildren.length; k < len; k++) {
            let has = false,
                _obj = _hoverChildren[k];
            for (let _hoverChild of this.hoverChildren) {
                if (_obj == _hoverChild) {
                    has = true;
                }
            }

            if (!has && this.hoverChildren.length < 1) {/*保证hover的只有一个*/
                //证明鼠标刚进入，处理mouseenter或mouseover
                this.hoverChildren.push(_obj);
                if (_obj.eventListener['mouseover']) {
                    for (let _mouseoverFunc of _obj.eventListener['mouseover']) {
                        _mouseoverFunc.call(_obj, mouseX - _obj.x, mouseY - _obj.y);
                    }
                }
                break;
            }
        }
        this.clearHoverChildren();
    }
    clearHoverChildren() {
        let tempArr = [];
        for (let _hoverChild of this.hoverChildren) {//清理掉null, undefined
            if (_hoverChild) {
                tempArr.push(_hoverChild);
            }
        }
        this.hoverChildren = tempArr;
    }
}

/**
 * 一个canvas对应一个stage实例
 */
class Stage extends ObjectContainerClass {
    constructor(canvas, option) {
        if (!canvas) {
            throw new TypeError('HTMLCanvasElement undefined');
        }
        super(canvas.getContext('2d'), option);
        this.canvas = canvas;
        this.isStart = false;
        this.interval = 1000 / 60;
        this.timer = null;
        this.stage = null;
        this.CONFIG = {
            interval: 1000 / 60,
            isClear: true
        };
        this.width = canvas.width;
        this.height = canvas.height;

        let win = window,
            html = document.documentElement || {scrollLeft: 0, scrollTop: 0};
        let context = this;

        function getWindowScroll () {
            return {
                x: win.pageXOffset || html.scrollLeft,
                y: win.pageYOffset || html.scrollTop
            };
        }

        function getOffset(el) {
            el = el || context.canvas;
            let width = el.offsetWidth,
                height = el.offsetHeight,
                top = el.offsetTop,
                left = el.offsetLeft;
            while (el = el.offsetParent) {
                top = top + el.offsetTop;
                left = left + el.offsetLeft;
            }
            return {
                top: top,
                left: left,
                width: width,
                height: height
            };
        }

        // 对canvasElement 监听
        let batchAddMouseEventListener = (el, evArr) => {
            for (let _ev of evArr) { //console.log(evArr[i])
                el.addEventListener(_ev, (ctx => {
                    let x, y;
                    return function (e) {
                        let offset = getOffset(),
                            winScroll = getWindowScroll();

                        if (isTouchDevice) {
                            e.preventDefault();
                            let touch = _ev === 'touchend' ? e.changedTouches[0] : e.touches[0];
                            x = touch.pageX - offset.left + winScroll.x;
                            y = touch.pageY - offset.top + winScroll.y;
                        } else {
                            x = e.clientX - offset.left + winScroll.x;
                            y = e.clientY - offset.top + winScroll.y;
                        }

                        if (ctx.eventListener[_ev]) {
                            for (let _listenFunc of ctx.eventListener[_ev]) {
                                _listenFunc.call(ctx, x, y);
                            }
                        }
                        ctx.dispatchMouseEvent(_ev, x, y);
                    }
                })(context), false);
            }
        };
        let batchAddKeyEventListener = function (el, evArr) {
            for (let _ev of evArr) {
                el.addEventListener(_ev, (ctx => {
                    return e => {
                        if ( ctx.eventListener[_ev] ) {
                            for (let _listenFunc of ctx.eventListener[_ev]) {
                                _listenFunc.call(ctx, e);
                            }
                        }
                    }
                })(context), false);
            }
        };
        batchAddMouseEventListener(this.canvas, ['mousemove', 'mouseup', 'mousedown', 'click', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'touchstart', 'touchmove', 'touchend']);
        batchAddKeyEventListener(this.canvas, ['keyup', 'keydown', 'keypress']);
    }
    onRefresh() {}
    render(rd) {
        // 重绘
        this.CONFIG.isClear && this.clear();
        // 画舞台
        //console.log(this.children)
        this.draw(rd);
        // 画舞台元素
        for (let child of this.children) {
            if (!child) continue;
            // 坐标系移到对应位置
            this.ctx.translate(child.x, child.y);
            child.render(rd);
            this.ctx.translate(-child.x, -child.y);
        }
    }
    clear(x, y, w, h) {
        x = x || 0;
        y = y || 0;
        w = w || this.width;
        h = h || this.height;
        this.ctx.clearRect(x, y, w, h);
    }
    // 舞台表演开始
    start() {
        this.isStart = true;
        this.timer = setInterval((ctx => {
            return () => {
                ctx.render();
                ctx.onRefresh();
            }
        })(this), this.CONFIG.interval);
    }
    stop() {
        this.isStart = false;
        clearInterval(this.timer);
        this.timer = null;
    }
}

class Sprite extends ObjectContainerClass {
    constructor(ctx, option) {
        super(ctx, option);
        this.isDragging = false;
        this.dragPos = {};
        this.drapFunc = null;
        this.dropFunc = null;
    }
    render(rd) {
        this.draw(rd);
        // 强制缩放，保证子对象不会比自己大
        this.ctx.scale(this.width < this.maxWidth ? this.width / this.maxWidth : 1,
            this.height < this.maxHeight ? this.height / this.maxHeight : 1);
        // 绘制子对象
        for (let child of this.children) {
            this.ctx.translate(child.x, child.y);
            child.render(rd);
            child.translate(-child.x, child.y);
        }
        this.ctx.scale(this.width < this.maxWidth ? this.maxWidth / this.width : 1,
            this.height < this.maxHeight ? this.maxHeight / this.height : 1);
    }
    onDrag(x, y) {
        let context = this;
        this.isDragging = true;
        this.dragPos.x = x + this.x;
        this.dragPos.y = y + this.y;
        this.dragFunc =  (_x, _y) => {
            context.x += _x - context.dragPos.x;
            context.y += _y - context.dragPos.y;
            context.dragPos.x = _x;
            context.dragPos.y = _y;
        };
        this.dropFunc = (_x, _y) => {
            context.onDrop();
        };
        this.stage.addEventListener('mousemove', this.dragFunc);
        this.stage.addEventListener('mouseout', this.dropFunc);
    }
    onDrop() {
        this.isDragging = false;
        this.dragPos = {};
        this.stage.removeEventListener('mousemove', this.dragFunc);
        this.stage.removeEventListener('mouseout', this.dropFunc);
        delete this.dragFunc;
        delete this.dropFunc;
    }
}

/**
 * Vector2 {Class}
 * 二维矢量类
 */
class Vector2 extends Class {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
    }
    copy() {
        return new Vector2(this.x, this.y);
    }
    length() {
        return Math.sqrt(this.sqrLength());
    }
    sqrLength() {
        return this.x * this.x + this.y * this.y;
    }

    /**
     * 标准化，单位长度为1
     */
    normalize() {
        let inv = 1 / this.length();
        return new Vector2(this.x * inv, this.y * inv);
    }
    // 反向
    negate() {
        return new Vector2(-this.x, -this.y);
    }
    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }
    subtract(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }
    multiply(n) {
        return new Vector2(this.x * n, this.y * n);
    }
    divide(n) {
        return new Vector2(this.x / n, this.y / n);
    }
    //矢量积
    dot(v) {
        return new Vector2(this.x * v.x, this.y * v.y);
    }
}
Vector2.zero = new Vector2(0, 0);

/**
 * 颜色类
 */
class Color extends Class {
    constructor(r, g, b) {
        super();
        this.r = r;
        this.g = g;
        this.b = b;
    }
    copy() {
        return new Color(this.r, this.g, this.b);
    }
    add(c) {
        return new Color(
            Math.min(this.r + c.r, 1),
            Math.min(this.g + c.g, 1),
            Math.min(this.b + c.b, 1)
        )
    }
    subtract(c) {
        return new Color(
            Math.max(this.r - c.r, 0),
            Math.max(this.g - c.g, 0),
            Math.max(this.b - c.b, 0)
        )
    }
    multiply(n) {
        return new Color(
            Math.min(this.r * n, 1),
            Math.min(this.g * n, 1),
            Math.min(this.b * n, 1)
        )
    }
    divide(n) {
        return new Color(
            this.r / n,
            this.g / n,
            this.b / n
        )
    }
    /**
     * 混合调配
     */
    modulate (c) {
        return new Color(this.r * c.r, this.g * c.g, this.b * c.b);
    }
    saturate () {
        this.r = Math.min(this.r, 1);
        this.g = Math.min(this.g, 1);
        this.b = Math.min(this.b, 1);
    }
}
// static Color
Color.black = new Color(0, 0, 0);
Color.white = new Color(1, 1, 1);
Color.red = new Color(1, 0, 0);
Color.green = new Color(0, 1, 0);
Color.blue = new Color(0, 0, 1);
Color.yellow = new Color(1, 1, 0);
Color.cyan = new Color(0, 1, 1);
Color.purple = new Color(1, 0, 1);

/**
 * 粒子类
 */
class Particle extends Class {
    constructor(option) {
        super();
        this.position = option.position;
        this.velocity = option.velocity;
        this.acceleration = Vector2.zero;
        this.age = 0;
        this.life = option.life;
        this.color = option.color;
        this.size = option.size;
    }
}

/**
 * ParticleSystem {Class}
 * 粒子系统，相当于粒子的一个collection
 * @require Particle
 */
class ParticleSystem extends Class {
    constructor() {
        super();
        this.$private = {
            particles: []
        };
        this.gravity = new Vector2(0, 100);
        this.effectors = [];
    }
    // push 粒子到发射备用区
    emit(particle) {
        this.$private.particles.push(particle);
    }
    // 模拟运动(在当前时间微分下)
    simulate(dt) {
        for( let p of this.$private.particles ) {
            p.age += dt;
            if (p.age > p.life) {
                this.kill(i);
            } else {
                i++;
            }
        }
    }
    kill(index) {
        if (index < this.$private.particles.length) {
            this.$private.particles.splice(index, 1);
        }
    }
    applyGravity() {
        for( let p of this.$private.particles ){
            p.acceleration = this.gravity;
        }
    }
    applyEffectors() {
        for (let effect of this.effectors) {
            let apply = effect.apply;
            for (let p of this.$private.particles) {
                apply.call(this, p);
            }
        }
    }
    // 运动学变换，矢量叠加
    kinematics(dt) {
        for (let p of this.$private.particles) {
            p.position = p.position.add(p.velocity.multiply(dt));
            p.velocity = p.velocity.add(p.acceleration.multiply(dt));
        }
    }

    /**
     * 默认粒子的寿命由透明度表示
     */
    render(ctx) {
        for (let p of this.$private.particles) {
            let alpha = 1 - (p.age / p.life);
            ctx.fillStyle = 'rgba(' + Math.floor(p.color.r * 255) + ', ' + Math.floor(p.color.g * 255) + ', ' + Math.floor(p.color.b) + ', ' + alpha.toFixed(2) + ')';
            ctx.beginPath();
            ctx.arc(p.position.x, p.position.y, p.size, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }
    }
}

class ParticleBlock extends Class {
    constructor(x1, y1, x2, y2) {
        super();
        this.apply = function (particle) {
            if (particle.position.x - particle.size < x1 || particle.position.x + particle.size > x2) {
                particle.velocity.x *= -1;
            }
            if (particle.position.y - particle.size < y1 || particle.position.y + particle.size > y2) {
                particle.velocity.y *= -1;
            }
        }
    }
}

function extend(target, source, isOverwrite) {
    if (isOverwrite === undefined) {
        isOverwrite = true;
    }
    for (var key in source) {
        if (!target.hasOwnProperty(key) || isOverwrite) {
            target[key] = source[key];
        }
    }
    return target;
}
let CVS = {};
CVS.Class = Class;
CVS.Stage = Stage;
CVS.Sprite = Sprite;
CVS.Vector2 = Vector2;
CVS.Color = Color;
CVS.Particle = Particle;
CVS.ParticleSystem = ParticleSystem;
CVS.ParticleBlock = ParticleBlock;
// merge methods to CVS
extend(CVS, {
    createSprite (ctx, options) {
        return new Sprite(ctx, options);
    },
    createPoint3D (ctx, options) {
        let _vpx = 0,
            _vpy = 0,
            _cx = 0,
            _cy = 0,
            _cz = 0,
            opt = {
                x: 0,
                y: 0,
                xpos: 0,
                ypos: 0,
                zpos: 0,
                focalLength: 250,
                width: 0,
                height: 0,
                draw () {},
                // 设定旋转中心
                setVanishPoint (vpx, vpy) {
                    [_vpx, _vpy] = [vpx, vpy];
                },
                // 设定坐标中心点
                setCenterPoint (x, y, z) {
                    [_cx, _cy, _cz] = [x, y, z];
                },
                // 绕x轴旋转
                rotateX (angleX) {
                    let cosx = Math.cos(angleX),
                        sinx = Math.sin(angleX),
                        y1 = this.ypos * cosx - this.zpos * sinx,
                        z1 = this.zpos * cosx + this.ypos * sinx;
                    [this.ypos, this.zpos] = [y1, z1];
                },
                // 绕y轴旋转
                rotateY (angleY) {
                    let cosy = Math.cos(angleY),
                        siny = Math.sin(angleY),
                        x1 = this.xpos * cosy - this.zpos * siny,
                        z1 = this.zpos * cosy + this.xpos * siny;
                    [this.xpos, this.zpos] = [x1, z1];
                },
                // 绕z轴旋转
                rotateZ (angleZ) {
                    let cosz = Math.cos(angleZ),
                        sinz = Math.sin(angleZ),
                        x1 = this.xpos * cosz - this.ypos * sinz,
                        y1 = this.ypos * cosz + this.xpos * sinz;
                    [this.xpos, this.ypos] = [x1, y1];
                },
                // 获取缩放scale
                getScale () {
                    return (this.focalLength / (this.focalLength + this.zpos + _cz));
                },
                // 获取z轴扁平化的 x，y值
                getScreenXY () {
                    let scale = this.getScale();
                    return {
                        x: _vpx + (_cx + this.xpos) * scale,
                        y: _vpy + (_cy + this.ypos) * scale
                    };
                }
            };

        typeof options == 'function' ? options.call(opt) : extend(opt, options || {});

        //return new Sprite(ctx, opt);
        let point3d = new Sprite(ctx, opt);
        Object.defineProperties(point3d, {
            screenX: {
                get: function () {
                    return this.getScreenXY().x
                }
            },
            screenY: {
                get: function () {
                    return this.getScreenXY().y
                }
            }
        });

        return point3d;
    },
    createTriangle (ctx, a, b, c, color, isStroke) {
        isStroke = isStroke == undefined ? true : isStroke;
        let [pointA, pointB, pointC] = [a, b, c];
        let triangle = CVS.createSprite(ctx, () => {
                [this.color, this.light] = [color, null];

                // check point in this triangle or not
                // see http://2000clicks.com/mathhelp/GeometryPointAndTriangle2.aspx
                this.isPointInside = function (x, y) {
                    let fAB = (p1, p2, p3) => (y - p1.screenY) * (p2.screenX - p1.screenX) - (x - p1.screenX) * (p2.screenY - p1.screenY);
                    let fCA = (p1, p2, p3) => (y - p3.screenY) * (p1.screenX - p3.screenX) - (x - p3.screenX) * (p1.screenY - p3.screenY);
                    let fBC = (p1, p2, p3) => (y - p2.screenY) * (p3.screenX - p2.screenX) - (x - p2.screenX) * (p3.screenY - p2.screenY);

                    return (fAB(pointA, pointB, pointC) * fBC(pointA, pointB, pointC) > 0 && fBC(pointA, pointB, pointC) * fCA(pointA, pointB, pointC) > 0);
                };

                this.draw = function (g) {
                    if (isBackface()) {
                        return;
                    }
                    g = g || this.ctx;
                    //Depth example doesn't set a light, use flat color.
                    g.beginPath();
                    g.moveTo(pointA.screenX, pointA.screenY);
                    g.lineTo(pointB.screenX, pointB.screenY);
                    g.lineTo(pointC.screenX, pointC.screenY);
                    g.lineTo(pointA.screenX, pointA.screenY);
                    g.closePath();

                    let color = (this.light ? getAdjustedColor.call(this) : this.color);

                    if ('number' === typeof color) {
                        color = 'rgb(' + (color >> 16) + ', ' + (color >> 8 & 0xff) + ', ' + (color & 0xff) + ')';
                    }

                    g.fillStyle = color;
                    g.fill();
                    if (!isStroke) {
                        g.strokeStyle = color;
                        g.stroke();
                    }
                };
            });

        Object.defineProperties(triangle, {
            depth: {
                get: function () {
                    let zpos = Math.min(pointA.z, pointB.z, pointC.z);
                    return zpos;
                }
            }
        });

        function getAdjustedColor() {
            let red = this.color >> 16,
                green = this.color >> 8 & 0xff,
                blue = this.color & 0xff,
                lightFactor = getLightFactor.call(this);

            red *= lightFactor;
            green *= lightFactor;
            blue *= lightFactor;

            return red << 16 | green << 8 | blue;
        }

        function getLightFactor() {
            let ab = {
                    x: pointA.xpos - pointB.xpos,
                    y: pointA.ypos - pointB.ypos,
                    z: pointA.zpos - pointB.zpos
                },
                bc = {
                    x: pointB.xpos - pointC.xpos,
                    y: pointB.ypos - pointC.ypos,
                    z: pointB.zpos - pointC.zpos
                },
                norm = {
                    x: (ab.y * bc.z) - (ab.z * bc.y),
                    y: -((ab.x * bc.z) - (ab.z * bc.x)),
                    z: (ab.x * bc.y) - (ab.y * bc.x)
                },
                dotProd = norm.x * this.light.x + norm.y * this.light.y + norm.z * this.light.z,
                normMag = Math.sqrt(norm.x * norm.x + norm.y * norm.y + norm.z * norm.z),
                lightMag = Math.sqrt(this.light.x * this.light.x + this.light.y * this.light.y + this.light.z * this.light.z);

            return (Math.acos(dotProd / (normMag * lightMag)) / Math.PI) * this.light.brightness;
        }

        function isBackface() {
            //see http://www.jurjans.lv/flash/shape.html
            let cax = pointC.screenX - pointA.screenX,
                cay = pointC.screenY - pointA.screenY,
                bcx = pointB.screenX - pointC.screenX,
                bcy = pointB.screenY - pointC.screenY;
            return cax * bcy > cay * bcx;
        }

        return triangle;
    },
    createLight: function (x, y, z, brightness) {
        x = x || -100;
        y = y || -100;
        z = z || -100;
        brightness = brightness || 1;

        return Object.defineProperties({
            x: x,
            y: y,
            z: z
        }, {
            brightness: {
                get: function () {
                    return brightness;
                },
                set: function (b) {
                    brightness = Math.min(Math.max(b, 0), 1);
                }
            }
        });
    }
});