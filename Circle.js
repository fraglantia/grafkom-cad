const N = 20;

class Circle {
  // center: vec2
  // r: number
  // color: vec4
  constructor(center, r, color, hollow=false) {
    this.center = center;
    this.color = color;
    this.r = r;
    this.hollow = hollow;
    this.points = this.getCirclePoints(center, r);
  }

  // newCenter: vec2
  move(newCenter) {
    this.center = newCenter;
    this.points = this.getCirclePoints(newCenter, this.r);
  }

  getCirclePoints() {
    const points = [];
    for (let i = 0; i <= N; i++){
        const angle= 2 * Math.PI * i / N;
        const xOffset = this.r * Math.cos(angle);
        const yOffset = this.r * Math.sin(angle);
        points.push(add(this.center, vec2(xOffset, yOffset)));
    }
    return points;
  }

  draw() {
    const colorBuf = new Array(N).fill(this.color);
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
    if (this.hollow) {
      gl.drawArrays( gl.LINE_LOOP, 0, N );
    } else {
      gl.drawArrays( gl.TRIANGLE_FAN, 0, N );
    }
  }
}