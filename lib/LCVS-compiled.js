/**
 * Created at 15/11/17.
 * @Author Ling.
 * @Email i@zeroling.com
 * namespace CVS
 * canvas 封装
 * ES6
 */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var isTouchDevice = navigator.plugins.length === 0;

var Class = function Class() {
    _classCallCheck(this, Class);
}

/**
 * 可视图形类
 */
;

var DisplayClass = (function (_Class) {
    _inherits(DisplayClass, _Class);

    function DisplayClass(option) {
        _classCallCheck(this, DisplayClass);

        _get(Object.getPrototypeOf(DisplayClass.prototype), 'constructor', this).call(this);
        option = option || {};
        this.x = option.x || 0;
        this.y = option.y || 0;
        this.width = option.width || 0;
        this.height = option.height || 0;
        this.state = option.stage || null;
        this.draw = option.draw || function () {};
    }

    /**
     * 交互对象
     */
    return DisplayClass;
})(Class);

var InteractiveClass = (function (_DisplayClass) {
    _inherits(InteractiveClass, _DisplayClass);

    function InteractiveClass(option) {
        _classCallCheck(this, InteractiveClass);

        _get(Object.getPrototypeOf(InteractiveClass.prototype), 'constructor', this).call(this, option);
        this.eventListener = {};
    }

    /**
     * Sprite 容器
     */

    _createClass(InteractiveClass, [{
        key: 'addEventListener',
        value: function addEventListener(type, func) {
            if (!this.eventListener[type]) {
                this.eventListener[type] = [];
            }
            this.eventListener[type].push(func);
        }
    }, {
        key: 'removeEventListener',
        value: function removeEventListener(type, func) {
            if (!this.eventListener[type]) {
                return;
            }
            //删除监听器
            this.eventListener[type].filter(function (_func) {
                return _func === func;
            });
            if (this.eventListener[type].length === 0) {
                delete this.eventListener[type];
            }
        }
    }, {
        key: 'removeAllEventListener',
        value: function removeAllEventListener(type) {
            if (!this.eventListener[type]) {
                return;
            }
            delete this.eventListener[type];
        }
    }, {
        key: 'hasEventListener',
        value: function hasEventListener(type) {
            return !!(this.eventListener[type] && this.eventListener[type].length);
        }
    }]);

    return InteractiveClass;
})(DisplayClass);

