function sign(x) {
  if (x > 0) {
    return 1;
  }
  return -1;
}

class Square extends Shape {
  // p1: vec2 opposite end vertex
  // p3: vec2 opposite end vertex
  // color: vec4
  constructor(p1, p3, color) {
    super();
    this.p1 = p1;
    this.p2 = vec2(p1[0], p3[1]);;
    this.p3 = p3;
    this.p4 = vec2(p3[0], p1[1]);
    this.c1 = new ControlPoint(this.p1, (center) => { this.moveP1(center) });
    this.c2 = new ControlPoint(this.p2, (center) => { this.moveP2(center) });
    this.c3 = new ControlPoint(this.p3, (center) => { this.moveP3(center) });
    this.c4 = new ControlPoint(this.p4, (center) => { this.moveP4(center) });
    this.controlPoints = [this.c1, this.c2, this.c3, this.c4]
    this.color = color;
  }

  moveSquarePoint(to, hold) {
    const diagonal = subtract(to, hold);
    const diagonalSign = vec2(sign(diagonal[0]), sign(diagonal[1]));
    const scaling = Math.max(Math.abs(diagonal[0]), Math.abs(diagonal[1]));
    return add(hold, scale(scaling, diagonalSign));
  }

  moveP1(newCenter) {
    this.p1 = this.moveSquarePoint(newCenter, this.p3);
    this.p2 = vec2(this.p1[0], this.p3[1]);
    this.p4 = vec2(this.p3[0], this.p1[1]);
    this.updateControlPoints();
  }
  
  moveP2(newCenter) {
    this.p2 = this.moveSquarePoint(newCenter, this.p4);
    this.p1 = vec2(this.p2[0], this.p4[1]);
    this.p3 = vec2(this.p4[0], this.p2[1]);
    this.updateControlPoints();
  }

  moveP3(newCenter) {
    this.p3 = this.moveSquarePoint(newCenter, this.p1);
    this.p2 = vec2(this.p1[0], this.p3[1]);
    this.p4 = vec2(this.p3[0], this.p1[1]);
    this.updateControlPoints();
  }

  moveP4(newCenter) {
    this.p4 = this.moveSquarePoint(newCenter, this.p2);
    this.p1 = vec2(this.p2[0], this.p4[1]);
    this.p3 = vec2(this.p4[0], this.p2[1]);
    this.updateControlPoints();  
  }

  updateControlPoints() {
    this.c1.move(this.p1, true);
    this.c2.move(this.p2, true);
    this.c3.move(this.p3, true);
    this.c4.move(this.p4, true);
  }

  draw() {
    const colorBuf = new Array(4).fill(this.color);
    const colorBufId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, colorBufId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorBuf), gl.STATIC_DRAW );

    const vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    const points = [this.p1, this.p2, this.p3, this.p4];
    const bufId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    const vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4);

    this.drawControlPoints();
  }
}