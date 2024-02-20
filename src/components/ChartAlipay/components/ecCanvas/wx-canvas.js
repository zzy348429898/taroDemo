export default class WxCanvas {
    constructor(ctx, canvasId) {
        this.ctx = ctx;
        this.canvasId = canvasId;
        this.chart = null; // this._initCanvas(zrender, ctx);

        this._initStyle(ctx);

        this._initEvent();
    }

    getContext(contextType) {
        if (contextType === "2d") {
            return this.ctx;
        }
    } 

    setChart(chart) {
        this.chart = chart;
    }

    attachEvent() {
        // noop
    }

    detachEvent() {
        // noop
    }
    addEventListener(){
        
    }
    _initCanvas(zrender, ctx) {
        zrender.util.getContext = function() {
            return ctx;
        };

        zrender.util.$override("measureText", function(text, font) {
            ctx.font = font || "12px sans-serif";
            return ctx.measureText(text);
        });
    }

    _initStyle(ctx) {
        var styles = [
            "fillStyle",
            "strokeStyle",
            "globalAlpha",
            "textAlign",
            "textBaseAlign",
            "shadow",
            "lineWidth",
            "lineCap",
            "lineJoin",
            "lineDash",
            "miterLimit",
            "fontSize"
        ];
        styles.forEach(style => {
            Object.defineProperty(ctx, style, {
                set: value => {
                    if (
                        (style !== "fillStyle" && style !== "strokeStyle") ||
                        (value !== "none" && value !== null)
                    ) {
                        ctx[
                            "set" +
                                style.charAt(0).toUpperCase() +
                                style.slice(1)
                        ](value);
                    }
                }
            });
        });

        ctx.createRadialGradient = (...p) => {
            return ctx.createCircularGradient(...p);
        };
    }

    _initEvent() {
        this.event = {};
        const eventNames = [
            {
                wxName: "touchStart",
                ecName: "mousedown"
            },
            {
                wxName: "touchMove",
                ecName: "mousemove"
            },
            {
                wxName: "touchEnd",
                ecName: "mouseup"
            },
            {
                wxName: "touchEnd",
                ecName: "click"
            }
        ];
        eventNames.forEach(name => {
          console.log(name)
          console.log(this.event)
            this.event[name.wxName] = e => {
                const touch = e.touches[0];
                this.chart.getZr().handler.dispatch(name.ecName, {
                    zrX: name.wxName === "tap" ? touch.clientX : touch.x,
                    zrY: name.wxName === "tap" ? touch.clientY : touch.y
                });
            };
        });
    }
}