

function createMotionChart(elementId) {
    var traces = {
        pos: new TimeSeries(),
        vel: new TimeSeries(),
        acc: new TimeSeries(),
        jrk: new TimeSeries(),
    };
    
    var chart = new SmoothieChart({
        grid: { strokeStyle:'rgb(190, 190, 190)', fillStyle:'rgb(255, 255, 255)',
                lineWidth: 1, millisPerLine: 1000, verticalSections: 6, },
        labels: { fillStyle:'rgb(0, 0, 0)' },
        interpolation: 'linear',
        minValue: -1000.0,
        maxValue: 2000.0,
        nonRealtimeData: true,
        millisPerPixel: 5,
    });
    var lineWidth = 2;
    chart.addTimeSeries(traces.pos, {
        strokeStyle: 'rgba(255, 0, 0, 0.7)', 
        //fillStyle: 'rgba(210, 0, 0, 0.2)',
        lineWidth: lineWidth,
    });
    
    chart.addTimeSeries(traces.vel, {
        strokeStyle: 'rgba(0, 210, 0, 0.7)', 
        fillStyle: 'rgba(0, 255, 0, 0.2)',
        lineWidth: lineWidth,
    });
    
    chart.addTimeSeries(traces.acc, {
        strokeStyle: 'rgba(0, 0, 210, 0.7)', 
        fillStyle: 'rgba(0, 0, 266, 0.2)',
        lineWidth: lineWidth,
    });
    
    chart.addTimeSeries(traces.jrk, {
        strokeStyle: 'rgba(200, 100, 50, 0.7)', 
        fillStyle: 'rgba(200, 100, 50, 0.2)',
        lineWidth: lineWidth,
    });
    
    chart.streamTo(document.getElementById(elementId), 0);
    
    traces.getAll = function() {
        return [this.pos, this.vel, this.acc, this.jrk];
    }
    traces.chart = chart;
    return traces;
}


var s_curve_force = new TimeSeries();
var t_curve_force = new TimeSeries();


function onPageLoad() {
    
    
    
    document.getElementById("stiffness_slider").addEventListener("input", function(){
        document.getElementById("stiffness_slider_label").innerHTML=this.value/100;
    });

    document.getElementById("velocity_slider").addEventListener("input", function(){
        document.getElementById("velocity_slider_label").innerHTML=this.value * 100;
        document.getElementById("velocity_slider_label").style.color = "#000000";
    });

    document.getElementById("acceleration_slider").addEventListener("input", function(){
        document.getElementById("acceleration_slider_label").innerHTML=this.value * 100;
        document.getElementById("acceleration_slider_label").style.color = "#000000";
    });

    document.getElementById("jerk_slider").addEventListener("input", function(){
        document.getElementById("jerk_slider_label").innerHTML=this.value * 1000;
    });

    document.getElementById("tvelocity_slider").addEventListener("input", function(){
        document.getElementById("tvelocity_slider_label").innerHTML=this.value * 100;
        document.getElementById("tvelocity_slider_label").style.color = "#000000";
    });

    document.getElementById("tacceleration_slider").addEventListener("input", function(){
        document.getElementById("tacceleration_slider_label").innerHTML=this.value * 100;
        document.getElementById("tacceleration_slider_label").style.color = "#000000";
    });
        
    
    s_curve_chart = createMotionChart("s_curve_chart");
    t_curve_chart = createMotionChart("t_curve_chart");
    
    resetSimulation();
    
    let canvas = document.getElementById("physics", 0);
    // create a renderer
    var render = Render.create({
        //element: document.body, // Passing in our own canvas below
        engine: engine,
        options: {
            width: 800,
            height: 100,
            wireframes: false,
            background: "#FFFFFF",
        },
        bounds: {
            min: { x: 0, y: 0 },
            max: { x: 2000, y: 250 }
        },
        canvas: canvas,
    });
    
    //t_curve_chart.chart.getTimeSeriesOptions(t_curve_chart.vel).strokeStyle = 'rgba(255, 127, 80, 0.9)';
    //t_curve_chart.chart.getTimeSeriesOptions(t_curve_chart.vel).fillStyle = 'rgba(255, 127, 80, 0.2)';

    var error_chart = new SmoothieChart({
        grid: { strokeStyle:'rgb(190, 190, 190)', fillStyle:'rgb(255, 255, 255)',
                lineWidth: 1, millisPerLine: 1000, verticalSections: 3, },
        labels: { fillStyle:'rgb(0, 0, 0)' },
        interpolation: 'linear',
        nonRealtimeData: true,
        millisPerPixel: 5,
    });
    error_chart.addTimeSeries(s_curve_force, { 
        strokeStyle: boxA.render.fillStyle,
        lineWidth: 3, 
    });
        
    error_chart.addTimeSeries(t_curve_force, { 
        strokeStyle: boxB.render.fillStyle,
        lineWidth: 3, 
    });
    
    error_chart.streamTo(document.getElementById("error_chart"), 0);
    
    
    // Start the simulator
    World.add(engine.world, [boxA, circleA, springA, groundA, boxB, circleB, springB, groundB]);
    Engine.run(engine);
    Render.run(render);
}

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Events = Matter.Events,
    Composite = Matter.Composite,
    Constraint = Matter.Constraint;

