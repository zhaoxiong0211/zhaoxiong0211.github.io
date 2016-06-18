function printSubsets(list, length){
    if(list.length == 0 || list.length < length){ // check whether input is legal
        alert("Please check your input.")
    }
    else{ 
        var unique = [] // find unique inputs
        for (var i=0; i<list.length; i++)
        {
            if (unique.indexOf(list[i]) == -1){
                unique.push(list[i]);
            }
        }
        if (length == 1){ //special case: length == 1
            unique.forEach(function(d){
              console.log(d)
            })
        }
        else if(length == unique.length){ // special case: length == unique.length
            console.log(unique.join(" "))
        }
        else if(length > unique.length){ // if length > unique.length, illegal
            alert("Please check your input.")
        }
        else{ // normal case
            unique = unique.join(""); //turn array into string to make it easier to process
            var ansList = helper([],unique,[], length); // call helper function
            ansList.forEach(function(d){ // print
                console.log(d.split("").join(" "))
            })
        }
    }
}

function helper(current, rest, ans, length){
    if (current.length == length){ //if we get the length we want
        ans.push(current)
    }
    else if(rest.length == 0){ // if no more elements in rest
        return
    }
    else{
        helper(current+rest[0], rest.slice(1), ans, length) // if we have next one in ans
        helper(current, rest.slice(1), ans, length) // if we dont have next one in ans
    }
    return ans
}