function getMissingLetters(str){
    var strLower = str.toLowerCase(); // turn it into lowercase
    var alphabet = "abcdefghijklmnopqrstuvwxyz"; // all alphabets
    var ans = ""
    for (var i = 0; i < 26; i++){
        if (strLower.indexOf(alphabet[i]) == -1){ // see whether it exists
            ans += alphabet[i]
        }
    }
    return ans
}