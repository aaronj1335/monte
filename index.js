var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var width = 500;
var height = width;
var radius = 0.9 * width;
var startAngle = 0;
var endAngle = 0.5 * Math.PI;
var clockwise = false;
var count = 0;
var inside = 0;
var points = [];
var throttleTime = 200;
var pct = 0.0;
var runUntilCount = Number.MAX_VALUE;

var $results =  document.getElementById('results');
var $inside =   document.getElementById('inside');
var $count =    document.getElementById('count');
var $pi =       document.getElementById('pi');
var $error =    document.getElementById('error');

var requestAnimationFrame = window.requestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.msRequestAnimationFrame;

canvas.setAttribute('width', width);
canvas.setAttribute('height', height);

ctx.beginPath();
ctx.fillStyle = '#5D81FA';

var updatePi = _.throttle(function updatePi() {
  var pi = 4 * inside / count;
  var error = Math.abs(Math.PI - pi) / Math.PI;

  $inside.innerText = inside;
  $count.innerText = count;
  $pi.innerText = Math.round(pi * 1000) / 1000;
  $error.innerText = (Math.round(error * 100 * 1000) / 1000) + '%';
}, throttleTime);

function makePoint() {
  var x = Math.random() * radius;
  var y = Math.random() * radius;
  var isInside = Math.sqrt(x*x + y*y) < radius;
  var r = isInside? 4 : 4;

  ctx.beginPath();
  ctx.fillStyle = ctx.strokeStyle = '#A00D00';
  ctx.lineWidth = 2;
  ctx.arc(x, y, r, 0, 2 * Math.PI, true);

  if (isInside)
    ctx.fill();
  else
    ctx.stroke();

  if (++count < runUntilCount)
    requestAnimationFrame(makePoint);
  else
    requestAnimationFrame(updatePi, throttleTime);

  if (isInside)
    inside++;

  points.push([x, y]);
  updatePi();
}

function arcTo(endAngle) {
  ctx.clearRect(0, 0, radius, radius);
  ctx.beginPath();
  ctx.arc(0, 0, radius, startAngle, endAngle, clockwise);
  ctx.lineTo(0, 0);
  ctx.fill();
}

function makePoints() {
  arcTo(endAngle);
  makePoint();
  $results.className = '';
}

function animateCircle() {
  arcTo(Math.PI * (0.5 * (Math.sin(Math.PI * 0.5 * pct))));
  pct += 0.02;

  if (pct >= 1)
    makePoints();
  else
    requestAnimationFrame(animateCircle);
}

animateCircle();
