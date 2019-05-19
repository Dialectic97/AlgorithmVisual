let xscale= d3.scale.linear().domain([0, 45]).range([0,705]) //(2) 定义x和y比例尺
let yscale= d3.scale.linear().domain([0, 30]).range([0,470])//设定高


const normal = "white";
const reading =  "#ff8a27"
const finished = "#52bc69"
const bordercolor = "#333";

const svg_length = 300;
const svg_width = 470;
const segmentation = 30;

let object_shapes = [];
let d3_shapes = [];
let object_lines = [];
let d3_lines = []

function circle(x, y, r, data, subscript) {
    return {
        name : "circle",
        x : x,
        y : y,
        r : r, 
        data : data,
        subscript : subscript,
    }
}

function rectangle(x, y, refer, width, height, data, subscript) {
    return {
        name : "rectangle",
        x : x,
        y : y,
        width : width,
        height : height,
        data : data,
        refer : refer,
        subscript : subscript,
    }
}
function line(x1, y1, x2, y2, icon1, icon2)  {
    return {
        name: "line",
        x1 : x1,
        y1 : y1,
        x2 : x2,
        y2 : y2,
        icon1 : icon1,
        icon2 : icon2,
        pos1 : 0,
        pos2 : 0
        
    }
}


//创建一个属性一样的元素
function RelativeCreate(shape,width, height, direction, distance,  data, subscript) {
    let position = get_offset_focus(shape, direction, distance);
    
    if(shape.name == "circle") {
        return  circle(position.x, position.y, shape.r, data, subscript);
    }
    else if(shape.name == 'rectangle') {
        
        switch(shape.refer) {
            case 0 : {
                rect_offset_x = 0;
                rect_offset_y = 0;
               
                break;
            }
            case 1 : {
                rect_offset_x = shape.width;
                rect_offset_y = 0;
                
                break;
            }
            case 3 : {
                rect_offset_x = 0;
                rect_offset_y = shape.height;
               
                break;
            }
            case 2 : {
                rect_offset_x = shape.width;
                rect_offset_y = shape.height;
               
                break;
            }
            
        }
        
        let temp_x = shape.x + rect_offset_x;
            let temp_y = shape.y + rect_offset_y;
            //console.log(temp.x, tempx.y);
            let ans = get_offset_focus(
                {
                 name: "rectangle",
                 x : temp_x,
                 y : temp_y }, direction, distance); 

            if(rect_offset_x != 0) ans.x -= width
            if(rect_offset_y != 0) ans.y -= height;
            return rectangle(ans.x , ans.y ,shape.refer, width, height, data, subscript); 
  
    }
    else {
        return 0;
    }
}

//所有图形都是网格化，不使用坐标系。
//shape is a circle  or rectangle object,
//direction is a string include top , button, right, left
//distance = 0 时，返回的是图形上的连接点，
//distance > 0 时，返回的是图形外的点，即图形的相对位置， 同时检查返回的坐标不可以在图形内
//圆形只有上下左右四个连接点，矩形还有顶点的连接点
function get_offset_focus(shape, direction, distance) {
    
    if(direction == "down") direction = "button"
    if(direction == "up") direction = "top"
    //错误检查
    let temp = ['top', 'button', 'left', 'right', 'top_left', 'top_right', 'button_left', 'button_right'];
    let pos = temp.indexOf(direction);

    if(shape.name == "circle") {
        if(distance == 0 && pos > 3) return 0;// 连接点，圆形没有斜的连接点 
        if(distance != 0 && distance < shape.r) return 0;//在园内
    }
    if(shape.name == "rectangle") {
        if(distance > 0 && pos > 3) return 0;
    }

    
    console.log(shape);
    let   offset1 = [0, 0, -1, 1, -1, 1, -1, 1];
    let   offset2 = [-1, 1, 0, 0, -1, -1, 1, 1];
    let   newoffset1 = [];
    let   newoffset2 = [];
    
    if(shape.name == "circle") {
        
        let dis;
        if(distance == 0) dis = shape.r;
        else dis = distance;
        //console.log("12323");
        //console.log(distance)

        newoffset1 = offset1.map(item => item * dis);
        newoffset2 = offset2.map(item => item * dis);
        console.log(newoffset1, newoffset2)
    }
    else if(shape.name == "rectangle") {
        

        let dis;
        if(distance == 0) {
            newoffset1 = offset1.map(item => item * shape.width/2);
            newoffset2 = offset2.map(item => item * shape.height/2);
        }
        else {
            newoffset1 = offset1.map(item => item * distance);
            newoffset2 = offset2.map(item => item * distance);
        }

        
    }
    else {
        return 0;
    }
   
    let x = shape.x + newoffset1[pos];
    let y = shape.y + newoffset2[pos];



    return {
        x : x, 
        y : y,
    }
}


