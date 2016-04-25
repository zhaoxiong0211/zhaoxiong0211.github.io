var windowWidth = document.getElementById("mainPage").clientWidth
var windowHeight = document.getElementById("mainPage").clientHeight

var stylesheet = (function() {
	// Create the <style> tag
	var style = document.createElement("style");

	// Add a media (and/or media query) here if you'd like!
	// style.setAttribute("media", "screen")
	// style.setAttribute("media", "only screen and (max-width : 1024px)")

	// WebKit hack :(
	style.appendChild(document.createTextNode(""));

	// Add the <style> element to the page
	document.head.appendChild(style);

	return style.sheet;
})();

var button_triggered = false;
var orangeButton = document.getElementsByClassName("button")[0];
var text_detail = document.getElementById("text_detail");
var number_detail = document.getElementById("number_detail");
var powerTitle = document.getElementById("powerTitle");

var disX = 20 * windowWidth / 100 + 40;
var disY = 30 * windowHeight / 100;
var ratioX = windowWidth / 80, ratioY = 0.6*windowHeight / 80;

function button(){
    if(button_triggered==false){
        button_triggered = true
        orangeButton.style.boxShadow = "0 0 0 0 rgba(0, 0, 0, 0.3)";

        // graph part animation
        var transition_basic = "\
                                -webkit-animation-fill-mode:forwards; /*Chrome 16+, Safari 4+*/\
                                -moz-animation-fill-mode:forwards; /*FF 5+*/\
                                -o-animation-fill-mode:forwards; /*Not implemented yet*/\
                                -ms-animation-fill-mode:forwards; /*IE 10+*/\
                                animation-fill-mode:forwards; /*when the spec is finished*/-webkit-animation-delay: 0s, 500ms;\
                                -webkit-animation-duration: 500ms, 500ms;\
                                -webkit-animation-name: translate, scale;";

        var rules_translate = "\
                              0% { -webkit-transform: translate(0px,0px)}\
                              100% { -webkit-transform: translate("+(-disX)+"px,"+(-disY)+"px); }\
                             ";

        var rules_scale =  "\
                              0% { -webkit-transform: translate("+(-disX)+"px,"+(-disY)+"px)}\
                              100% { -webkit-transform: translate("+(-disX)+"px,"+(-disY)+"px) scale("+ratioX+","+ratioY+"); }\
                             ";

        var selector = ".animate";

        ("insertRule" in stylesheet) ? stylesheet.insertRule("@-webkit-keyframes translate" + "{" + rules_translate + "}", 0) : stylesheet.addRule("@-webkit-keyframes translate", rules_translate, 0);
        ("insertRule" in stylesheet) ? stylesheet.insertRule("@-webkit-keyframes scale" + "{" + rules_scale + "}", 0) : stylesheet.addRule("@-webkit-keyframes scale", rules_scale, 0);
        ("insertRule" in stylesheet) ? stylesheet.insertRule(selector + "{" + transition_basic + "}", 0) : stylesheet.addRule(selector, transition_basic, 0);
        orangeButton.classList.add("animate");
        orangeButton.style.borderRadius = 0;


        setTimeout(function() { 
             var powerTitle = document.getElementById("powerTitle");
                powerTitle.style.opacity = 1;
                 draw2()
        }, 1500);  


        // detail part animation

        // text part

        var transition_basic_text = "\
                                -webkit-animation-fill-mode:forwards; /*Chrome 16+, Safari 4+*/\
                                -moz-animation-fill-mode:forwards; /*FF 5+*/\
                                -o-animation-fill-mode:forwards; /*Not implemented yet*/\
                                -ms-animation-fill-mode:forwards; /*IE 10+*/\
                                animation-fill-mode:forwards; /*when the spec is finished*/-webkit-animation-delay: 0s, 500ms;\
                                -webkit-animation-duration: 500ms, 500ms;\
                                -webkit-animation-name: down, up;";

        var rules_down = "\
                              0% { -webkit-transform: translate(0px,0px)}\
                              100% { -webkit-transform: translate(0px,"+(30)+"px); }\
                             ";

        var rules_up =  "\
                              0% { -webkit-transform: translate(0px,"+(30)+"px)}\
                              100% { -webkit-transform: translate(0px,0); }\
                             ";

        var selector_text = ".animate_text";

        ("insertRule" in stylesheet) ? stylesheet.insertRule("@-webkit-keyframes down" + "{" + rules_down + "}", 0) : stylesheet.addRule("@-webkit-keyframes down", rules_down, 0);
        ("insertRule" in stylesheet) ? stylesheet.insertRule("@-webkit-keyframes up" + "{" + rules_up + "}", 0) : stylesheet.addRule("@-webkit-keyframes up", rules_up, 0);
        ("insertRule" in stylesheet) ? stylesheet.insertRule(selector_text + "{" + transition_basic_text + "}", 0) : stylesheet.addRule(selector_text, transition_basic_text, 0);

        text_detail.classList.add("animate_text");

        setTimeout(function() { 
            text_detail.innerHTML = "The last 12 hours average </br> Electricity Consumption";
        },500)

        // number part
    //    number_detail.innerHTML = "92.3 ";

    //    $('#number_detail').animateNumber({ number: 165 });
        var number_dist = 180.9 - 92.3,
            number_dist_unit = number_dist / 100;
    //    for (var i=0;i<100;i++){
    //        setTimeout(function() { 
    //            number_detail.innerHTML = (180.9 - number_dist_unit*i).toFixed(1)
    //        },10)
    //    }
        var count = 0;
        var timer = setInterval(function(){ 
            number_detail.innerHTML = (180.9 - number_dist_unit*count).toFixed(1) + " ";
            count = count + 1;
            if (count == 100){clearInterval(timer);}
        }, 10);
    }
}

