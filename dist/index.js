import { Animation } from "konva/lib/Animation";
import { Layer } from "konva/lib/Layer";
import { Path } from "konva/lib/shapes/Path";
import { Rect } from "konva/lib/shapes/Rect";
import { Stage } from "konva/lib/Stage";
var ScaleRangeNumber = function (num, in_min, in_max, out_min, out_max) {
    return (((Math.min(Math.max(num, in_min), in_max) -
        in_min) *
        (out_max - out_min)) /
        (in_max - in_min) +
        out_min);
};
var listenStageResize = function (_element, stage) {
    window.addEventListener("resize", function () {
        stage.width(_element.clientWidth);
        stage.height(_element.clientHeight);
    });
};
var createStarPath = function (color, size, x, y) {
    var path = new Path({
        offset: {
            x: size / 2,
            y: size / 2,
        },
        opacity: 0,
        data: "M21.1932 42.5217L16.6973 25.771L-0.000379611 21.2609L16.6973 16.7508L21.1932 -1.8528e-06L25.689 16.7508L42.3867 21.2609L25.689 25.771L21.1932 42.5217Z",
        fill: color,
        width: size,
        height: size,
        x: x,
        y: y,
        scale: {
            x: 0,
            y: 0,
        },
    });
    return path;
};
var loadStars = function (layer, stage, fillColor, starSize, windowWidth, windowHeight) {
    var stars = [];
    var horizontalStarFitCount = Math.floor((windowWidth + windowWidth) / starSize);
    var verticalStarFitCount = Math.floor((windowHeight + windowHeight) / starSize);
    var visionScale = 8;
    // console.log(
    //   horizontalStarFitCount,
    //   verticalStarFitCount
    // );
    var rect = new Rect({
        width: windowWidth + windowWidth / 2,
        height: windowHeight + windowHeight / 2,
        fill: "transparent",
    });
    layer.add(rect);
    for (var i = 0; i < horizontalStarFitCount; i++) {
        for (var j = 0; j < verticalStarFitCount; j++) {
            var x = i * starSize;
            var y = j * starSize;
            var star = createStarPath(fillColor, starSize, x, y);
            if (!stars[i])
                stars.push([]);
            stars[i].push(star);
            layer.add(star);
        }
    }
    var animation = new Animation(function (frame) {
        if (!stage._pointerPositions.length)
            return;
        var _position = layer.getRelativePointerPosition();
        if (!_position)
            return;
        var _XIndex = _position.x / starSize;
        var _YIndex = _position.y / starSize;
        stars.forEach(function (_stars, xIndex) {
            _stars.forEach(function (_star, yIndex) {
                var _finalSize = ScaleRangeNumber((_XIndex > xIndex
                    ? _XIndex - xIndex
                    : xIndex - _XIndex) * 4, -horizontalStarFitCount / 2, horizontalStarFitCount / 2, 1, 0) *
                    ScaleRangeNumber((_YIndex > yIndex
                        ? _YIndex - yIndex
                        : yIndex - _YIndex) * 2, -verticalStarFitCount / 2, verticalStarFitCount / 2, 1, 0) *
                    4;
                _star.scale({
                    x: Math.min(_finalSize, _star.scaleX() + 0.5),
                    y: Math.min(_finalSize, _star.scaleX() + 0.5),
                });
                _star.opacity(Math.min(_finalSize, _star.scaleX() + 0.5));
            });
        });
    }, layer);
    layer.draw();
    animation.start();
};
var createStarBox = function (elementId, config) {
    var _a = config || {}, _b = _a.starColor, starColor = _b === void 0 ? "#DDEED1" : _b, _c = _a.starSize, starSize = _c === void 0 ? 43 : _c;
    var _element = document.getElementById(elementId);
    // console.log(elementId, _element);
    var stage = new Stage({
        container: elementId,
        width: _element.clientWidth,
        height: _element.clientHeight,
        listening: true,
    });
    var layer = new Layer();
    stage.add(layer);
    loadStars(layer, stage, starColor, starSize, window.innerWidth, window.innerHeight);
    listenStageResize(_element, stage);
};
window.createStarBox = createStarBox;