function draw(shape, color="white", ani, delay = 0) {
    if(shape.name != "line" ) object_shapes.push(shape);

    var svg = d3.select("svg"); 
    if(shape.name == 'circle') {

        let d3_shape = svg.append("circle");
        let d3_text = svg.append("text")
        d3_shapes.push({d3_shape, d3_text});
        

        if(ani === undefined) {
            d3_shape
            .attr('cx', xscale(shape.x))
            .attr('cy', yscale(shape.y))
            .attr('r', svg_width/segmentation*shape.r)
            .attr('fill', color)
            .attr('stroke', "#333")
            .attr('stroke-width', "2")

            d3_text
            .text(shape.data)
            .attr('x', xscale(shape.x))
            .attr('y', yscale(shape.y))
            .attr('font-family', "'PT Sans', sans-serif")
            .attr('font-size', "16")
            .attr('font-weight', "bold")
            .attr('text-anchor', "middle")
            .attr('fill', "#333")

        }
        else if(ani == "liner") {
        
            d3_shape
            .attr('cx', xscale(shape.x))
            .attr('cy', yscale(shape.y))
            .attr('r', svg_width/segmentation*shape.r)
            .attr('fill', color)
            .attr('stroke', "#333")
            .attr('stroke-width', "2") 
            .attr("opacity", 0)
            .transition() 
            .delay(delay*1000)
            .duration(250)
            .attr("opacity", 1)


            d3_text
            .text(shape.data)
            .attr('x', xscale(shape.x))
            .attr('y', yscale(shape.y))
            .attr('font-family', "'PT Sans', sans-serif")
            .attr('font-size', "16")
            .attr('font-weight', "bold")
            .attr('text-anchor', "middle")
            .attr('fill', "#333")
            .attr("opacity", 0)
            .transition()
            .delay(delay*1000) 
            .duration(250)
            .attr("opacity", 1)


        }
        else {//添加各种动画
        }


    
        
    }
    else if(shape.name == 'rectangle') {
        //
        let ans = get_offset_focus(shape, "button_right",0);
        console.log(ans.x, ans.y);
        
        let d3_shape = svg.append("rect")
        let d3_text = svg.append("text")
        d3_shapes.push({d3_shape, d3_text});
       

        if(ani == undefined)  {
        //切换到左上角的坐标
            d3_shape
            .attr("x", xscale(shape.x))
            .attr("y", yscale(shape.y))
            .attr("width", svg_width/segmentation*shape.width)
            .attr("height", svg_width/segmentation*shape.height)
            .attr("fill",  color) 
            .attr('stroke', "#333")
            .attr('stroke-width', "2")

            d3_text
            .text(shape.data)
            .attr('x', xscale(ans.x))
            .attr('y', yscale(ans.y))
            .attr('font-family', "'PT Sans', sans-serif")
            .attr('font-size', "16")
            .attr('font-weight', "bold")
            .attr('text-anchor', "middle")
            .attr('fill', "#333")
            

        }else if(ani == "liner") {
            d3_shape
            .attr("x", xscale(shape.x))
            .attr("y", yscale(shape.y))
            .attr("width", svg_width/segmentation*shape.width)
            .attr("height", svg_width/segmentation*shape.height)
            .attr("fill", color) 
            .attr('stroke', "#333")
            .attr('stroke-width', "2") 
            .attr("opacity", 0)
            .transition() 
            .delay(delay*1000)
            .duration(250)
            .attr("opacity", 1) 

            d3_text
            .text(shape.data)
            .attr('x', xscale(ans.x))
            .attr('y', yscale(ans.y))
            .attr('font-family', "'PT Sans', sans-serif")
            .attr('font-size', "16")
            .attr('font-weight', "bold")
            .attr('text-anchor', "middle")
            .attr('fill', "#333")
            .attr("opacity", 0)
            .transition()
            .delay(delay*1000) 
            .duration(250)
            .attr("opacity", 1)
        }
        else if(ani == "bounce") {
            d3_shape
            .attr("x", xscale(shape.x))
            
            .attr("width", svg_width/segmentation*shape.width)
            .attr("fill", color) 
            .attr('stroke', "#333")
            .attr('stroke-width', "2")
            .attr("height", 0)
            .attr("y", yscale(shape.y+height))
            .transition() 
            .delay(delay*1000)
            .ease("bounce")
            .duration(2000)
            .attr("height", svg_width/segmentation*shape.height)
            .attr("y", yscale(ans.y))

            d3_text
            .text(shape.data)
            .attr('x', xscale(ans.x))
            .attr('y', yscale(ans.y))
            .attr('font-family', "'PT Sans', sans-serif")
            .attr('font-size', "16")
            .attr('font-weight', "bold")
            .attr('text-anchor', "middle")
            .attr('fill', "#333")
            .attr("opacity", 0)
            .transition()
            .delay(delay*1000) 
            .duration(250)
            .attr("opacity", 1)
        }
    }
    else {
        
        let line = svg.append("line")
        d3_lines.push(line);
        

        if(shape.y1 == shape.y2) {
            setTimeout(function(){
                line
                .attr("stroke", bordercolor)
                .attr("stroke-width", 3)
                .attr("marker-start", function() {
                    if(shape.icon1) return "url(#arrow2)";
                    else return "";
                })
                .attr("marker-end", function() {
                    if(shape.icon2) return "url(#arrow2)";
                    else return "";
                })
                .attr("x1", xscale(shape.x1))
                .attr("y1", yscale(shape.y1))
                .attr("y2", xscale(shape.y2))

                
                .attr("x2", xscale(shape.x1))
                
                .transition()
                //.delay(delay*1000)
                .duration(250)
                .ease("linear")
                .attr("x2", xscale(shape.x2))
                console.log(delay = 0);
            },delay*1000)
            
        } 
        else {
            setTimeout(function(){
                line
                .attr("stroke", bordercolor)
                .attr("stroke-width", 3)
                .attr("marker-start", function() {
                    if(shape.icon1) return "url(#arrow2)";
                    else return "";
                })
                .attr("marker-end", function() {
                    if(shape.icon2) return "url(#arrow2)";
                    else return "";
                })
                .attr("x1", xscale(shape.x1))
                .attr("y1", yscale(shape.y1))
                .attr("x2", xscale(shape.x2))
                
                .attr("y2", yscale(shape.y1))
                .transition()
                //.delay(delay*1000)
                .duration(250)
                .ease("linear")
                .attr("y2", xscale(shape.y2))
            },delay*1000)
        }
       
    }
}
//智能连接
function connect(shape1, shape2, from , to, ani, delay = 0) {
    let x = shape2.x - shape1.x;
    let y = shape2.y - shape1.y;
    if(x == 0 && y >= 0) {
        Junction1 = 'button';
        Junction2 = 'top';
    }else if(x == 0 && y < 0) {
        Junction1 = 'top';
        Junction2 = 'button';
    }else if(y == 0 && x < 0) {
        Junction2 = 'right';
        Junction1 = 'left';
    }else if(y == 0 && x >= 0) {
        Junction2 = 'left';
        Junction1 = 'right';
    }
    else {
        if(x > 0) Junction1 = 'right';
        if(x < 0) Junction1 = 'left';
        if(y > 0) Junction2 = 'top';
        if(y < 0) Junction2 = 'button';
    }
    let ans1 = get_offset_focus(shape1, Junction1, 0);
    let ans2 = get_offset_focus(shape2, Junction2, 0);
   
    let one = line(ans1.x, ans1.y, ans2.x, ans2.y, from, to);
    object_lines.push({line : one,shape1,shape2})
    draw(one, undefined, ani, delay);
}



