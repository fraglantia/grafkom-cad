class Polygon extends Shape {
  // points: vec2[]
  // color: vec4
  constructor(points, color) {
    super();
    this.name = 'polygon';
    this.points = points;
    this.controlPoints = [];
    for(let i=0; i<points.length; i++) {
      const controlPoint = new ControlPoint(points[i], (center) => { points[i] = center }, this);
      this.controlPoints.push(controlPoint);
    }
    this.color = color;
  }

  draw() {
    const colorBuf = new Array(this.points.length).fill(this.color);
    const colorBufId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, colorBufId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorBuf), gl.STATIC_DRAW );

    const vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    const bufId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.points), gl.STATIC_DRAW );

    const vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, this.points.length );

    this.drawControlPoints();
  }

  toJSON() {
    var result = {};
    for (var x in this) {
        if (
          x === "name" ||
          x === "color" ||
          x === "points"
        ) {
            result[x] = this[x];
        }
    }
    return result;
  };
}