// create an engine
var engine = Engine.create( {
    constraintIterations:1,
    velocityIterations: 8,
    positionIterations: 12,
    });

var groundA = Bodies.rectangle(1000, 100, 2000, 20, {
    isStatic: true, 
    render: {
        fillStyle: "orange",
        strokeStyle: "white",
        lineWidth: 5,
    } 
});

var boxA = Bodies.rectangle(50, groundA.bounds.min.y - 40, 80, 80);
Matter.Body.set(boxA, "friction", 0);
Matter.Body.setMass(boxA, 100000);
Matter.Body.setInertia(boxA, 100000);
Matter.Body.setStatic(boxA, true);
boxA.render.fillStyle = "lightgreen";

var circleA = Bodies.circle(250, groundA.bounds.min.y - 40, 40);
Matter.Body.setMass(circleA, 1);
Matter.Body.set(circleA, "friction", 0);
Matter.Body.setInertia(circleA, 10000); // No rotation
circleA.render.fillStyle = boxA.render.fillStyle;

var springA = Constraint.create({ 
    bodyA: boxA, 
    bodyB: circleA,
    stiffness: .2,
    damping: .1,
});

var groundB = Bodies.rectangle(1000, 230, 2000, 20, {
    isStatic: true, 
    render: {
        fillStyle: "orange",
        strokeStyle: "white",
        lineWidth: 5,
    } 
});

var boxB = Bodies.rectangle(50, groundB.bounds.min.y - 40, 80, 80);
Matter.Body.set(boxB, "friction", 0);
Matter.Body.setMass(boxB, 100000);
Matter.Body.setInertia(boxB, 100000);
Matter.Body.setStatic(boxB, true);
boxB.render.fillStyle = "coral";

var circleB = Bodies.circle(250, groundB.bounds.min.y - 40, 40);
Matter.Body.setMass(circleB, 1);
Matter.Body.set(circleB, "friction", 0);
Matter.Body.setInertia(circleB, 10000); // No rotation
circleB.render.fillStyle = boxB.render.fillStyle;

var springB = Constraint.create({ 
    bodyA: boxB, 
    bodyB: circleB,
    stiffness: .2,
    damping: .1,
});

var p_target = 1500;
var max_vel = 1000;
var max_jrk = 10000.0;
var max_acc = 2500.0;

var max_vel_t_curve = 1000.0;
var max_acc_t_curve = 2500.0;

// A basic S-Curve.  This is a piecewise 7 part function,
// with each part representing a different stage in the
// motion profile.  Jerk is only applied in parts 1, 3,
// 5, and 7.
var s_curve = [
    {t0: 0.0, t:0.0, j: max_jrk,  a: 0.0, v: 0.0, p: 0.0}, // curve1
    {t0: 0.0, t:0.0, j: 0.0,      a: 0.0, v: 0.0, p: 0.0}, // curve2
    {t0: 0.0, t:0.0, j:-max_jrk,  a: 0.0, v: 0.0, p: 0.0}, // curve3                                                 //
    {t0: 0.0, t:0.0, j: 0.0,      a: 0.0, v: 0.0, p: 0.0}, // curve4
    {t0: 0.0, t:0.0, j:-max_jrk,  a: 0.0, v: 0.0, p: 0.0}, // curve5
    {t0: 0.0, t:0.0, j: 0.0,      a: 0.0, v: 0.0, p: 0.0}, // curve6
    {t0: 0.0, t:0.0, j: max_jrk,  a: 0.0, v: 0.0, p: 0.0}, // curve7
];

