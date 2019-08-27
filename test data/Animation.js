var AC;
var State;
var InitialArray;

var CodeWindow = parent.$("#Code")[0].contentWindow;
var rects;

var chart = {
    width: 300,
    height: 300,
    rectwidth: 25,
    interval: 5,

    Getx: function (i) {
        return this.Getx1() + i * (this.rectwidth + this.interval);
    },

    Gety: function (i) {
        return this.height - AC[State][0][i];
    },
    //get the first x, realize center
    Getx1: function () {
        return (this.width - AC.length * (this.rectwidth + this.interval)) / 2.0;
    }
};
//get Init data， draw chart
function InitChart(InitialArray) {
    d3.select("svg").remove(); //
    State = 0;
    //set blinde data
    //create svg
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", chart.width)
        .attr("height", chart.height);

    //create rects
    rects = d3.select("svg").selectAll("rect")
        .data(InitialArray)
        .enter()
        .append("rect")
        .attr("y", function (d, i) {
            return chart.Gety(i);
        })
        .attr("x", function (d, i) {
            return chart.Getx(i);
        })
        .attr("height", function (d) {
            return d;
        })
        .attr("width", chart.rectwidth)
        .attr("fill", "steeblue")
}

function RectsSwap(from, to) {
    setTimeout(function () {
        CodeWindow.editor.setCursor(8);
    }, 500);
    rects.transition()
        .attr("x", function (d, i) {
            if (i == from) {
                return chart.Getx(to);
            } else if (i == to) {
                return chart.Getx(from);
            } else
                return chart.Getx(i);
        })

    rects.transition()
        .delay(500)
        .style("fill", function (d, i) {
            if (i == from)
                return "black";
        })
}
function Compare(from, to) {
    CodeWindow.editor.setCursor(6);
    rects.style("fill", function (d, i) {
        if (i == from || i == to)
        return "red";
    })
}
function Succeed() {
    var rects = d3.select("#chart").select("svg").selectAll("rect");
    rects.style("fill", function (d, i) {
        return "green";
    })
    rects.transition()
        .delay(500)
        .style("fill", function (d, i) {
            return "black";
        })

}
//获得指定步骤下的数据
function GetRedomData(i) {
    var ans = AC[i][0];
    return ans;
}

function ChartUpdate(state) {
    //console.log(chart.dataset);
    d3.select("svg").selectAll("rect")
        .data(GetRedomData(state))     //数据源
        .attr("y", function (d, i) {
            return chart.Gety(i);
        })
        .attr("x", function (d, i) {
            return chart.Getx(i);
        })
        .attr("height", function (d) {
            return d;
        })
        .attr("width", chart.rectwidth)
        .attr("fill", "steeblue")
}
function Next() {
    State++;
    Compare(AC[State][1], AC[State][2]);
    RectsSwap(AC[State][1], AC[State][2]);

    UpdatePro(State);

    //保证交换动画完成后进行数据更新
    setTimeout(function () {
        ChartUpdate(State);
    }, 1000);

}
function Pre() {
    RectsSwap(AC[State][2], AC[State][1]);
    State--;
    UpdatePro(State);
    //保证交换动画完成后进行数据更新
    setTimeout(function () {
        ChartUpdate(State);
    }, 1000);
}
function AutoRun() {
    //console.log("dsfad");
    Run(State);
    isSucceed();

}

function isSucceed() {
    console.log(State);
    setTimeout(function () {
        if(State == AC.length) {
            Succeed();
            return;
        }
        else {
            isSucceed()
        }
        return;

    }, 1000);
}

function Run(i) {
    //ChartUpdate(State);
    setTimeout(function () {
        Next();
        if (i < AC.length)
            Run(State);
    }, 1000)



}


function set(ss) {

    InitialArray = ss.split(",").map(Number);
    AC = BubbleSoring(InitialArray);

    UpdatePro(0);
    InitialArray = AC[0][0];
    InitChart(InitialArray);
}



function BubbleSoring (InitialArray) {
    //console.log(InitialArray);
    var ans = new Array();
    ans.push([InitialArray.slice(0,InitialArray.length), 0, 0]);
    for(var i = 0 ; i < InitialArray.length; i++) {
        for(var j = 0 ; j < InitialArray.length; j++) {
            if(InitialArray[j] > InitialArray[j+1]) {
                temp = InitialArray[j];
                InitialArray[j] = InitialArray[j+1];
                InitialArray[j+1] = temp;

                ans.push([InitialArray.slice(0,InitialArray.length),j, j+1])
            }
        }
    }
    return ans;
}

function UpdatePro(State) {
    var speed = 100 /(AC.length - 1) * State;
    parent.$("#pro").css({ "width": speed.toString() + "%"});
}

