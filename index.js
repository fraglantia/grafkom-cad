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

    // const line1 = new Line(vec2(-0.75, -0.85), vec2(0.75, -0.75), blue);
    // const line2 = new Line(vec2(-0.75, 0.85), vec2(0.75, 0.75), green);
    // const square = new Square(vec2(-0.75, -0.75), vec2(-0.5, -0.5), red);
    // const polygon = new Polygon([vec2(-0.25, -0.25), vec2(-0.5, 0.5), vec2(0.0, 0.75), vec2(0.5, 0.5), vec2(0.25, -0.25)], blue);
    // shapes.push(line1);
    // shapes.push(line2);
    // shapes.push(square);
    // shapes.push(polygon);

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

function exportToJSON() {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(shapes)));
    element.setAttribute('download', 'shapes.json');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function importFromJSON(event) {
    var reader = new FileReader();

    reader.onload = function(event) {
        const newShapes = [];
        const result = JSON.parse(event.target.result);
        result.forEach((item) => {
            if(item.name === 'polygon') {
                newShapes.push(new Polygon(item.points, item.color));
            }
            if(item.name === 'line') {
                newShapes.push(new Line(item.p1, item.p2, item.color));
            }
            if(item.name === 'square') {
                newShapes.push(new Square(item.p1, item.p3, item.color));
            }
        });
        shapes = newShapes;
    }
    reader.readAsText(event.target.files[0]);
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

function clearShapes(){
    shapes = [];
    gl.clear( gl.COLOR_BUFFER_BIT );
}