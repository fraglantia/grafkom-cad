class Line extends Shape {
  // p1: vec2
  // p2: vec2
  // color: vec4
  constructor(p1, p2, color) {
    super();
    this.name = 'line';
    this.p1 = p1;
    this.p2 = p2;
    const c1 = new ControlPoint(p1, (center) => { this.p1 = center }, this);
    const c2 = new ControlPoint(p2, (center) => { this.p2 = center }, this);
    this.controlPoints = [c1, c2]
    this.color = color;
  }

  draw() {
    const colorBuf = new Array(2).fill(this.color);
    const colorBufId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, colorBufId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorBuf), gl.STATIC_DRAW );

    const vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    const points = [this.p1, this.p2];
    const bufId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    const vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.drawArrays( gl.LINES, 0, 2 );

    this.drawControlPoints();
  }

  toJSON() {
    var result = {};
    for (var x in this) {
        if (
          x === "name" ||
          x === "color" ||
          x === "p1" ||
          x === "p2"
        ) {
            result[x] = this[x];
        }
    }
    return result;
  };
}