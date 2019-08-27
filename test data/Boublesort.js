let AC = []
let pos  = 0;
let code  =  parent.$("#Code")[0].contentWindow;
let is_stop = false;
function init(list) {
    let k = 0;
    let first = rectangle(15,15, 3, 2.5, list[0],list[0])
    let max = 20 + first.height;
    draw(first, normal, "liner", k++);
    let  pre = first ;
    for(let i = 1;  i < list.length; i++) {
            let one = RelativeCreate(pre, 2.5, list[i], "right", 3, list[i]);
            draw(one, normal, "liner", k++);
            pre = one;
    }
    for(let i = 0; i < list.length -1; i++) {
        for(let j = 0; j  < list.length - i ; j++) {
             if(list[j]  > list[j+1]) {
                 let temp = list[j];
                 list[j] = list[j+1];
                 list[j+1] = temp;
                 AC.push({i: j, j: j+1});
             }
        }
    }
    text = code.$("#codesave").val();
    code.editor.setValue(text)
    //.setValue(code.$("codesave").value);
	return 0;
}
function step(flag){
    if(flag == 1 && pos == AC.length) return 0;
    if(flag == -1 && pos == 0) return 0;
    let k = 0;
    if(flag == -1) pos--;
    first = AC[pos].i;
    second = AC[pos].j;
    changecolor(object_shapes[first], reading, k);
    changecolor(object_shapes[second], reading, k++)
    if(flag == 1) {
        move([object_shapes[first]], "right", 3, k);
        move([object_shapes[second]], "left", 3, k++);
    } else {
        move([object_shapes[first]], "right", 3, k);
        move([object_shapes[second]], "left", 3, k++); 
    }
    changecolor(object_shapes[first], normal, k);
    changecolor(object_shapes[second], normal, k++)
    swap(first, second);
    if(flag == +1) pos++;
    UpdatePro(pos-1);
	return 0;
}
function Auto(){
    is_stop = false;
    temp();
	return 0;
}
function temp() {
    setTimeout(() => {
        if(pos == AC.length) {
            for(let i = 0; i < object_shapes.length; i++) 
                changecolor(object_shapes[i], finished , 0);
            for(let i = 0; i < object_shapes.length; i++) 
                changecolor(object_shapes[i], normal , 0.5);
            return false;
        } 
        if(is_stop) return false;
        code.editor.setCursor(7);
        setTimeout(() => {
            code.editor.setCursor(9); 
        }, 500);
        step(1);
        if(temp() == false) return false;
        //temp()
    }, 2000);
}
function UpdatePro(State) {
    var speed = 100 /(AC.length - 1) * State;
    parent.$("#pro").css({ "width": speed.toString() + "%"});
}


function stop() {
    is_stop = true;
}

let code_ = "\nvoid\nbubble_sort(int\na[],\nint\nn)\n\n{\n\nint\ni,\nj,\ntemp;\n\nfor\n(j\n=\n0;\nj\n<\nn\n-\n1;\nj++)\n\nfor\n(i\n=\n0;\ni\n<\nn\n-\n1\n-\nj;\ni++)\n\n{\n\nif(a[i]\n>\na[i\n+\n1])\n\n{\n\nswap(a[j],a[j+1]);\n\n}\n\n}\n\n}\n"
let Sync  = [3,0,0,0,0,0,8];
