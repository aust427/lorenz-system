var scene, camera, renderer;

var line_1, line_2, line_3;
var axis_1, axis_2, axis_3; 
var line_idx = 0; 

var line_1_pos = [10 * Math.random(), 10 * Math.random(), 10 * Math.random()]; 
var line_2_pos = [10 * Math.random(), 10 * Math.random(), 10 * Math.random()];
var line_3_pos = [10 * Math.random(), 10 * Math.random(), 10 * Math.random()];

var sigma, rho, Beta;

sigma = 10;
Beta = 8 / 3;

var h = 0.005;

rho = 28;

var loop = false;

var controls;
var currentlyPressedKey = {};
var angle = 0.0075;

var lorenzEquations = function (u) {
  var x_dot = sigma * (u[1] - u[0]);
  var y_dot = u[0] * (rho - u[2]) - u[1];
  var z_dot = u[0] * u[1] - Beta * u[2];

  return ([x_dot, y_dot, z_dot]);
}

var RungeKutta = function (ut) {
  var ut_k1 = []; 
  var ut_k2 = []; 
  var ut_k3 = []; 
  var u_next = [];
  var O = 0;

  // first part
  var k1 = lorenzEquations(ut);

  // second part
  for (var i = 0; i < 3; i++) {
    ut_k1[i] = ut[i] + (1 / 2) * h * k1[i];
  }
  var k2 = lorenzEquations(ut_k1);

  // third part
  for (var i = 0; i < 3; i++) {
    ut_k2[i] = ut[i] + (1 / 2) * h * k2[i];
  }
  var k3 = lorenzEquations(ut_k2);

  // fourth part
  for (var i = 0; i < 3; i++) {
    ut_k3[i] = ut[i] + h * k3[i];
  }
  var k4 = lorenzEquations(ut_k3); 

  for (var i = 0; i < 3; i++) {
    u_next[i] = ut[i] + (1 / 6) * h * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
  }

  return (u_next);
}

var addVertice = function(line, idx){
  arr = line.geometry.attributes.position.array; 

  nextPos = RungeKutta([arr[idx], arr[idx + 1], arr[idx + 2]]);

  for (var i = idx + 3, j = 0; i < idx + 6; i++ , j++) {
    arr[i] = nextPos[j];
  }

  line.geometry.attributes.position.needsUpdate = true; 
  line.geometry.computeBoundingSphere();
  line.geometry.setDrawRange(0, line_idx / 3);
}

var animate = function () {

  addVertice(line_1, line_idx);
  addVertice(line_2, line_idx);
  addVertice(line_3, line_idx);

  line_idx = line_idx + 3;

  cameraUpdate();
  renderer.render(scene, camera);

  if (loop) {
    requestAnimationFrame(animate);
  }
};

var drawAxes = function (points) {
  materialLine = new THREE.LineBasicMaterial({
    color: 0x00ffff,
    linewidth: 5
  });

  var MAX_POINTS = 2;
  var positions = new Float32Array(MAX_POINTS * 3); 

  for (var i = 0; i < 6; i++) {
    positions[i] = points[i];
  }

  var geometryLine = new THREE.BufferGeometry();
  geometryLine.addAttribute('position', new THREE.BufferAttribute(positions, 3));
  var axis = new THREE.Line(geometryLine, materialLine);
  scene.add(axis);

  return (axis);
}

var initLine = function (col, pos) {
  materialLine = new THREE.LineBasicMaterial({
    color: col,
    linewidth: 5,
    linecap: 'round',
    linejoin: 'round' 
  });

  var MAX_POINTS = 100000;
  var positions = new Float32Array(MAX_POINTS * 3); // 3 vertices per point

  for (var i = 0; i < 3; i++) {
    positions[i] = pos[i];
  }

  var geometryLine = new THREE.BufferGeometry();
  geometryLine.addAttribute('position', new THREE.BufferAttribute(positions, 3));

  var line = new THREE.Line(geometryLine, materialLine);
  scene.add(line);

  return (line);
}