function changecolor(shape, color, delay = 0) {
    let pos = object_shapes.findIndex(function(item, index, array) {
        return (item.x == shape.x && item.y == shape.y)
    })
    if(shape.data != undefined) {//需要处理的是shape + data
        let shape = d3_shapes[pos].d3_shape;
        let text = d3_shapes[pos].d3_text;
        shape.transition() 
        .delay(delay*1000)
        .attr("fill", color); 
        if(color != "white") {
            text.transition()
            .delay(delay*1000)
            .attr("stroke", "white")
            .attr("fill", "white");
        }
        else {
            text.transition()
            .delay(delay*1000)
            .attr("fill", bordercolor);
        }
    }
}


function move(objects, direction, distance, delay = 0) {
    let temp = []

    //只有一个的情况
    if(objects.length  > 1)  {
        for(let i = 0; i < object_shapes.length; i++) {
            for(let j = 0; j < object_shapes.length; j++) {
                for(let k = 0; k < object_lines.length; k++) {
                        let s1 = object_shapes[i]; 
                        let s2 = object_shapes[j];
                        let object = object_lines[k];
                            
                            if(object.shape1.x == s1.x 
                                && object.shape1.y == s1.y
                                && object.shape2.x == s2.x
                                && object.shape2.y == s2.y) {
                                    console.log("yes")
                                    temp.push(k);
                                    
                                }
                           
                  }
                }
            }
    
    
    //多个的情况
  
            switch(direction) {
                case 'up': {
                    
                    for(let i = 0; i < temp.length; i++) {
                        let line = object_lines[temp[i]].line;
                        let d3_line = d3_lines[temp[i]];
                        setTimeout(function() {
                            object_lines[temp[i]].line.y1 -= distance
                            object_lines[temp[i]].line.y2 -= distance
                            d3_line.transition()
                            .duration(250)
                            .attr("y1", xscale(object_lines[temp[i]].line.y1))
                            .attr("y2", xscale(object_lines[temp[i]].line.y2));
                        },delay*1000)
                    }
                    break;
                }
                case 'down': {
                    for(let i = 0; i < temp.length; i++) {
                        let line = object_lines[temp[i]].line;
                        let d3_line = d3_lines[temp[i]];
                        setTimeout(function() {
                            object_lines[temp[i]].line.y1 += distance
                            object_lines[temp[i]].line.y2 += distance
                            d3_line.transition()
                            .duration(250)
                            .attr("y1", xscale(object_lines[temp[i]].line.y1))
                            .attr("y2", xscale(object_lines[temp[i]].line.y2));
                        },delay*1000)
                    }
                    break;
                }
                case 'left':{
                    for(let i = 0; i < temp.length; i++) {
                        let line = object_lines[temp[i]].line;
                        let d3_line = d3_lines[temp[i]];
                        setTimeout(function() {
                            object_lines[temp[i]].line.x1 -= distance
                            object_lines[temp[i]].line.x2 -= distance
                            d3_line.transition()
                            .duration(250)
                            .attr("x1", xscale(object_lines[temp[i]].line.x1))
                            .attr("x2", xscale(object_lines[temp[i]].line.x2));
                        },delay*1000)
                    }
                    break;
                }
                case 'right': {
                    
                    for(let i = 0; i < temp.length; i++) {
                        let line = object_lines[temp[i]].line;
                        let d3_line = d3_lines[temp[i]];
                        setTimeout(function() {
                            object_lines[temp[i]].line.x1 += distance
                            object_lines[temp[i]].line.x2 += distance
                            d3_line.transition()
                            .duration(250)
                            .attr("x1", xscale(object_lines[temp[i]].line.x1))
                            .attr("x2", xscale(object_lines[temp[i]].line.x2));
                        },delay*1000)
                    }
                    break;
                }
            }
    }

    else {
        // let move = objects[0];
        // for(let i = 0; i < object_lines.length; i++) {
        //     let line = object_lines[i];
        //     let flag = 
        //     if((line.shape1.x == temp.x && line.shape1.y == temp.y) {
                        
        //     }
        //      line.shape2.x == temp.x && line.shape2.y == temp.y) {

        //                 temp.push(d3_lines[i]);
        //     }
        // }

        // for(let i = 0; i < temp.length; i++) {
        //     d3_line.transition()
        //         .duration(250)
        //         .attr("y1", xscale(object_lines[temp[i]].line.y1))
        //         .attr("y2", xscale(object_lines[temp[i]].line.y2));
        // }
    }
        

        

    //console.log(object_shapes[0]);
    let ans = objects.map(item => {
            for(let i = 0; i < object_shapes.length; i++) {
                if(object_shapes[i].x == item.x && object_shapes[i].y == item.y) return i;
            }
    })
    //console.log(object_shapes[0]);
    //console.log(ans);

    switch (direction){
        case "up": {
            //调整y轴坐标
            let temp1, temp2;
            for(let i = 0; i < ans.length; i++) {
                if(object_shapes[ans[i]].name == "rectangle") {
                    temp1 = object_shapes[ans[i]].width/2 
                    temp2 = object_shapes[ans[i]].height/2 
                }
                object_shapes[ans[i]].y -= distance; 
                d3_shapes[ans[i]].d3_shape.transition()
                .delay(delay*1000)
                .duration(250)
                .attr("cy", yscale(object_shapes[ans[i]].y ))
                .attr("y", yscale(object_shapes[ans[i]].y) )

                d3_shapes[ans[i]].d3_text.transition()
                .delay(delay*1000)
                .duration(250)
                .attr("y", yscale(object_shapes[ans[i]].y + temp2 )  )
                
             }
             break;
        }
        case "down": {
            //调整y轴坐标
           let temp1, temp2;
            for(let i = 0; i < ans.length; i++) {
                if(object_shapes[ans[i]].name == "rectangle") {
                    temp1 = object_shapes[ans[i]].width/2 
                    temp2 = object_shapes[ans[i]].height/2 
                } 
                 object_shapes[ans[i]].y += distance; 
                 d3_shapes[ans[i]].d3_shape.transition()
                 .delay(delay*1000)
                .duration(250)
                .attr("cy", yscale(object_shapes[ans[i]].y) )
                .attr("y", yscale(object_shapes[ans[i]].y) )
                

                 d3_shapes[ans[i]].d3_text.transition()
                 .delay(delay*1000)
                .duration(250)
                .attr("y", yscale(object_shapes[ans[i]].y + temp2) )
            }
             
             break;
        }
        case "left": {
            //调整y轴坐标
            let temp1, temp2;
            for(let i = 0; i < ans.length; i++) {
                if(object_shapes[ans[i]].name == "rectangle") {
                    temp1 = object_shapes[ans[i]].width/2 
                    temp2 = object_shapes[ans[i]].height/2 
                }
                object_shapes[ans[i]].x -= distance;
                d3_shapes[ans[i]].d3_shape.transition()
                .delay(delay*1000)
                .duration(250)
                .attr("cx", xscale(object_shapes[ans[i]].x ) )
                .attr("x", xscale(object_shapes[ans[i]].x ) )

                d3_shapes[ans[i]].d3_text.transition()
                .delay(delay*1000)
                .duration(250)
                .attr("x", xscale(object_shapes[ans[i]].x + temp1) )
             }
             break;
        }
        case "right": {
            //调整y轴坐标
            let temp1, temp2;
            for(let i = 0; i < ans.length; i++) {
                if(object_shapes[ans[i]].name == "rectangle") {
                    temp1 = object_shapes[ans[i]].width/2 
                    temp2 = object_shapes[ans[i]].height/2 
                }
                object_shapes[ans[i]].x += distance;
                d3_shapes[ans[i]].d3_shape.transition()
                .delay(delay*1000)
                .duration(250)
                .attr("cx", xscale(object_shapes[ans[i]].x) )
                .attr("x", xscale(object_shapes[ans[i]].x) )


                d3_shapes[ans[i]].d3_text.transition()
                .delay(delay*1000)
                .duration(250)
                .attr("x", xscale(object_shapes[ans[i]].x + temp1))
             }
             break;
        }
        

    }

}