// A basic Trapezoidal Curve.  This mirrors the S-Curve, but
// sections 1, 3, 5, and 7 will always have 0 time and all sections
// have zero jerk.  Section 2 contains the positive acceleration
// region, and section 6 contains the constant deceleration region.
// Note: sections 1, 3, 5, and 7 are left in so we can re-use the 
// S-Curve computation functions for position and solving. (makes
// life easier!).
var t_curve = [
    {t0: 0.0, t:0.0, j: 0.0, a:   0.0,   v: 0.0, p: 0.0}, // curve1
    {t0: 0.0, t:0.0, j: 0.0, a: max_acc, v: 0.0, p: 0.0}, // curve2
    {t0: 0.0, t:0.0, j: 0.0, a:   0.0,   v: 0.0, p: 0.0}, // curve3                                                 //
    {t0: 0.0, t:0.0, j: 0.0, a:   0.0,   v: 0.0, p: 0.0}, // curve4
    {t0: 0.0, t:0.0, j: 0.0, a:   0.0,   v: 0.0, p: 0.0}, // curve5
    {t0: 0.0, t:0.0, j: 0.0, a:-max_acc, v: 0.0, p: 0.0}, // curve6
    {t0: 0.0, t:0.0, j: 0.0, a:   0.0,   v: 0.0, p: 0.0}, // curve7
];


function s_curve_part_pos(part, time) {
    return part.p + part.v * time + 
    1.0 / 2.0 * part.a * Math.pow(time, 2) + 
    1.0 / 6.0 * part.j * Math.pow(time, 3);
};

function s_curve_part_vel(part, time) {
    return part.v + part.a * time + 
    1.0 / 2.0 * part.j * Math.pow(time, 2);
};

function s_curve_part_acc(part, time) {
    return part.a + part.j * time;
};

function s_curve_part_jrk(part, time) {
    return part.j;
};

// Find the part index for an S-Curve for "time".
function s_curve_index(curve, time) {
    var i;
	for (i = 1; i < 7; i++)
	{
		if (curve[i].t0 > time)
		{
			break;
		}
	}
	return i - 1;
};

// Get the current position, velocity, acceleration or jerk
// for an S-Curve at the given time.
function s_curve_pos(curve, time) {
    var i = s_curve_index(curve, time);
    return s_curve_part_pos(curve[i], time - curve[i].t0);
};
function s_curve_vel(curve, time) {
    var i = s_curve_index(curve, time);
    return s_curve_part_vel(curve[i], time - curve[i].t0);
};
function s_curve_acc(curve, time) {
    var i = s_curve_index(curve, time);
    return s_curve_part_acc(curve[i], time - curve[i].t0);
};
function s_curve_jrk(curve, time) {
    var i = s_curve_index(curve, time);
    return s_curve_part_jrk(curve[i], time - curve[i].t0);
};

// Connect the piecewise sections of an S-Curve together to
// ensure a smooth graph.
function calculate_s_curve(curve) {
    last_curve = curve[0];
    for (var i = 1; i < 7; i++)
    {
        curve[i].t0 = last_curve.t0 + last_curve.t;
        curve[i].a = s_curve_part_acc(last_curve, last_curve.t);
        curve[i].v = s_curve_part_vel(last_curve, last_curve.t);
        curve[i].p = s_curve_part_pos(last_curve, last_curve.t);
        last_curve = curve[i];
    }
};

// Similar to the S-Curve corollary, but uses acceleration and
// ignores jerk for computation.
function calculate_t_curve(curve) {
    last_curve = curve[0];
    for (var i = 1; i < 7; i++)
    {
        curve[i].t0 = last_curve.t0 + last_curve.t;
        curve[i].v = s_curve_part_vel(last_curve, last_curve.t);
        curve[i].p = s_curve_part_pos(last_curve, last_curve.t);
        last_curve = curve[i];
    }
};

