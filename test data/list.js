function redom (data){
    let k = 1;
    let first = circle(10, 10, 1.5, data[0]);
    draw(first, normal, "liner", k++);
    let pre = first;
   
    data.forEach(item => {
        let now = RelativeCreate(pre,0,0, "right", 5, item);
        draw(now, normal, "liner", k++); 
        connect(pre, now, false, true, "normal", k++);
        pre = now;
    })

    object_shapes.forEach(element => {
        changecolor(element, finished, k);
    });

    object_shapes.forEach(element => {
        changecolor(element, normal, k);
    });

}


function insert_head(data) {
    let k = 1;
    let head = object_shapes[0];
    let one = RelativeCreate(head, "down", 5, data);
    draw(one, normal, "liner", k++);
    connect(one, head, false, true, "liner", k++);
    changecolor(one, reading, k++);
    
    move(object_shapes.slice(0, object_shapes.length - 1), "right", 5, k++);
    disconnect(one ,head, k++);
    move([one], "up", 5, k++);
    connect(one, head, false, true, "liner", k++);
    changecolor(one, finished, k++);
}