var ObjectContainerClass = (function (_InteractiveClass) {
    _inherits(ObjectContainerClass, _InteractiveClass);

    function ObjectContainerClass(ctx, option) {
        _classCallCheck(this, ObjectContainerClass);

        _get(Object.getPrototypeOf(ObjectContainerClass.prototype), 'constructor', this).call(this, option);
        this.ctx = ctx;
        this.children = [];
        this.maxWidth = this.maxHeight = 0;
        this.hoverChildren = [];
    }

    /**
     * 一个canvas对应一个stage实例
     */

    _createClass(ObjectContainerClass, [{
        key: 'getContext',
        value: function getContext() {
            return this.ctx;
        }
    }, {
        key: '_addChild',
        value: function _addChild(child) {
            if (this.maxWidth < child.x + child.width) {
                this.maxWidth = child.x + child.width;
            }
            if (this.maxHeight < child.y + child.height) {
                this.maxHeight = child.y + child.height;
            }
            child.state = this;
            return child;
        }
    }, {
        key: 'addChild',
        value: function addChild(child) {
            child = this._addChild(child);
            this.children.push(child);
        }
    }, {
        key: 'addChildAt',
        value: function addChildAt(child, index) {
            child = this._addChild(child);
            this.children.splice(index, 0, child);
        }
    }, {
        key: '_fixMaxHW',
        value: function _fixMaxHW(child) {
            //fix最大宽高
            if (this.maxWidth == child.x + child.width) {
                this.maxWidth = 0;
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var _child = _step.value;

                        if (this.maxWidth < _child.x + _child.width) {
                            this.maxWidth = _child.x + _child.width;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator['return']) {
                            _iterator['return']();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
            if (this.maxHeight = child.y + child.height) {
                this.maxHeight = 0;
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _child = _step2.value;

                        if (this.maxHeight < _child.y + _child.height) {
                            this.maxHeight = _child.y + _child.hei;
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                            _iterator2['return']();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }
        }
    }, {
        key: 'removeChild',
        value: function removeChild(child) {
            this.children.splice(this.getChildIndex(child), 1);
            // 如果是支撑最大宽高的child被移除了，重新处理最大宽高
            this._fixMaxHW(child);
        }
    }, {
        key: 'removeChildAt',
        value: function removeChildAt(index) {
            this.children[index].stage = null;
            var child = this.children.splice(index, 1);
            this._fixMaxHW(child); // 如果是支撑最大宽高的child被移除了，重新处理最大宽高
        }
    }, {
        key: 'getChildAt',
        value: function getChildAt(index) {
            return this.children[index];
        }
    }, {
        key: 'getChildIndex',
        value: function getChildIndex(child) {
            var i = 0;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _child = _step3.value;

                    if (_child === child) {
                        return i;
                    }
                    i++;
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3['return']) {
                        _iterator3['return']();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return -1;
        }
    }, {
        key: 'contains',
        value: function contains(child) {
            return this.getChildIndex(child) !== -1;
        }

        //鼠标事件
    }, {
        key: 'dispatchMouseEvent',
        value: function dispatchMouseEvent(type, x, y) {
            var mouseX = x,
                mouseY = y;
            var _hoverChildren = [];
            //检测是不是在内部
            function isMouseover(child) {
                var ret = false;
                //checkType rect|circle|poly
                child.checkType = child.checkType || 'rect';
                switch (child.checkType) {
                    case 'rect':
                        ret = mouseX > child.x && mouseX < child.x + child.width && mouseY > child.y && mouseY < child.y + child.width;
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

            for (var _i = this.children.length; _i >= 0; _i--) {
                var child = this.children[_i];
                if (!child) continue;
                child.dispatchMouseEvent && child.dispatchMouseEvent(type, mouseX - child.x, mouseY - child.y);

                if (isMouseover(child)) {
                    //鼠标悬浮于子对象上面
                    if (type === 'mousemove' && !_hoverChildren.length) {
                        _hoverChildren.push(child);
                    }
                    if (!child.eventListener[type]) {
                        // 没有事件监听器
                        continue;
                    }
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = child.eventListener[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var _func = _step4.value;
                            // 有事件监听则遍历执行
                            _func.call(child, mouseX - child.x, mouseY - child.y);
                        }
                        // 按照绘制的倒序，只要找到第一个（最前的，亦是最后绘制的） 就 break;
                        // 阻止事件冒泡
                    } catch (err) {
                        _didIteratorError4 = true;
                        _iteratorError4 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion4 && _iterator4['return']) {
                                _iterator4['return']();
                            }
                        } finally {
                            if (_didIteratorError4) {
                                throw _iteratorError4;
                            }
                        }
                    }

                    break;
                }
            }

            if (type !== 'mousemove') {
                return; // 不是mousemove事件则到此结束
            }
            // 以下是处理mousemove事件
            for (var k = 0, len = this.hoverChildren.length; k < len; k++) {
                // 原来hoverChildren中有的，现在没有的，转而执行 mouseout
                var has = false,
                    _obj = this.hoverChildren[k];
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = _hoverChildren[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var _hoverChild = _step5.value;

                        if (_obj === _hoverChild) {
                            has = true;
                        }
                    }
                } catch (err) {
                    _didIteratorError5 = true;
                    _iteratorError5 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion5 && _iterator5['return']) {
                            _iterator5['return']();
                        }
                    } finally {
                        if (_didIteratorError5) {
                            throw _iteratorError5;
                        }
                    }
                }

                if (!has) {
                    //不存在了，处理 this.hoverChildren[k] 的mouseout
                    // 刚好又有事件在监听mouseout，则执行
                    if (this.hoverChildren[k].eventListener['mouseout']) {
                        var _iteratorNormalCompletion6 = true;
                        var _didIteratorError6 = false;
                        var _iteratorError6 = undefined;

                        try {
                            for (var _iterator6 = _obj.eventListener['mouseout'][Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                                var _mouseoutFunc = _step6.value;

                                _mouseoutFunc.call(_obj, mouseX - _obj.x, mouseY - _obj.y);
                            }
                        } catch (err) {
                            _didIteratorError6 = true;
                            _iteratorError6 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion6 && _iterator6['return']) {
                                    _iterator6['return']();
                                }
                            } finally {
                                if (_didIteratorError6) {
                                    throw _iteratorError6;
                                }
                            }
                        }
                    }
                    // 处理完后就销毁
                    delete this.hoverChildren[k];
                    break;
                }
            }
            // 原来hoverChildren中没有的，现在有了，证明mouseover
            for (var k = 0, len = _hoverChildren.length; k < len; k++) {
                var has = false,
                    _obj = _hoverChildren[k];
                var _iteratorNormalCompletion7 = true;
                var _didIteratorError7 = false;
                var _iteratorError7 = undefined;

                try {
                    for (var _iterator7 = this.hoverChildren[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                        var _hoverChild = _step7.value;

                        if (_obj == _hoverChild) {
                            has = true;
                        }
                    }
                } catch (err) {
                    _didIteratorError7 = true;
                    _iteratorError7 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion7 && _iterator7['return']) {
                            _iterator7['return']();
                        }
                    } finally {
                        if (_didIteratorError7) {
                            throw _iteratorError7;
                        }
                    }
                }

                if (!has && this.hoverChildren.length < 1) {
                    /*保证hover的只有一个*/
                    //证明鼠标刚进入，处理mouseenter或mouseover
                    this.hoverChildren.push(_obj);
                    if (_obj.eventListener['mouseover']) {
                        var _iteratorNormalCompletion8 = true;
                        var _didIteratorError8 = false;
                        var _iteratorError8 = undefined;

                        try {
                            for (var _iterator8 = _obj.eventListener['mouseover'][Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                                var _mouseoverFunc = _step8.value;

                                _mouseoverFunc.call(_obj, mouseX - _obj.x, mouseY - _obj.y);
                            }
                        } catch (err) {
                            _didIteratorError8 = true;
                            _iteratorError8 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion8 && _iterator8['return']) {
                                    _iterator8['return']();
                                }
                            } finally {
                                if (_didIteratorError8) {
                                    throw _iteratorError8;
                                }
                            }
                        }
                    }
                    break;
                }
            }
            this.clearHoverChildren();
        }
    }, {
        key: 'clearHoverChildren',
        value: function clearHoverChildren() {
            var tempArr = [];
            var _iteratorNormalCompletion9 = true;
            var _didIteratorError9 = false;
            var _iteratorError9 = undefined;

            try {
                for (var _iterator9 = this.hoverChildren[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                    var _hoverChild = _step9.value;
                    //清理掉null, undefined
                    if (_hoverChild) {
                        tempArr.push(_hoverChild);
                    }
                }
            } catch (err) {
                _didIteratorError9 = true;
                _iteratorError9 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion9 && _iterator9['return']) {
                        _iterator9['return']();
                    }
                } finally {
                    if (_didIteratorError9) {
                        throw _iteratorError9;
                    }
                }
            }

            this.hoverChildren = tempArr;
        }
    }]);

    return ObjectContainerClass;
})(InteractiveClass);