function clear(shape, delay = 0) {
    for(let i = 0; i < object_shapes.length; i++) {
        if(shape.x == object_shapes[i].x && shape.y == object_shapes[i].y)
        setTimeout(function() {
            d3_shapes[i].d3_shape.remove();
            d3_shapes[i].d3_text.remove();
        },delay*1000);
    }
}

function disconnect(shape1, shape2, delay = 0) {
    for(let i = 0; i < object_lines.length; i++) {
        if(object_lines[i].shape1.x == shape1.x 
            && object_lines[i].shape1.y == shape1.y
            && object_lines[i].shape2.x == shape2.x
            && object_lines[i].shape2.y == shape2.y) {
                //console.log("yes");
                setTimeout(function() {
                    d3_lines[i].remove();
                },delay*1000);
                
                object_lines[i] = undefined;
            }
    }
    
}


//交换两个shape
function swap(i, j) {
     let temp = rectangle(0,0,0,0,0);
     temp.x = object_shapes[i].x;
     temp.y = object_shapes[i].y;
     temp.refer = object_shapes[i].refer;
     temp.width = object_shapes[i].width;
     temp.height = object_shapes[i].height;
     temp.data  = object_shapes[i].data;

     object_shapes[i].x = object_shapes[j].x;
     object_shapes[i].y = object_shapes[j].y;
     object_shapes[i].refer = object_shapes[j].refer;
     object_shapes[i].width = object_shapes[j].width;
     object_shapes[i].height = object_shapes[j].height;
     object_shapes[i].data = object_shapes[j].data;

     object_shapes[j].x = temp.x;
     object_shapes[j].y = temp.y;
     object_shapes[j].refer = temp.refer;
     object_shapes[j].width = temp.width;
     object_shapes[j].height = temp.height;
     object_shapes[j].data = temp.data;

     let temp2 = d3_shapes[i];
     d3_shapes[i] = d3_shapes[j];
     d3_shapes[j] = temp2;
}

function canvasclear() {
    object_shapes = [];
    object_lines = [];
    d3_lines = [];
    d3_shapes = [];
    d3.select("svg").selectAll("*").remove();
    parent.$("#pro").css({ "width": 0});

}

