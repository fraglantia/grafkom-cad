class Shape {
  // controlPoints: ControlPoint[]
  controlPoints = [];

  constructor() {
    this.controlVisibility = true;
    if (this.constructor === Shape) {
      throw new TypeError('Abstract class "Shape" cannot be instantiated directly.'); 
    }
  }

  drawControlPoints() {
    this.controlPoints.forEach((controlPoint) => {
      controlPoint.draw();
    });
  }

  isIntersect(point) {
    this.controlPoints.forEach((controlPoint) => {
      if(controlPoint.isIntersect(point)) {
        return true;
      }
    });
    return false;
  }

  getIntersectingControlPoint(point) {
    let result = null;
    this.controlPoints.forEach((controlPoint) => {
      if(controlPoint.isIntersect(point)) {
        result = controlPoint;
      }
    });
    return result;
  }

  setControlVisibility(visibility=true) {
    this.controlPoints.forEach((controlPoint) => {
      controlPoint.setVisibility(visibility);
    })
  }

  draw() {
    if (this.constructor === Shape) {
      throw new TypeError('Abstract class "Shape" cannot be instantiated directly.'); 
    }
  }
}