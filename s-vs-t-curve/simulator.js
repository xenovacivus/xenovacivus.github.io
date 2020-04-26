
var kinematic_chart;
var frequency_chart;

// Scaling factors for acceleration and jerk (for the graph)
var a_scale = 0.1;
var j_scale = 0.001;



function updatePositionGraphVisibility()
{
    graph_canvas = document.getElementById("kinematic_chart_canvas");
    if (document.getElementById("show_position_graphs_checkbox").checked)
    {
        // Show the position graphs
        graph_canvas.style.visibility='visible';
        graph_canvas.height=kinematic_chart_canvas_height;
        kinematic_chart.update();
    }
    else
    {
        // Hide the position graphs
        graph_canvas.style.visibility='hidden';
        kinematic_chart_canvas_height = graph_canvas.height;
        graph_canvas.height='0';
    }
}

function updateFrequencyGraphVisibility()
{
    graph_canvas = document.getElementById("frequency_chart_canvas");
    if (document.getElementById("show_frequency_graphs_checkbox").checked)
    {
        // Show the position graphs
        graph_canvas.style.visibility='visible';
        graph_canvas.height=frequency_chart_canvas_height;
        frequency_chart.update();
    }
    else
    {
        // Hide the position graphs
        graph_canvas.style.visibility='hidden';
        frequency_chart_canvas_height = graph_canvas.height;
        graph_canvas.height='0';
    }
}

function onPageLoad()
{
    var ctx = document.getElementById('kinematic_chart_canvas').getContext('2d');
    kinematic_chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    yAxisID: "curve-data",
                    label: 'Position',
                    backgroundColor: 'rgb(255, 200, 200)',
                    fill: 4,
                    borderColor: 'rgb(200, 50, 50)',
                    data: [],
                    pointRadius: 0,
                    borderWidth: 2,
                },
                {
                    yAxisID: "curve-data",
                    label: 'Velocity',
                    backgroundColor: 'rgb(200, 255, 200)',
                    fill: 5,
                    borderColor: 'rgb(50, 200, 50)',
                    data: [],
                    pointRadius: 0,
                    borderWidth: 2,
                },
                {
                    yAxisID: "curve-data",
                    label: 'Acceleration/10',
                    backgroundColor: 'rgb(200, 200, 255)',
                    borderColor: 'rgb(50, 50, 200)',
                    fill: false,//6,
                    //cubicInterpolationMode: 'monotone',
                    lineTension: 0, // No line smoothing
                    pointRadius: 0,
                    borderWidth: 2,
                    data: [],
                },
                {
                    yAxisID: "curve-data",
                    label: 'Jerk/1000',
                    options: { legend: { fullWidth: true }},
                    backgroundColor: 'rgba(255, 255, 200, .3)',
                    borderColor: 'rgb(200, 200, 50)',
                    lineTension: 0, // No line smoothing
                    pointRadius: 0,
                    borderWidth: 2,
                    steppedLine: true,
                    data: [],
                    //fill: false,
                },
                
                // Trapezoidal curve charts
                {
                    yAxisID: "curve-data",
                    label: 'Position (trapezoidal)',
                    borderColor: 'rgb(255, 100, 100)',
                    data: [],
                    pointRadius: 0,
                    borderWidth: 2,
                    borderDash: [5,4],
                    fill: false,
                },
                {
                    yAxisID: "curve-data",
                    label: 'Velocity (trapezoidal)',
                    borderColor: 'rgb(100, 240, 100)',
                    data: [],
                    pointRadius: 0,
                    borderWidth: 2,
                    borderDash: [5,4],
                    fill: false,
                },
                {
                    yAxisID: "curve-data",
                    label: 'Acceleration (trapezoidal)',
                    borderColor: 'rgb(100, 100, 255)',
                    lineTension: 0, // No line smoothing
                    pointRadius: 0,
                    borderWidth: 2,
                    borderDash: [5,4],
                    steppedLine: true,
                    data: [],
                    fill: false,
                },
                
                // Error plots
                {
                    yAxisID: "error-data",
                    label: 'Position Error (s_curve)',
                    borderColor: 'rgba(200, 50, 50, .5)',
                    backgroundColor: 'rgba(200, 50, 50, .5)',
                    pointRadius: 0,
                    borderWidth: 0,
                    data: [],
                    fill: false,
                },
                {
                    yAxisID: "error-data",
                    label: 'Position Error (t_curve)',
                    borderColor: 'rgba(0, 200, 150, .5)',
                    backgroundColor: 'rgba(0, 200, 150, .5)',
                    pointRadius: 0,
                    borderWidth: 0,
                    data: [],
                    fill: false,
                },
            ],
        },

        // Configuration options go here
        options: {
            title: {
                display: true,
                text: 'Motion Profile Curves',
            },
            //legend: { position: "right" },
            animation: {
                duration: 250, // 200 milliseconds
            },
            
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    ticks: {
                        min: 0,
                        // max: 5,
                        //suggestedMax: 2, // Allow extending if necessary
                        //maxTicksLimit: 4,
                        stepSize: 1,
                    },
                    scaleLabel: {
                        labelString: "Time (Seconds)",
                        display: true,
                    },
                }],
                yAxes: [{
                        id: "curve-data",
                        display: true,
                        ticks: { min: -100, max: 500, },
                    },
                    {
                        id: "error-data",
                        type: 'linear',
                        position: 'right',
                        display: false,
                        ticks: { maxTicksLimit: 0, suggestedMin: -.1, suggestedMax: .1 },
                    },
                ],
            },
        }
    });
    
    
    var ctx = document.getElementById('frequency_chart_canvas').getContext('2d');
    frequency_chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 's-curve',
                    borderColor: 'rgba(200, 50, 50, .5)',
                    backgroundColor: 'rgba(200, 50, 50, .5)',
                    fill: false,
                    data: [],
                    pointRadius: 1,
                    lineTension: 0, // No line smoothing
                    borderWidth: 0,
                    
                },
                {
                    label: 't-curve',
                    borderColor: 'rgba(0, 200, 150, .5)',
                    backgroundColor: 'rgba(0, 200, 150, .5)',
                    fill: false,
                    data: [],
                    pointRadius: 1,
                    //showLine: false,
                    lineTension: 0, // No line smoothing
                    borderWidth: 0,
                },
            ],
        },
        options: {
            title: {
                display: true,
                text: 'Curve Frequency Components',
            },
            //legend: { position: "right" },
            animation: {
                duration: 250, // 200 milliseconds
            },
            
            scales: {
                xAxes: [{
                    //type: 'logarithmic',
                    type: 'linear',
                    position: 'bottom',
                    ticks: {
                        //min: 0,
                        // max: 5,
                        //suggestedMax: 2, // Allow extending if necessary
                        //maxTicksLimit: 4,
                        //stepSize: 1,
                    },
                    scaleLabel: {
                        labelString: "Frequency (Hz)",
                        display: true,
                    },
                }],
                yAxes: [{
                        display: true,
                        type: 'logarithmic',
                        //type: 'linear',
                        ticks: {
                            min: 1,
                            max: 1000000,
                        },
                    },
                ],
            },
        }
    });
    
    reloadParameters();
    recomputeAllCharts();
    
}