function handleKeyDown(event) {
  currentlyPressedKey[event.keyCode] = true;
}

function handleKeyUp(event) {
  currentlyPressedKey[event.keyCode] = false;
}

function cameraUpdate() {
  if (currentlyPressedKey[74]) {
    line_1.rotation.y += angle;
    line_2.rotation.y += angle;
    line_3.rotation.y += angle;

    axis_1.rotation.y += angle;
    axis_2.rotation.y += angle;
    axis_3.rotation.y += angle; 
  }
  if (currentlyPressedKey[76]) {
    line_1.rotation.y -= angle;
    line_2.rotation.y -= angle;
    line_3.rotation.y -= angle;

    axis_1.rotation.y -= angle;
    axis_2.rotation.y -= angle;
    axis_3.rotation.y -= angle;
  }

  if (currentlyPressedKey[73]) {
    line_1.rotation.x += angle;
    line_2.rotation.x += angle;
    line_3.rotation.x += angle;

    axis_1.rotation.x += angle;
    axis_2.rotation.x += angle;
    axis_3.rotation.x += angle;
  }

  if (currentlyPressedKey[75]) {
    line_1.rotation.x -= angle;
    line_2.rotation.x -= angle;
    line_3.rotation.x -= angle;

    axis_1.rotation.x -= angle;
    axis_2.rotation.x -= angle;
    axis_3.rotation.x -= angle;
  }
}

var prepareScene = function(){
  WIDTH = $('#THREE_canvas').width();
  HEIGHT = 540;
    
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, WIDTH / HEIGHT, 0.1, 1000 );
  camera.position.z = 65;

  axis_1 = drawAxes([-100, 0, 0, 100, 0, 0]);
  axis_2 = drawAxes([0, 0, -100, 0, 0, 100]);
  axis_3 = drawAxes([0, -100, 0, 0, 100, 0]);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( WIDTH, HEIGHT );
    
  container = document.getElementById('THREE_canvas');
  container.appendChild(renderer.domElement);


  renderer.render(scene, camera);
  lineSetting();

}

var start = function () {
  if (loop == false) {
    loop = true;
    animate();
  }
}

var pause = function () {
  loop = !loop;

  if (loop) {
    animate();
  }
}

var lineSetting = function () {
  line_1 = initLine(0xeaa221, line_1_pos);
  line_2 = initLine(0x345beb, line_2_pos);
  line_3 = initLine(0xe34234, line_3_pos);
}

var reset = function () {
  loop = false;

  scene.remove(line_1);
  scene.remove(line_2);
  scene.remove(line_3);

  line_idx = 0;

  lineSetting();
}

var setValues = function () {
  $('#xpos_1').val(line_1_pos[0]);
  $('#ypos_1').val(line_1_pos[1]);
  $('#zpos_1').val(line_1_pos[2]);

  $('#xpos_2').val(line_2_pos[0]);
  $('#ypos_2').val(line_2_pos[1]);
  $('#zpos_2').val(line_2_pos[2]);

  $('#xpos_3').val(line_3_pos[0]);
  $('#ypos_3').val(line_3_pos[1]);
  $('#zpos_3').val(line_3_pos[2]);

  $('#geometric').val(Beta);
  $('#rayleigh').val(rho);
  $('#prandtl').val(sigma);
}

var resize = function () {
  WIDTH = $('#THREE_canvas').width();

  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

$(document).ready(function() {    
  $("#button-start").click(function(){
    start();
  });
    
  $("#button-pause").click(function(){
    pause();
  });

  $("#button-reset").click(function () {
    reset();
  });

  $("#button-beta").click(function () {
    Beta = $('#geometric').val();
  });

  $("#button-rho").click(function () {
    rho = $('#rayleigh').val();
  });

  $("#button-sigma").click(function () {
    sigma = $('#prandtl').val();
  });

  window.addEventListener("resize", resize);

  setValues(); 
  prepareScene();
  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;
});