var Stage = (function (_ObjectContainerClass) {
    _inherits(Stage, _ObjectContainerClass);

    function Stage(canvas, option) {
        _classCallCheck(this, Stage);

        if (!canvas) {
            throw new TypeError('HTMLCanvasElement undefined');
        }
        _get(Object.getPrototypeOf(Stage.prototype), 'constructor', this).call(this, canvas.getContext('2d'), option);
        this.canvas = canvas;
        this.isStart = false;
        this.interval = 16;
        this.timer = null;
        this.stage = null;
        this.CONFIG = {
            interval: 16,
            isClear: true
        };
        this.width = canvas.width;
        this.height = canvas.height;

        var win = window,
            html = document.documentElement || { scrollLeft: 0, scrollTop: 0 };
        var context = this;

        function getWindowScroll() {
            return {
                x: win.pageXOffset || html.scrollLeft,
                y: win.pageYOffset || html.scrollTop
            };
        }

        function getOffset(el) {
            el = el || context.canvas;
            var width = el.offsetWidth,
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
        var batchAddMouseEventListener = function batchAddMouseEventListener(el, evArr) {
            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
                var _loop = function () {
                    var _ev = _step10.value;
                    //console.log(evArr[i])
                    el.addEventListener(_ev, (function (ctx) {
                        var x = undefined,
                            y = undefined;
                        return function (e) {
                            var offset = getOffset(),
                                winScroll = getWindowScroll();

                            if (isTouchDevice) {
                                e.preventDefault();
                                var touch = _ev === 'touchend' ? e.changedTouches[0] : e.touches[0];
                                x = touch.pageX - offset.left + winScroll.x;
                                y = touch.pageY - offset.top + winScroll.y;
                            } else {
                                x = e.clientX - offset.left + winScroll.x;
                                y = e.clientY - offset.top + winScroll.y;
                            }

                            if (ctx.eventListener[_ev]) {
                                var _iteratorNormalCompletion11 = true;
                                var _didIteratorError11 = false;
                                var _iteratorError11 = undefined;

                                try {
                                    for (var _iterator11 = ctx.eventListener[_ev][Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                                        var _listenFunc = _step11.value;

                                        _listenFunc.call(ctx, x, y);
                                    }
                                } catch (err) {
                                    _didIteratorError11 = true;
                                    _iteratorError11 = err;
                                } finally {
                                    try {
                                        if (!_iteratorNormalCompletion11 && _iterator11['return']) {
                                            _iterator11['return']();
                                        }
                                    } finally {
                                        if (_didIteratorError11) {
                                            throw _iteratorError11;
                                        }
                                    }
                                }
                            }
                            ctx.dispatchMouseEvent(_ev, x, y);
                        };
                    })(context), false);
                };

                for (var _iterator10 = evArr[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                    _loop();
                }
            } catch (err) {
                _didIteratorError10 = true;
                _iteratorError10 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion10 && _iterator10['return']) {
                        _iterator10['return']();
                    }
                } finally {
                    if (_didIteratorError10) {
                        throw _iteratorError10;
                    }
                }
            }
        };
        var batchAddKeyEventListener = function batchAddKeyEventListener(el, evArr) {
            var _iteratorNormalCompletion12 = true;
            var _didIteratorError12 = false;
            var _iteratorError12 = undefined;

            try {
                var _loop2 = function () {
                    var _ev = _step12.value;

                    el.addEventListener(_ev, (function (ctx) {
                        return function (e) {
                            if (ctx.eventListener[_ev]) {
                                var _iteratorNormalCompletion13 = true;
                                var _didIteratorError13 = false;
                                var _iteratorError13 = undefined;

                                try {
                                    for (var _iterator13 = ctx.eventListener[_ev][Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                                        var _listenFunc = _step13.value;

                                        _listenFunc.call(ctx, e);
                                    }
                                } catch (err) {
                                    _didIteratorError13 = true;
                                    _iteratorError13 = err;
                                } finally {
                                    try {
                                        if (!_iteratorNormalCompletion13 && _iterator13['return']) {
                                            _iterator13['return']();
                                        }
                                    } finally {
                                        if (_didIteratorError13) {
                                            throw _iteratorError13;
                                        }
                                    }
                                }
                            }
                        };
                    })(context), false);
                };

                for (var _iterator12 = evArr[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                    _loop2();
                }
            } catch (err) {
                _didIteratorError12 = true;
                _iteratorError12 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion12 && _iterator12['return']) {
                        _iterator12['return']();
                    }
                } finally {
                    if (_didIteratorError12) {
                        throw _iteratorError12;
                    }
                }
            }
        };
        batchAddMouseEventListener(this.canvas, ['mousemove', 'mouseup', 'mousedown', 'click', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'touchstart', 'touchmove', 'touchend']);
        batchAddKeyEventListener(this.canvas, ['keyup', 'keydown', 'keypress']);
    }

    _createClass(Stage, [{
        key: 'onRefresh',
        value: function onRefresh() {}
    }, {
        key: 'render',
        value: function render(rd) {
            // 重绘
            this.CONFIG.isClear && this.clear();
            // 画舞台
            //console.log(this.children)
            this.draw(rd);
            // 画舞台元素
            var _iteratorNormalCompletion14 = true;
            var _didIteratorError14 = false;
            var _iteratorError14 = undefined;

            try {
                for (var _iterator14 = this.children[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                    var child = _step14.value;

                    if (!child) continue;
                    // 坐标系移到对应位置
                    this.ctx.translate(child.x, child.y);
                    child.render(rd);
                    this.ctx.translate(-child.x, -child.y);
                }
            } catch (err) {
                _didIteratorError14 = true;
                _iteratorError14 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion14 && _iterator14['return']) {
                        _iterator14['return']();
                    }
                } finally {
                    if (_didIteratorError14) {
                        throw _iteratorError14;
                    }
                }
            }
        }
    }, {
        key: 'clear',
        value: function clear(x, y, w, h) {
            x = x || 0;
            y = y || 0;
            w = w || this.width;
            h = h || this.height;
            this.ctx.clearRect(x, y, w, h);
        }

        // 舞台表演开始
    }, {
        key: 'start',
        value: function start() {
            this.isStart = true;
            this.timer = setInterval((function (ctx) {
                return function () {
                    ctx.render();
                    ctx.onRefresh();
                };
            })(this), this.CONFIG.interval);
        }
    }, {
        key: 'stop',
        value: function stop() {
            this.isStart = false;
            clearInterval(this.timer);
            this.timer = null;
        }
    }]);

    return Stage;
})(ObjectContainerClass);

