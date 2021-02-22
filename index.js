var gl;
var program;

const red = vec4( 1.0, 0.0, 0.0, 1.0 );
const green = vec4( 0.0, 1.0, 0.0, 1.0 );
const blue = vec4( 0.0, 0.0, 1.0, 1.0 );

var shapes = [];

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    const line1 = new Line(vec2(-0.75, -0.85), vec2(0.75, -0.75), blue);
    const line2 = new Line(vec2(-0.75, 0.85), vec2(0.75, 0.75), green);
    const square = new Square(vec2(-0.75, -0.75), vec2(-0.5, -0.5), red);
    const polygon = new Polygon([vec2(-0.25, -0.25), vec2(-0.5, 0.5), vec2(0.0, 0.75), vec2(0.5, 0.5), vec2(0.25, -0.25)], blue);
    shapes.push(line1);
    shapes.push(line2);
    shapes.push(square);
    shapes.push(polygon);

    render(shapes);

    let dragItem = null;

    canvas.onmousedown = (ev) => {
        const center = click(ev, canvas);
        if(!dragItem) {
            dragItem = getIntersectingControlPoint(shapes, center);
        }
    };

    canvas.onmousemove = (ev) => {
        const center = click(ev, canvas);
        if(dragItem) {
            dragItem.move(center);
            render(shapes);
        }
    };

    canvas.onmouseup = (ev) => {
        dragItem = null;
    };

    canvas.onmouseenter = (ev) => {
        shapes.forEach((shape) => {
            shape.setControlVisibility(true);
        })
        render(shapes);
    };

    canvas.onmouseleave = (ev) => {
        shapes.forEach((shape) => {
            shape.setControlVisibility(false);
        })
        render(shapes);
    };
};

function click(ev, canvas) {
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect() ;
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    return vec2(x, y);
}

// shapes: Shape[]
function getIntersectingControlPoint(shapes, center) {
    let result = null;
    shapes.forEach((shape) => {
        const cPoint = shape.getIntersectingControlPoint(center)
        if (cPoint) {
            result = cPoint;
        }
    });
    return result;
}

// shapes: Shape[]
function render(shapes) {
    gl.clear( gl.COLOR_BUFFER_BIT );
    shapes.forEach((shape) => {
        shape.draw();
    });
};

function newLine(){
    const line = new Line(vec2(-0.75, -0.85), vec2(0.75, -0.75), blue);
    shapes.push(line);
    render(shapes);
}

function newPolygon(){
    const polygon = new Polygon([vec2(-0.25, -0.25), vec2(-0.5, 0.5), vec2(0.0, 0.75), vec2(0.5, 0.5), vec2(0.25, -0.25)], blue);
    shapes.push(polygon);
    render(shapes);
}

function newSquare(){
    const square = new Square(vec2(-0.75, -0.75), vec2(-0.5, -0.5), red);
    shapes.push(square);
    render(shapes);
}

function newCircle(){
    const circle = new Circle(vec2(-0.75, 0.85), 0.2, green);
    shapes.push(circle);
    render(shapes);
}

function clearShapes(){
    shapes = [];
    gl.clear( gl.COLOR_BUFFER_BIT );
}