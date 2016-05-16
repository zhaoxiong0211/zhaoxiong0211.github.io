String.prototype.replaceAt=function(index, c) { // char replace function
    return this.substr(0, index) + c + this.substr(index+c.length);
}

function animateGenerator(initString, indexes){ // generate the result string
    keys = ["left", "right"];
    for (var i = 0; i < 2; i++){
        curKey = indexes[keys[i]];
        for (var j = 0 ; j < Object.keys(curKey).length ; j++){
            initString = initString.replaceAt(curKey[Object.keys(curKey)[j]], "X");
        }
    }
    return initString;  
}

function animate(speed, str, ans){
    if (speed <= 0 || speed > 10){
        return alert("Your speed input is out of range, please make it beteen 1 and 10.")
    }
    if (str.length <=0 || str.length > 50) {
        return alert("Your string length is out of range, please make it beteen 1 and 50.")
    }
    ans = ans || {};
    len = str.length;
    keys = ["left", "right"];
    if (ans["indexes"] == undefined) { // initial ans object for the first time
        ans.indexes = {"right" : {}, "left" : {}};
        ans.initString = Array.apply(null,{length: len}).map(function() { return "."; }).join("");
        ans.result = [];
        for (var i = 0; i < str.length ; i++){
            if (str[i] == "R") ans.indexes.right["R" + i] = i;
            else if (str[i] == "L") ans.indexes.left["L" + i] = i;
        }
    }
    else { // not the first time
        if(Object.keys(ans.indexes.left).length == 0 && Object.keys(ans.indexes.right).length == 0){ // if this is the end
//            console.log(ans.result)
            return ans.result;
        }
        else{ // renew indexes
            for (var i = 0; i < 2; i++){
                curKey = ans.indexes[keys[i]];
                insideKeys = Object.keys(curKey)
                for (var j = 0 ; j < insideKeys.length ; j++){
                    curKey[insideKeys[j]] = keys[i] == "right" ? (curKey[insideKeys[j]] + speed) : (curKey[insideKeys[j]] - speed);
                    if (curKey[insideKeys[j]] < 0 || curKey[insideKeys[j]] >= len){
                        delete curKey[insideKeys[j]];
                    }
                }
            }
        }
    }
//    setTimeout(function(){
//        console.log(animateGenerator(ans.initString, ans.indexes))
        ans.result.push(animateGenerator(ans.initString, ans.indexes))
        return animate(speed, str, ans);
//    },1000)
}

var a = animate(1, "LRRL.L")
console.log(a)