var Sprite = (function (_ObjectContainerClass2) {
    _inherits(Sprite, _ObjectContainerClass2);

    function Sprite(ctx, option) {
        _classCallCheck(this, Sprite);

        _get(Object.getPrototypeOf(Sprite.prototype), 'constructor', this).call(this, ctx, option);
        this.isDragging = false;
        this.dragPos = {};
        this.drapFunc = null;
        this.dropFunc = null;
    }

    /**
     * Vector2 {Class}
     * 二维矢量类
     */

    _createClass(Sprite, [{
        key: 'render',
        value: function render(rd) {
            this.draw(rd);
            // 强制缩放，保证子对象不会比自己大
            this.ctx.scale(this.width < this.maxWidth ? this.width / this.maxWidth : 1, this.height < this.maxHeight ? this.height / this.maxHeight : 1);
            // 绘制子对象
            var _iteratorNormalCompletion15 = true;
            var _didIteratorError15 = false;
            var _iteratorError15 = undefined;

            try {
                for (var _iterator15 = this.children[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
                    var child = _step15.value;

                    this.ctx.translate(child.x, child.y);
                    child.render(rd);
                    child.translate(-child.x, child.y);
                }
            } catch (err) {
                _didIteratorError15 = true;
                _iteratorError15 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion15 && _iterator15['return']) {
                        _iterator15['return']();
                    }
                } finally {
                    if (_didIteratorError15) {
                        throw _iteratorError15;
                    }
                }
            }

            this.ctx.scale(this.width < this.maxWidth ? this.maxWidth / this.width : 1, this.height < this.maxHeight ? this.maxHeight / this.height : 1);
        }
    }, {
        key: 'onDrag',
        value: function onDrag(x, y) {
            var context = this;
            this.isDragging = true;
            this.dragPos.x = x + this.x;
            this.dragPos.y = y + this.y;
            this.dragFunc = function (_x, _y) {
                context.x += _x - context.dragPos.x;
                context.y += _y - context.dragPos.y;
                context.dragPos.x = _x;
                context.dragPos.y = _y;
            };
            this.dropFunc = function (_x, _y) {
                context.onDrop();
            };
            this.stage.addEventListener('mousemove', this.dragFunc);
            this.stage.addEventListener('mouseout', this.dropFunc);
        }
    }, {
        key: 'onDrop',
        value: function onDrop() {
            this.isDragging = false;
            this.dragPos = {};
            this.stage.removeEventListener('mousemove', this.dragFunc);
            this.stage.removeEventListener('mouseout', this.dropFunc);
            delete this.dragFunc;
            delete this.dropFunc;
        }
    }]);

    return Sprite;
})(ObjectContainerClass);

