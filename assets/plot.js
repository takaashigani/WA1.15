// Word list
let words     = ["Flusspferd","Hund","Wolf","Katze","Krokodil","Sonnentau","Kaninchen","Venusfliegenfalle","Baumwolle","Schildkröte","Stein","Schimmelpilz"]
let animal    = [1           ,1     ,1     ,0.9    ,0.9       ,0.1        ,1          ,0.15               ,0.2        ,0.85         ,0      ,0.5           ]
let fluffy    = [0.1         ,0.75  ,0.7   ,0.9    ,0.05      ,0.6        ,0.95       ,0.2                ,1          ,0.125          ,0      ,0.5           ]
let carnivore = [0.1         ,0.8   ,0.9   ,0.8    ,1         ,0.7        ,0          ,0.9                ,0.1        ,0.15         ,0      ,0.5           ]
let separator = [0.05        ,0.1   ,0.2   ,0.15   ,0.25      ,0.3        ,0.3        ,0.1                ,0          ,0            ,0.2    ,0.2           ]

let trace_0D = {
    x: generateRandomArray(words.length, -2, 2, 0.225),
    y: generateRandomArray(words.length, -2, 2, 0.225),
    mode: 'text',
    text: words,
    textposition: 'middle center',
    type: 'scatter',
    name: 'none'
};

let trace_2D = {
    x: animal,
    y: separator,
    mode: 'text',
    text: words,
    textposition: 'middle center',
    type: 'scatter',
    name: 'none'
};

let trace_3D = {
    x: animal,
    y: carnivore,
    z: fluffy,
    mode: trace_2D.mode,
    text: trace_2D.text,
    textposition: trace_2D.textposition,
    type: 'scatter3d',
    name: trace_2D.name
};


let layout0D = {
    title: '0 Konzepte',
    height: 600,
    xaxis: { showgrid: false, zeroline: false, visible: false, range:[-5,5] },
    yaxis: { showgrid: false, zeroline: false, visible: false, range:[-5,5] }
};

let layout1D = {
    title: '1 Konzept',
    height: 600,
    xaxis: { title: 'Tier', showgrid: false, zeroline: false, range:[-0.09,1.09], linecolor: '#008d13', linewidth: 2 },
    yaxis: { showgrid: false, zeroline: false, visible: false, range:[-0.25,2] }
};

let layout2D = {
    title: '2 Konzepte',
    height: 600,
    xaxis: { title: 'Tier', range:[-0.09,1.09], zeroline: false, linecolor: '#008d13', linewidth: 2 },
    yaxis: { title: 'Flauschig', zeroline: false, linecolor: '#00218f', linewidth: 2 }
};

let layout3D = {
    title: '3 Konzepte',
    height: 600,
    scene: {
        xaxis: { title: 'Tier', linecolor: '#008d13', zeroline: false, linewidth: 2 },
        yaxis: { title: 'Fleischfresser', linecolor: '#8f003c', zeroline: false, linewidth: 2 },
        zaxis: { title: 'Flauschig', linecolor: '#00218f', zeroline: false, linewidth: 2 }
    },
    camera: {
        eye: {x:0.5,y:0,z:0},
        up: {x:1,y:1,z:0},
        center: {x:0.5,y:0.5,z:0.5}
    }
};


// Initial Plotly chart render as 0D
Plotly.newPlot('plotlyChart', [trace_0D], layout0D);


function getTrace(name) {
    if (name == "cbTier") {
        return animal
    }
    else if (name == "cbFlausch") {
        return fluffy
    }
    else {
        return carnivore
    }
}
function getName(name) {
    if (name == "cbTier") {
        return "Tier"
    }
    else if (name == "cbFlausch") {
        return "Flauschig"
    }
    else {
        return "Fleischfresser"
    }
}
function getColor(name) {
    if (name == "cbTier") {
        return "#008d13"
    }
    else if (name == "cbFlausch") {
        return "#00218f"
    }
    else {
        return "#8f003c"
    }
}

function handleDimension(checkbox) {

    let checks = document.querySelectorAll("#plotlyContainer input[type='checkbox']")
    var trace = {}
    var layout = {}

    let active = []
    checks.forEach((check) => {
        if (check.checked) {
            active.push(check.id)
        }
    });

    if (active.length == 0) {
        console.log("0 dim")
        layout = layout0D

        trace = {
            x: generateRandomArray(words.length, -2, 2, 0.225),
            y: generateRandomArray(words.length, -2, 2, 0.225),
            mode: 'text',
            text: words,
            textposition: 'middle center',
            type: 'scatter',
            name: 'none'
        };
    }
    else if (active.length == 1) {
        console.log("1 dim")
        layout = {
            ...layout1D,
            xaxis: { ...layout1D.xaxis, title: getName(active[0]), linecolor: getColor(active[0]) }
        }

        trace = {
            x: getTrace(active[0]),
            y: generateRandomArray(words.length, 0, 1),
            mode: 'text',
            text: words,
            textposition: 'middle center',
            type: 'scatter',
            name: 'none'
        };
    }
    else if (active.length == 2) {
        console.log("2 dim")
        layout = {
            ...layout2D,
            xaxis: { ...layout2D.xaxis, title: getName(active[0]), linecolor: getColor(active[0]) },
            yaxis: { ...layout2D.yaxis, title: getName(active[1]), linecolor: getColor(active[1]) }
        }

        trace = {
            x: getTrace(active[0]),
            y: getTrace(active[1]),
            mode: 'text',
            text: words,
            textposition: 'middle center',
            type: 'scatter',
            name: 'none'
        };
    }
    else {
        console.log("3 dim")
        trace = trace_3D
        layout = layout3D
    }

    Plotly.react('plotlyChart', [trace], layout);
}

function generateRandomArray(numPoints, min, max, minDist = 0.05, maxRetries = 100) {
    let arr = [];
    function isFarEnough(newPoint) {
        for (let i = 0; i < arr.length; i++) {
            if (Math.abs(arr[i] - newPoint) < minDist) {
                return false; // Too close to an existing point
            }
        }
        return true;
    }
    let retries = 0;
    while (arr.length < numPoints && retries < maxRetries) {
        let newPoint = Math.random() * (max - min) + min;
        if (isFarEnough(newPoint)) {
            arr.push(newPoint);  // Only add the point far enough away
            retries = 0; // Reset retries if a point is added successfully
        } else {
            retries++; // Increment retries if a valid point is not found
        }
    }
    if (retries >= maxRetries) {
        console.warn(`Could not generate all points within ${maxRetries} attempts.`);
        arr.push(newPoint);
    }
    return arr;
}

// Function to generate frames for transition animation
function generateFrames(start,end,series) {
    for (let i = 0; i <= 10; i++) {
        let intermediate = start.map((val, index) => {
            return val + (end[index] - val) * (i / 10);
        });
        frames.push({
            data: [
                { ...series, y: intermediate },
            ]
        });
    }
}