function recalculate_t_curve() {

    let t1 = max_vel_t_curve / max_acc_t_curve;
    let t2 = (p_target - max_acc_t_curve * Math.pow(t1, 2)) / max_vel_t_curve;
    if (t2 < 0)
    {
        // Can't reach maximum velocity
        t2 = 0;
        t1 = Math.pow(p_target / max_acc_t_curve, 0.5);
    }
    
    t_curve[1].t = t_curve[5].t = t1;
    t_curve[3].t = t2;
    t_curve[1].a = max_acc_t_curve;
    t_curve[5].a = -max_acc_t_curve;
    
    calculate_t_curve(t_curve);
}

function recalculate_s_curve() {
    
    let t1 = 0;
    let t2 = 0;
    
    // Compute a constant jerk S-curve profile with starting
    // and ending velocity of 0 using max_jrk, max_acc, and
    // max_vel.  The total distance travelled by the curve will
    // be "p_target".  Maximum velocity may be reduced in order
    // to reach p_target.
    
    s_curve = [
        {t0: 0.0, t:0.0, j: max_jrk,  a: 0.0, v: 0.0, p: 0.0}, // curve1
        {t0: 0.0, t:0.0, j: 0.0,      a: 0.0, v: 0.0, p: 0.0}, // curve2
        {t0: 0.0, t:0.0, j:-max_jrk,  a: 0.0, v: 0.0, p: 0.0}, // curve3                                                 //
        {t0: 0.0, t:0.0, j: 0.0,      a: 0.0, v: 0.0, p: 0.0}, // curve4
        {t0: 0.0, t:0.0, j:-max_jrk,  a: 0.0, v: 0.0, p: 0.0}, // curve5
        {t0: 0.0, t:0.0, j: 0.0,      a: 0.0, v: 0.0, p: 0.0}, // curve6
        {t0: 0.0, t:0.0, j: max_jrk,  a: 0.0, v: 0.0, p: 0.0}, // curve7
    ];
    
    var p = 0;
    
    var test_vel_min = 0;
    var test_vel_max = max_vel;
    var test_vel = test_vel_max; // Start at max vel - probably the solution
    while ((test_vel_max - test_vel_min) > 5) // Solve to within 5 velocity units
    {
        if (Math.pow(max_acc, 2) / max_jrk > test_vel) {
            t1 = Math.pow(test_vel / max_jrk, 0.5);
            t2 = 0;
        } else {
            t1 = max_acc / max_jrk;
            t2 = (test_vel - max_acc * t1) / max_acc;
        }
        
        s_curve[0].t = s_curve[2].t = s_curve[4].t = s_curve[6].t = t1;
        s_curve[1].t = s_curve[5].t = t2;
        calculate_s_curve(s_curve);
        
        p = s_curve_pos(s_curve, s_curve[6].t0 + s_curve[6].t);
        
        if (p > p_target)
        {
            // Need to reduce velocity
            test_vel_max = test_vel;
            test_vel = (test_vel_max + test_vel_min) / 2.0;
        }
        else
        {
            if (p > (p_target - 5))
            {
                break;
            }
            else
            {
                // Increase velocity
                test_vel_min = test_vel;
                test_vel = (test_vel_max + test_vel_min) / 2.0;
            }
        }
    }

    // Adjust the constant velocity section to reach the target position
    t = (p_target - p) / test_vel;
    s_curve[3].t = Math.max(t, 0);
    calculate_s_curve(s_curve);
}

max_vel = 1000; // Reach this velocity
recalculate_s_curve();


var v = 0;
var p = 0;
var vt = 0;
var pt = 0;

var time_shift = 0;
var time = 0;

a_scale = 1.0;
j_scale = 1.0;