var Vector2 = (function (_Class2) {
    _inherits(Vector2, _Class2);

    function Vector2(x, y) {
        _classCallCheck(this, Vector2);

        _get(Object.getPrototypeOf(Vector2.prototype), 'constructor', this).call(this);
        this.x = x;
        this.y = y;
    }

    _createClass(Vector2, [{
        key: 'copy',
        value: function copy() {
            return new Vector2(this.x, this.y);
        }
    }, {
        key: 'length',
        value: function length() {
            return Math.sqrt(this.sqrLength());
        }
    }, {
        key: 'sqrLength',
        value: function sqrLength() {
            return this.x * this.x + this.y * this.y;
        }

        /**
         * 标准化，单位长度为1
         */
    }, {
        key: 'normalize',
        value: function normalize() {
            var inv = 1 / this.length();
            return new Vector2(this.x * inv, this.y * inv);
        }

        // 反向
    }, {
        key: 'negate',
        value: function negate() {
            return new Vector2(-this.x, -this.y);
        }
    }, {
        key: 'add',
        value: function add(v) {
            return new Vector2(this.x + v.x, this.y + v.y);
        }
    }, {
        key: 'subtract',
        value: function subtract(v) {
            return new Vector2(this.x - v.x, this.y - v.y);
        }
    }, {
        key: 'multiply',
        value: function multiply(n) {
            return new Vector2(this.x * n, this.y * n);
        }
    }, {
        key: 'divide',
        value: function divide(n) {
            return new Vector2(this.x / n, this.y / n);
        }

        //矢量积
    }, {
        key: 'dot',
        value: function dot(v) {
            return new Vector2(this.x * v.x, this.y * v.y);
        }
    }]);

    return Vector2;
})(Class);

Vector2.zero = new Vector2(0, 0);

/**
 * 颜色类
 */

