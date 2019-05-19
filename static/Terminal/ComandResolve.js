function CommandResolve(ss) {
    aa = ss.split("");
    console.log(aa);
    for(var i = 0 ; i < aa.length; i++) {
        if(aa[i] === "(") {
            from = i;
        }
        if(aa[i] === ")") {
            to = i;
        }
    }

    ans =  aa.slice(from+1 , to).join('');

    return ans;

}