Events.on(engine, 'beforeUpdate', function(event) {
    var engine = event.source;
    
    time = event.timestamp / 1000 - .01 + time_shift;
    var j = 0;
    var a = 0;
    var at = 0;
    if (time > 0 && time < (s_curve[6].t0 + s_curve[6].t))
    {
        v = s_curve_vel(s_curve, time);
        p = s_curve_pos(s_curve, time);
        a = s_curve_acc(s_curve, time);
        j = s_curve_jrk(s_curve, time);
    }
    
    if (time > 0 && time < (t_curve[6].t0 + t_curve[6].t))
    {
        pt = s_curve_pos(t_curve, time);
        vt = s_curve_vel(t_curve, time);
        at = s_curve_acc(t_curve, time);
    }
    
    charttime = new Date(time * 1000 + 0.01);
    
    if (time <= (800 * 0.005 - 0.01))
    {
        s_curve_force.append(charttime, springA.length + boxA.position.x - circleA.position.x);
        t_curve_force.append(charttime, springB.length + boxB.position.x - circleB.position.x);
        
        s_curve_chart.pos.append(charttime, p);
        s_curve_chart.vel.append(charttime, v);
        s_curve_chart.acc.append(charttime, a * a_scale);
        s_curve_chart.jrk.append(charttime, j * j_scale);
        
        t_curve_chart.pos.append(charttime, pt);
        t_curve_chart.vel.append(charttime, vt);
        t_curve_chart.acc.append(charttime, at * a_scale);
        
        Matter.Body.setPosition(boxA, Matter.Vector.create(50 + p, boxA.position.y));
        Matter.Body.setPosition(boxB, Matter.Vector.create(50 + pt, boxB.position.y));
    }
    
    last_vel = circleA.velocity.x;
});

function resetSimulation() {
    
    //springA.stiffness = document.getElementById("acc_box").value;
    springB.stiffness = springA.stiffness = 1.0 * document.getElementById("stiffness_slider_label").innerHTML;
    
    max_vel = 1.0 * document.getElementById("velocity_slider_label").innerHTML;
    max_acc = 1.0 * document.getElementById("acceleration_slider_label").innerHTML;
    max_jrk = 1.0 * document.getElementById("jerk_slider_label").innerHTML;
    recalculate_s_curve();
    if (s_curve[3].v < (max_vel - 10)) {
        document.getElementById("velocity_slider_label").style.color = "#FF0000";
    } else {
        document.getElementById("velocity_slider_label").style.color = "#000000";
    }
    if (s_curve[1].a < (max_acc - 10)) {
        document.getElementById("acceleration_slider_label").style.color = "#FF0000";
    } else {
        document.getElementById("acceleration_slider_label").style.color = "#000000";
    }
    
    // Autoscale jerk and acceleration by 5, 10, 50, 100, 500, ...
    let j = max_jrk;
    j_scale = 1.0;
    while (j * j_scale > 1000)
    {
        j_scale /= 5.0;
        if (j * j_scale < 1000)
        {
            break;
        }
        j_scale /= 2.0;
    }
    
    max_vel_t_curve = 1.0 * document.getElementById("tvelocity_slider_label").innerHTML;
    max_acc_t_curve = 1.0 * document.getElementById("tacceleration_slider_label").innerHTML;
    recalculate_t_curve();
    if (t_curve[3].v < (max_vel_t_curve - 10)) {
        document.getElementById("tvelocity_slider_label").style.color = "#FF0000";
    } else {
        document.getElementById("tvelocity_slider_label").style.color = "#000000";
    }
    
    let a = Math.max(max_acc, max_acc_t_curve);
    a_scale = 1.0;
    while (a * a_scale > 1000)
    {
        a_scale /= 5.0;
        if (a * a_scale < 1000)
        {
            break;
        }
        a_scale /= 2.0;
    }
    
    
    // Reset all simulation variables
    Matter.Body.setPosition(boxA, Matter.Vector.create(50, groundA.bounds.min.y - 40));
    Matter.Body.setPosition(boxB, Matter.Vector.create(50, groundB.bounds.min.y - 40));
    Matter.Body.setPosition(circleA, Matter.Vector.create(boxA.position.x + springA.length, boxA.position.y));
    Matter.Body.setPosition(circleB, Matter.Vector.create(boxB.position.x + springB.length, boxB.position.y));
    time_shift -= (time + 0.01);
    v = p = a = j = pt = vt = at = 0;
    
    
    // Clear all the curves and add one starting point at T = 0
    chart_time = new Date(0);
    traces = s_curve_chart.getAll();
    traces = traces.concat(t_curve_chart.getAll());
    traces.forEach(function(trace) {
        trace.clear();
        trace.append(chart_time, 0);
    });
    
    s_curve_force.clear();
    t_curve_force.clear();
}

Events.on(engine, 'afterUpdate', function(event) {
    var engine = event.source;
});