var Color = (function (_Class3) {
    _inherits(Color, _Class3);

    function Color(r, g, b) {
        _classCallCheck(this, Color);

        _get(Object.getPrototypeOf(Color.prototype), 'constructor', this).call(this);
        this.r = r;
        this.g = g;
        this.b = b;
    }

    // static Color

    _createClass(Color, [{
        key: 'copy',
        value: function copy() {
            return new Color(this.r, this.g, this.b);
        }
    }, {
        key: 'add',
        value: function add(c) {
            return new Color(Math.min(this.r + c.r, 1), Math.min(this.g + c.g, 1), Math.min(this.b + c.b, 1));
        }
    }, {
        key: 'subtract',
        value: function subtract(c) {
            return new Color(Math.max(this.r - c.r, 0), Math.max(this.g - c.g, 0), Math.max(this.b - c.b, 0));
        }
    }, {
        key: 'multiply',
        value: function multiply(n) {
            return new Color(Math.min(this.r * n, 1), Math.min(this.g * n, 1), Math.min(this.b * n, 1));
        }
    }, {
        key: 'divide',
        value: function divide(n) {
            return new Color(this.r / n, this.g / n, this.b / n);
        }

        /**
         * 混合调配
         */
    }, {
        key: 'modulate',
        value: function modulate(c) {
            return new Color(this.r * c.r, this.g * c.g, this.b * c.b);
        }
    }, {
        key: 'saturate',
        value: function saturate() {
            this.r = Math.min(this.r, 1);
            this.g = Math.min(this.g, 1);
            this.b = Math.min(this.b, 1);
        }
    }]);

    return Color;
})(Class);

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

var Particle = (function (_Class4) {
    _inherits(Particle, _Class4);

    function Particle(option) {
        _classCallCheck(this, Particle);

        _get(Object.getPrototypeOf(Particle.prototype), 'constructor', this).call(this);
        this.position = option.position;
        this.velocity = option.velocity;
        this.acceleration = Vector2.zero;
        this.age = 0;
        this.life = option.life;
        this.color = option.color;
        this.size = option.size;
    }

    /**
     * ParticleSystem {Class}
     * 粒子系统，相当于粒子的一个collection
     * @require Particle
     */
    return Particle;
})(Class);

var ParticleSystem = (function (_Class5) {
    _inherits(ParticleSystem, _Class5);

    function ParticleSystem() {
        _classCallCheck(this, ParticleSystem);

        _get(Object.getPrototypeOf(ParticleSystem.prototype), 'constructor', this).call(this);
        this.$private = {
            particles: []
        };
        this.gravity = new Vector2(0, 100);
        this.effectors = [];
    }

    // push 粒子到发射备用区

    _createClass(ParticleSystem, [{
        key: 'emit',
        value: function emit(particle) {
            this.$private.particles.push(particle);
        }

        // 模拟运动(在当前时间微分下)
    }, {
        key: 'simulate',
        value: function simulate(dt) {
            var _iteratorNormalCompletion16 = true;
            var _didIteratorError16 = false;
            var _iteratorError16 = undefined;

            try {
                for (var _iterator16 = this.$private.particles[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
                    var p = _step16.value;

                    p.age += dt;
                    if (p.age > p.life) {
                        this.kill(i);
                    } else {
                        i++;
                    }
                }
            } catch (err) {
                _didIteratorError16 = true;
                _iteratorError16 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion16 && _iterator16['return']) {
                        _iterator16['return']();
                    }
                } finally {
                    if (_didIteratorError16) {
                        throw _iteratorError16;
                    }
                }
            }
        }
    }, {
        key: 'kill',
        value: function kill(index) {
            if (index < this.$private.particles.length) {
                this.$private.particles.splice(index, 1);
            }
        }
    }, {
        key: 'applyGravity',
        value: function applyGravity() {
            var _iteratorNormalCompletion17 = true;
            var _didIteratorError17 = false;
            var _iteratorError17 = undefined;

            try {
                for (var _iterator17 = this.$private.particles[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
                    var p = _step17.value;

                    p.acceleration = this.gravity;
                }
            } catch (err) {
                _didIteratorError17 = true;
                _iteratorError17 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion17 && _iterator17['return']) {
                        _iterator17['return']();
                    }
                } finally {
                    if (_didIteratorError17) {
                        throw _iteratorError17;
                    }
                }
            }
        }
    }, {
        key: 'applyEffectors',
        value: function applyEffectors() {
            var _iteratorNormalCompletion18 = true;
            var _didIteratorError18 = false;
            var _iteratorError18 = undefined;

            try {
                for (var _iterator18 = this.effectors[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
                    var effect = _step18.value;

                    var apply = effect.apply;
                    var _iteratorNormalCompletion19 = true;
                    var _didIteratorError19 = false;
                    var _iteratorError19 = undefined;

                    try {
                        for (var _iterator19 = this.$private.particles[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
                            var p = _step19.value;

                            apply.call(this, p);
                        }
                    } catch (err) {
                        _didIteratorError19 = true;
                        _iteratorError19 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion19 && _iterator19['return']) {
                                _iterator19['return']();
                            }
                        } finally {
                            if (_didIteratorError19) {
                                throw _iteratorError19;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError18 = true;
                _iteratorError18 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion18 && _iterator18['return']) {
                        _iterator18['return']();
                    }
                } finally {
                    if (_didIteratorError18) {
                        throw _iteratorError18;
                    }
                }
            }
        }

        // 运动学变换，矢量叠加
    }, {
        key: 'kinematics',
        value: function kinematics(dt) {
            var _iteratorNormalCompletion20 = true;
            var _didIteratorError20 = false;
            var _iteratorError20 = undefined;

            try {
                for (var _iterator20 = this.$private.particles[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
                    var p = _step20.value;

                    p.position = p.position.add(p.velocity.multiply(dt));
                    p.velocity = p.velocity.add(p.acceleration.multiply(dt));
                }
            } catch (err) {
                _didIteratorError20 = true;
                _iteratorError20 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion20 && _iterator20['return']) {
                        _iterator20['return']();
                    }
                } finally {
                    if (_didIteratorError20) {
                        throw _iteratorError20;
                    }
                }
            }
        }

        /**
         * 默认粒子的寿命由透明度表示
         */
    }, {
        key: 'render',
        value: function render(ctx) {
            var _iteratorNormalCompletion21 = true;
            var _didIteratorError21 = false;
            var _iteratorError21 = undefined;

            try {
                for (var _iterator21 = this.$private.particles[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
                    var p = _step21.value;

                    var alpha = 1 - p.age / p.life;
                    ctx.fillStyle = 'rgba(' + Math.floor(p.color.r * 255) + ', ' + Math.floor(p.color.g * 255) + ', ' + Math.floor(p.color.b) + ', ' + alpha.toFixed(2) + ')';
                    ctx.beginPath();
                    ctx.arc(p.position.x, p.position.y, p.size, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.fill();
                }
            } catch (err) {
                _didIteratorError21 = true;
                _iteratorError21 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion21 && _iterator21['return']) {
                        _iterator21['return']();
                    }
                } finally {
                    if (_didIteratorError21) {
                        throw _iteratorError21;
                    }
                }
            }
        }
    }]);

    return ParticleSystem;
})(Class);

