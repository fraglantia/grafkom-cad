const RADIUS = 0.02;

class ControlPoint {
  // center: vec2
  // moveCallback: (center) => void
  constructor(center, moveCallback=(center)=>{}, parent=null) {
    this.parent = parent;
    this.center = center;
    this.fill = new Circle(center, RADIUS, vec4(1.0, 1.0, 1.0, 1.0));
    this.border = new Circle(center, RADIUS, vec4(0.0, 0.0, 0.0, 1.0), true);
    this.moveCallback = moveCallback;
    this.visibility = true;
  }

  setVisibility(visibility=true) {
    this.visibility = visibility;
  }

  move(newCenter, force=false) {
    this.center = newCenter;
    this.fill.move(newCenter);
    this.border.move(newCenter);
    if (!force) {
      this.moveCallback && this.moveCallback(newCenter);
    }
  }

  // point: vec2
  isIntersect(point) {
    if(this.visibility) {
      const d = length(subtract(this.center, point));
      return d <= RADIUS;
    }
    return false;
  }

  draw() {
    if(this.visibility) {
      this.fill.draw();
      this.border.draw();
    }
  }

  toJSON() {
    var result = {};
    for (var x in this) {
        if (x !== "parent") {
            result[x] = this[x];
        }
    }
    return result;
  };
}