function back(){
   if (button_triggered == true){
       button_triggered = false;
       d3.select("#barCanvas").remove();
       powerTitle.style.opacity = 0;
       orangeButton.style.borderRadius = "50%";
       
        var transition_basic_back = "\
                                -webkit-animation-fill-mode:forwards; /*Chrome 16+, Safari 4+*/\
                                -moz-animation-fill-mode:forwards; /*FF 5+*/\
                                -o-animation-fill-mode:forwards; /*Not implemented yet*/\
                                -ms-animation-fill-mode:forwards; /*IE 10+*/\
                                animation-fill-mode:forwards; /*when the spec is finished*/-webkit-animation-delay: 0s, 500ms;\
                                -webkit-animation-duration: 500ms, 500ms;\
                                -webkit-animation-name: scale_back, translate_back;";

        var rules_translate_back = "\
                              100% { -webkit-transform: translate(0px,0px)}\
                              0% { -webkit-transform: translate("+(-disX)+"px,"+(-disY)+"px); }\
                             ";

        var rules_scale_back =  "\
                              100% { -webkit-transform: translate("+(-disX)+"px,"+(-disY)+"px)}\
                              0% { -webkit-transform: translate("+(-disX)+"px,"+(-disY)+"px) scale("+ratioX+","+ratioY+"); }\
                              ";


        var selector_back = ".animate_back";
       
       ("insertRule" in stylesheet) ? stylesheet.insertRule("@-webkit-keyframes scale_back" + "{" + rules_scale_back + "}", 0) : stylesheet.addRule("@-webkit-keyframes scale_back", rules_scale_back, 0);
        ("insertRule" in stylesheet) ? stylesheet.insertRule("@-webkit-keyframes translate_back" + "{" + rules_translate_back + "}", 0) : stylesheet.addRule("@-webkit-keyframes translate_back", rules_translate_back, 0);
        ("insertRule" in stylesheet) ? stylesheet.insertRule(selector_back + "{" + transition_basic_back + "}", 0) : stylesheet.addRule(selector_back, transition_basic_back, 0);
       
       orangeButton.classList.add("animate_back");
       orangeButton.classList.remove("animate");
       
               // detail part animation

        // text part

        var transition_basic_text_back = "\
                                -webkit-animation-fill-mode:forwards; /*Chrome 16+, Safari 4+*/\
                                -moz-animation-fill-mode:forwards; /*FF 5+*/\
                                -o-animation-fill-mode:forwards; /*Not implemented yet*/\
                                -ms-animation-fill-mode:forwards; /*IE 10+*/\
                                animation-fill-mode:forwards; /*when the spec is finished*/-webkit-animation-delay: 0s, 500ms;\
                                -webkit-animation-duration: 500ms, 500ms;\
                                -webkit-animation-name: down_back, up_back;";

        var rules_down_back = "\
                              0% { -webkit-transform: translate(0px,0px)}\
                              100% { -webkit-transform: translate(0px,"+(30)+"px); }\
                             ";

        var rules_up_back =  "\
                              0% { -webkit-transform: translate(0px,"+(30)+"px)}\
                              100% { -webkit-transform: translate(0px,0); }\
                             ";

        var selector_text_back = ".animate_text_back";

        ("insertRule" in stylesheet) ? stylesheet.insertRule("@-webkit-keyframes down_back" + "{" + rules_down_back + "}", 0) : stylesheet.addRule("@-webkit-keyframes down_back", rules_down_back, 0);
        ("insertRule" in stylesheet) ? stylesheet.insertRule("@-webkit-keyframes up_back" + "{" + rules_up_back + "}", 0) : stylesheet.addRule("@-webkit-keyframes up_back", rules_up_back, 0);
        ("insertRule" in stylesheet) ? stylesheet.insertRule(selector_text_back + "{" + transition_basic_text_back + "}", 0) : stylesheet.addRule(selector_text_back, transition_basic_text_back, 0);

       text_detail.classList.remove("animate_text"); 
       text_detail.classList.add("animate_text_back");
//       text_detail.classList.remove("animate_text_back");

        setTimeout(function() { 
            text_detail.innerHTML = "Total Electricity Consumption</br>of Galaxy SOHO";
        },500)

        // number part
    //    number_detail.innerHTML = "92.3 ";

    //    $('#number_detail').animateNumber({ number: 165 });
        var number_dist = 180.9 - 92.3,
            number_dist_unit = number_dist / 100;
    //    for (var i=0;i<100;i++){
    //        setTimeout(function() { 
    //            number_detail.innerHTML = (180.9 - number_dist_unit*i).toFixed(1)
    //        },10)
    //    }
        var count = 0;
        var timer = setInterval(function(){ 
            number_detail.innerHTML = (92.3 + number_dist_unit*count).toFixed(1) + " ";
            count = count + 1;
            if (count == 100){number_detail.innerHTML = 180.7 + " ";clearInterval(timer);}
        }, 10);
       
       orangeButton.style.boxShadow = "0 2px 2px 0 rgba(0, 0, 0, 0.3)";
    }
    
   }
    