var ParticleBlock = (function (_Class6) {
    _inherits(ParticleBlock, _Class6);

    function ParticleBlock(x1, y1, x2, y2) {
        _classCallCheck(this, ParticleBlock);

        _get(Object.getPrototypeOf(ParticleBlock.prototype), 'constructor', this).call(this);
        this.apply = function (particle) {
            if (particle.position.x - particle.size < x1 || particle.position.x + particle.size > x2) {
                particle.velocity.x *= -1;
            }
            if (particle.position.y - particle.size < y1 || particle.position.y + particle.size > y2) {
                particle.velocity.y *= -1;
            }
        };
    }

    return ParticleBlock;
})(Class);

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
var CVS = {};
CVS.$class = Class;
CVS.$stage = Stage;
CVS.$sprite = Sprite;
CVS.$vector2 = Vector2;
CVS.$color = Color;
CVS.$particle = Particle;
CVS.$particleSystem = ParticleSystem;
CVS.$particleBlock = ParticleBlock;

// merge methods to CVS
extend(CVS, {
    createSprite: function createSprite(ctx, options) {
        return new Sprite(ctx, options);
    },
    createPoint3D: function createPoint3D(ctx, options) {
        var _vpx = 0,
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
            draw: function draw() {},
            // 设定旋转中心
            setVanishPoint: function setVanishPoint(vpx, vpy) {
                _vpx = vpx;
                _vpy = vpy;
            },
            // 设定坐标中心点
            setCenterPoint: function setCenterPoint(x, y, z) {
                _cx = x;
                _cy = y;
                _cz = z;
            },
            // 绕x轴旋转
            rotateX: function rotateX(angleX) {
                var cosx = Math.cos(angleX),
                    sinx = Math.sin(angleX),
                    y1 = this.ypos * cosx - this.zpos * sinx,
                    z1 = this.zpos * cosx + this.ypos * sinx;
                this.ypos = y1;
                this.zpos = z1;
            },
            // 绕y轴旋转
            rotateY: function rotateY(angleY) {
                var cosy = Math.cos(angleY),
                    siny = Math.sin(angleY),
                    x1 = this.xpos * cosy - this.zpos * siny,
                    z1 = this.zpos * cosy + this.xpos * siny;
                this.xpos = x1;
                this.zpos = z1;
            },
            // 绕z轴旋转
            rotateZ: function rotateZ(angleZ) {
                var cosz = Math.cos(angleZ),
                    sinz = Math.sin(angleZ),
                    x1 = this.xpos * cosz - this.ypos * sinz,
                    y1 = this.ypos * cosz + this.xpos * sinz;
                this.xpos = x1;
                this.ypos = y1;
            },
            // 获取缩放scale
            getScale: function getScale() {
                return this.focalLength / (this.focalLength + this.zpos + _cz);
            },
            // 获取z轴扁平化的 x，y值
            getScreenXY: function getScreenXY() {
                var scale = this.getScale();
                return {
                    x: _vpx + (_cx + this.xpos) * scale,
                    y: _vpy + (_cy + this.ypos) * scale
                };
            }
        };

        typeof options == 'function' ? options.call(opt) : extend(opt, options || {});

        //return new Sprite(ctx, opt);
        var point3d = new Sprite(ctx, opt);
        Object.defineProperties(point3d, {
            'screenX': {
                get: function get() {
                    return this.getScreenXY().x;
                }
            },
            'screenY': {
                get: function get() {
                    return this.getScreenXY().y;
                }
            }
        });

        return point3d;
    },
    createTriangle: function createTriangle(ctx, a, b, c, color, isStroke) {
        isStroke = isStroke == undefined ? true : isStroke;
        var pointA = a,
            pointB = b,
            pointC = c,
            triangle = CVS.createSprite(ctx, function () {
            this.color = color;
            this.light = null;

            // check point in this triangle or not
            // see http://2000clicks.com/mathhelp/GeometryPointAndTriangle2.aspx
            this.isPointInside = function (x, y) {
                var fAB = function fAB(p1, p2, p3) {
                    return (y - p1.screenY) * (p2.screenX - p1.screenX) - (x - p1.screenX) * (p2.screenY - p1.screenY);
                };
                var fCA = function fCA(p1, p2, p3) {
                    return (y - p3.screenY) * (p1.screenX - p3.screenX) - (x - p3.screenX) * (p1.screenY - p3.screenY);
                };
                var fBC = function fBC(p1, p2, p3) {
                    return (y - p2.screenY) * (p3.screenX - p2.screenX) - (x - p2.screenX) * (p3.screenY - p2.screenY);
                };

                if (fAB(pointA, pointB, pointC) * fBC(pointA, pointB, pointC) > 0 && fBC(pointA, pointB, pointC) * fCA(pointA, pointB, pointC) > 0) return true;

                return false;
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

                var color = this.light ? getAdjustedColor.call(this) : this.color;

                if (typeof color == 'number') {
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
            'depth': {
                get: function get() {
                    var zpos = Math.min(pointA.z, pointB.z, pointC.z);
                    return zpos;
                }
            }
        });

        function getAdjustedColor() {
            var red = this.color >> 16,
                green = this.color >> 8 & 0xff,
                blue = this.color & 0xff,
                lightFactor = getLightFactor.call(this);

            red *= lightFactor;
            green *= lightFactor;
            blue *= lightFactor;

            return red << 16 | green << 8 | blue;
        }

        function getLightFactor() {
            var ab = {
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
                x: ab.y * bc.z - ab.z * bc.y,
                y: -(ab.x * bc.z - ab.z * bc.x),
                z: ab.x * bc.y - ab.y * bc.x
            },
                dotProd = norm.x * this.light.x + norm.y * this.light.y + norm.z * this.light.z,
                normMag = Math.sqrt(norm.x * norm.x + norm.y * norm.y + norm.z * norm.z),
                lightMag = Math.sqrt(this.light.x * this.light.x + this.light.y * this.light.y + this.light.z * this.light.z);

            return Math.acos(dotProd / (normMag * lightMag)) / Math.PI * this.light.brightness;
        }

        function isBackface() {
            //see http://www.jurjans.lv/flash/shape.html
            var cax = pointC.screenX - pointA.screenX,
                cay = pointC.screenY - pointA.screenY,
                bcx = pointB.screenX - pointC.screenX,
                bcy = pointB.screenY - pointC.screenY;
            return cax * bcy > cay * bcx;
        }

        return triangle;
    },
    createLight: function createLight(x, y, z, brightness) {
        x = x === undefined ? -100 : x;
        y = y === undefined ? -100 : y;
        z = z === undefined ? -100 : z;
        brightness = brightness === undefined ? 1 : brightness;

        return Object.defineProperties({
            x: x,
            y: y,
            z: z
        }, {
            'brightness': {
                get: function get() {
                    return brightness;
                },
                set: function set(b) {
                    brightness = Math.min(Math.max(b, 0), 1);
                }
            }
        });
    }
});

//# sourceMappingURL=LCVS-compiled.js.map