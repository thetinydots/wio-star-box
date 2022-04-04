import { Animation } from "konva/lib/Animation";
import { Layer } from "konva/lib/Layer";
import { Path } from "konva/lib/shapes/Path";
import { Rect } from "konva/lib/shapes/Rect";
import { Stage } from "konva/lib/Stage";

const ScaleRangeNumber = (
  num: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
) => {
  return (
    ((Math.min(Math.max(num, in_min), in_max) -
      in_min) *
      (out_max - out_min)) /
      (in_max - in_min) +
    out_min
  );
};

const listenStageResize = (
  _element: HTMLElement,
  stage: Stage
) => {
  window.addEventListener("resize", () => {
    stage.width(_element.clientWidth);
    stage.height(_element.clientHeight);
  });
};

const createStarPath = (
  color: string,
  size: number,
  x: number,
  y: number
) => {
  const path = new Path({
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

const loadStars = (
  layer: Layer,
  stage: Stage,
  fillColor: string,
  starSize: number,
  windowWidth: number,
  windowHeight: number
) => {
  const stars: Array<Path[]> = [];
  const horizontalStarFitCount = Math.floor(
    (windowWidth + windowWidth) / starSize
  );
  const verticalStarFitCount = Math.floor(
    (windowHeight + windowHeight) / starSize
  );
  const visionScale: number = 8;
  // console.log(
  //   horizontalStarFitCount,
  //   verticalStarFitCount
  // );
  const rect = new Rect({
    width: windowWidth + windowWidth / 2,
    height: windowHeight + windowHeight / 2,
    fill: "transparent",
  });

  layer.add(rect);

  for (
    let i = 0;
    i < horizontalStarFitCount;
    i++
  ) {
    for (
      let j = 0;
      j < verticalStarFitCount;
      j++
    ) {
      const x = i * starSize;
      const y = j * starSize;
      const star = createStarPath(
        fillColor,
        starSize,
        x,
        y
      );
      if (!stars[i]) stars.push([]);

      stars[i].push(star);
      layer.add(star);
    }
  }

  const animation = new Animation((frame) => {
    if (!stage._pointerPositions.length) return;
    let _position =
      layer.getRelativePointerPosition();
    if (!_position) return;

    const _XIndex = _position.x / starSize;
    const _YIndex = _position.y / starSize;

    stars.forEach((_stars, xIndex) => {
      _stars.forEach((_star, yIndex) => {
        let _finalSize =
          ScaleRangeNumber(
            (_XIndex > xIndex
              ? _XIndex - xIndex
              : xIndex - _XIndex) * 4,
            -horizontalStarFitCount / 2,
            horizontalStarFitCount / 2,
            1,
            0
          ) *
          ScaleRangeNumber(
            (_YIndex > yIndex
              ? _YIndex - yIndex
              : yIndex - _YIndex) * 2,
            -verticalStarFitCount / 2,
            verticalStarFitCount / 2,
            1,
            0
          ) *
          4;

        _star.scale({
          x: Math.min(
            _finalSize,
            _star.scaleX() + 0.5
          ),
          y: Math.min(
            _finalSize,
            _star.scaleX() + 0.5
          ),
        });

        _star.opacity(
          Math.min(
            _finalSize,
            _star.scaleX() + 0.5
          )
        );
      });
    });
  }, layer);

  layer.draw();
  animation.start();
};

const createStarBox = (
  elementId: string,
  config: {
    starColor?: string;
    starSize?: number;
  }
) => {
  const { starColor = "#DDEED1", starSize = 43 } =
    config || {};
  const _element =
    document.getElementById(elementId);
  // console.log(elementId, _element);

  const stage = new Stage({
    container: elementId,
    width: _element.clientWidth,
    height: _element.clientHeight,
    listening: true,
  });
  const layer = new Layer();
  stage.add(layer);
  loadStars(
    layer,
    stage,
    starColor,
    starSize,
    window.innerWidth,
    window.innerHeight
  );
  listenStageResize(_element, stage);
};

(window as any).createStarBox = createStarBox;
