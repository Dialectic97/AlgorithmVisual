//根据DOM元素的id构造出一个编辑器

var editor;
$(document).ready(function () {
     editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        mode: "text/x-java", //实现Java代码高亮
        lineNumbers: true,
        //theme: "3024-night",
        styleActiveLine: true,
        matchBrackets: true,
        showCursorWhenSelecting: true,
    });

    editor.setSize("100%", 700);

});