var spring_k = 1; // Spring factor K, F = KX
var damping = 0.02; // Damping factor
var mass = 0.25; // Assume kilogram units

var p_target = 200;
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
    time = Math.min(time, curve[6].t0 + curve[6].t);
    var i = s_curve_index(curve, time);
    return s_curve_part_pos(curve[i], time - curve[i].t0);
};
function s_curve_vel(curve, time) {
    if (time > (curve[6].t0 + curve[6].t))
    {
        return 0;
    }
    var i = s_curve_index(curve, time);
    return s_curve_part_vel(curve[i], time - curve[i].t0);
};
function s_curve_acc(curve, time) {
    if (time > (curve[6].t0 + curve[6].t))
    {
        return 0;
    }
    var i = s_curve_index(curve, time);
    return s_curve_part_acc(curve[i], time - curve[i].t0);
};
function s_curve_jrk(curve, time) {
    if (time > (curve[6].t0 + curve[6].t))
    {
        return 0;
    }
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
        {t0: 0.0, t:0.0, j:-max_jrk,  a: 0.0, v: 0.0, p: 0.0}, // curve3
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


function update_curve_data()
{
    kinematic_chart.data.datasets[0].data = [];
    kinematic_chart.data.datasets[1].data = [];
    kinematic_chart.data.datasets[2].data = [];
    kinematic_chart.data.datasets[3].data = [];
    
    kinematic_chart.data.datasets[4].data = [];
    kinematic_chart.data.datasets[5].data = [];
    kinematic_chart.data.datasets[6].data = [];
    
    max_time = s_curve[6].t0 + s_curve[6].t;
    
    // 100 points for velocity and position.
    for (var t = 0; t <= max_time + 0.0001; t += max_time / 100)
    {
        kinematic_chart.data.datasets[0].data.push( {x: t, y: s_curve_pos(s_curve, t) });
        kinematic_chart.data.datasets[1].data.push( {x: t, y: s_curve_vel(s_curve, t) });
        kinematic_chart.data.datasets[4].data.push( {x: t, y: s_curve_pos(t_curve, t) });
        kinematic_chart.data.datasets[5].data.push( {x: t, y: s_curve_vel(t_curve, t) });
    }
    
    // Acceleration and jerk will be a series of straight lines
    for (var i = 0; i < 7; i++)
    {
        kinematic_chart.data.datasets[2].data.push ( {x: s_curve[i].t0, y: s_curve[i].a * a_scale });
        kinematic_chart.data.datasets[3].data.push ( {x: s_curve[i].t0, y: s_curve[i].j * j_scale });
        kinematic_chart.data.datasets[6].data.push ( {x: t_curve[i].t0, y: t_curve[i].a * a_scale });
    }
    kinematic_chart.data.datasets[2].data.push ( {x: s_curve[6].t0 + s_curve[6].t, y: 0 });
    kinematic_chart.data.datasets[3].data.push ( {x: s_curve[6].t0 + s_curve[6].t, y: 0 });
    kinematic_chart.data.datasets[6].data.push ( {x: t_curve[6].t0 + t_curve[6].t, y: 0 });
}

function calc_curve_err_data(curve, points)
{
    err_data = [];
    
    iterations = points * 5;
    count = 0;
    
    max_time = Math.round(1 + s_curve[6].t0 + s_curve[6].t);
    delta_time = max_time / iterations;
    v = 0;
    p = 0;
    for (var t = 0; t <= max_time; t += delta_time)
    {
        x = s_curve_pos(curve, t);
        
        force = (x - p) * spring_k;
        // velocity proportional damping force
        force += -v * damping;
            
        // F = MA, A = F/M
        acceleration = force / mass;
            
        // Very simple iterative integration
            
        //console.log("f: " + force + " v: " + v + ", a: " + acceleration, " p: " + p);
        v += acceleration * delta_time;
        p += v * delta_time;

        count++;
        if (count >= (iterations / points))
        {
            count = 0;
            err_data.push( { x: t, y: p-x });
        }
    }
    return err_data;
    
}

function acc_dft(curve, fmin, fmax)
{
    // Compute a discrete time fourier transform of the input curve's acceleration.
    // Values are computed between fmin and fmax.
    
    max_time = curve[6].t0 + curve[6].t;
    
    src = [];
    
    sample_period = max_time / 500; // Constant 500 points.
    //sample_period = 1 / 200; // The acceleration waveforms contain high-frequency components, so sample at a high rate (500Hz in this case).
    for (var t = 0; t < max_time; t += sample_period)
    {
        src.push(s_curve_acc(curve, t));
    }
    
    //console.log("Sampling Period: " + sample_period + ", points = " + src.length + " (" + (max_time / sample_period) + "), increment = " + 1.0 / (src.length * sample_period * 2));
    
    // Update the frequency response chart
    // Discrete time fourier transform:
    //
    // X(w) = SUM(x[n]e^(-iwn)) for n = -infinity to infinity
    //
    // The real part will be:
    //
    // X(w) = SUM(x[n]cos(wn)) for n = -infinity to infinity
    //
    // w is in radians.
    //
    
    var data = [];
    if (1)
    {
        // The DTFT has periodic peaks, determined by the number of samples and sampling frequency.
        // The frequency iteration value below will give 20 unique points per peak (which looks pretty good).
        frequency_points = (fmax - fmin) * (src.length * sample_period * 20);
        frequency_points = Math.min(300, frequency_points); // But clamp to 300 to limit processing time
        for (f = fmin; f < fmax; f += (fmax - fmin) / frequency_points) //f += 1.0 / (src.length * sample_period * 20))
        {
            xr = 0;
            xi = 0;
            for (var i = 0; i < src.length; i += 1)
            {
                w = i * sample_period * Math.PI * 2 * f;
                v = src[i];
                xr += v * Math.cos(w);
                xi -= v * Math.sin(w);
            }
            m = Math.sqrt(xr*xr + xi*xi);
            
            data.push( { x: f, y: m } );
        }
    }
    else
    {
        // DFT (similar to above, but the sampling period is chosen to pick the peaks and troughs)
        // Generally finds the most representative points, but produces a less-smooth graph (the number of points relies on max_time above)
        N = src.length;
        for(k = Math.round(fmin * sample_period * N); k < fmax * (sample_period * N); k++) // Limited to input range
        //for(k = 0; k < N; k++)
        {
            xr = 0;
            xi = 0;
            for (var n = 0; n < src.length; n += 1)
            {
                w = Math.PI * 2 * n * k / N;
                v = src[n];
                xr += v * Math.cos(w);
                xi -= v * Math.sin(w);
            }
            m = Math.sqrt(xr*xr + xi*xi);
            
            data.push( { x: k / (sample_period * N), y: m } );
        }
    }
    
    return data;
}

function update_frequency_data()
{
    if (!document.getElementById("show_frequency_graphs_checkbox").checked)
    {
        return;
    }
    //console.time("dft");
    frequency_chart.data.datasets[0].data = acc_dft(s_curve, 0, 100);
    frequency_chart.data.datasets[1].data = acc_dft(t_curve, 0, 100);
    //console.timeEnd("dft");
}

function update_error_data()
{
    kinematic_chart.data.datasets[7].data = calc_curve_err_data(s_curve, 1000);
    kinematic_chart.data.datasets[8].data = calc_curve_err_data(t_curve, 1000);;
}


function reloadParameters()
{
    max_vel = (1.0 * document.getElementById("velocity_slider").value);
    max_acc = (1.0 * document.getElementById("acceleration_slider").value);
    max_jrk = (1.0 * document.getElementById("jerk_slider").value);
    
    // The slider controls the oscillation frequency, and the spring constant is calculated from there.
    osc_frequency = 1.0 * document.getElementById("resonant_frequency_slider").value;
    
    spring_k = mass * Math.pow((2 * 3.14 * osc_frequency), 2);
    damping = Math.round((1.0 * document.getElementById("damping_slider").value)) / 20;
    
    document.getElementById("velocity_slider_label").innerHTML = max_vel + " m/s";
    document.getElementById("jerk_slider_label").innerHTML = max_jrk + " m/s&sup3;";
    
    document.getElementById("resonant_frequency_slider_label").innerHTML = "&Sqrt;<span style='text-decoration: overline'>(k/m)</span> = " + osc_frequency + " Hz";
    document.getElementById("damping_slider_label").innerHTML = damping + " Ns/m";
    
    
    
    recalculate_s_curve();
    
    // Recompute the t-curve to match the s-curve.  Maintain maximum velocity, but adjust acceleration to reach
    // the target (p_target) at the same time.
    
    max_vel_t_curve = max_vel; //1.0 * document.getElementById("tvelocity_slider_label").innerHTML;
    
    // The curve is symmetrical, so calculations can be done for half the curve, targeting p = p_target.
    time = 0.5 * (s_curve[6].t0 + s_curve[6].t);
    // Is maximum velocity reached?
    // p = 1/2at^2
    // p_target = 0.5 * a * t^2
    max_acc_t_curve = p_target / (time*time);
    // v = at
    _v = max_acc_t_curve * time;
    if (_v > max_vel)
    {
        // Will hit maximum velocity
        vm = max_vel;
        // p_target = 1/2a(t1)^2 + vm*(t2)
        // t1 + t2 = time
        // vm = a(t1)
        
        // p_target = 1/2a(t1)^2 + a(t1)*(time-t1)
        // p_target = 1/2a(t1)(t1) + a(t1)*(time) - a(t1)(t1)
        // p_target = vm*(time) - 1/2vm(t1)
        // 2 * (vm*(time)-p_target) / vm = t1
        
        t1 = 2 * (vm * time - p_target * 0.5) / vm;
        max_acc_t_curve = vm / t1;
    }
    else
    {
        // Maximum velocity is not reached, go ahead and compute the curve with the existing max_acc_t_curve
    }
    
    recalculate_t_curve();
    
    info_str = "";
    // effective_acceleration = s_curve[1].a;
    // if (effective_acceleration < max_acc - 10)
    // {
    //     info_str = " (limited to " + Math.round(effective_acceleration) + ")"
    // }
    
    document.getElementById("acceleration_slider_label").innerHTML = "" + max_acc + " m/s&sup2;" + info_str + " (trapezoidal acceleration: " + Math.round(max_acc_t_curve) + ")";
    

}

function recomputeErrorChart()
{
    console.log("recomputeErrorChart()");
    reloadParameters(); // For stiffness and damping
    update_error_data();
    kinematic_chart.update();
}

function onKinematicSliderChanged()
{
    // For the velocity, acceleration, and jerk value sliders
    reloadParameters();
    if (document.getElementById("auto_update_checkbox").checked)
    {
        recomputeAllCharts();
    }
}

function onPhysicsSliderChanged()
{
    // For spring constant and damping sliders
    reloadParameters();
    if (document.getElementById("auto_update_checkbox").checked)
    {
        recomputeErrorChart();
    }
}

function recomputeAllCharts() // TODO: rename to recompute_all_charts
{
    console.log("recomputeAllCharts()");
    
    console.time("frequency_data");
    update_frequency_data();
    console.timeEnd("frequency_data");
    
    console.time("curve_data");
    update_curve_data();
    console.timeEnd("curve_data");
    
    console.time("error_data");
    update_error_data();
    console.timeEnd("error_data");
    
    kinematic_chart.update();
    frequency_chart.update();
}
