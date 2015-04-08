/**
 * Created by bcelii on 3/20/2015.
 */


$(document).keyup(function(e) {

 if (e.keyCode == 27) { //alert("An escape key has been pressed")
    //make sure background is not blurred
     $(".header").css("-webkit-filter","blur(0px)");


     //remove the html added earlier
     var oldHTML = $("body").html();
     //console.log(oldHTML);
     //find where added old html
     var index = oldHTML.indexOf('<div class="userLogin">');
     //console.log("index = " + index);
     if(index >= 0 ){
         $("body").html(oldHTML.substring(0,index-1));
     }


 }   // escape key maps to keycode `27`
 });

$( "#sign" ).click(function(){
    //will blur the current webpage when clicked and show the login page
    //-webkit-filter: blur(5px);
    //alert("Button clicked sign in button");
    $(".header").css("-webkit-filter","blur(5px)");

    //Add in the login info and such...
    var loginHTML = '<div class="userLogin"> \
    <div class="grad"></div> \
    <div class="header2"> \
    <div>Stable<span>Study</span></div> \
    </div> \
    <br> \
    <div class="login"> \
    <input type="text" placeholder="username" name="user"><br> \
    <input type="password" placeholder="password" name="password"><br> \
    <input type="button" value="Login"> \
    </div> \
    </div>'


    $("body").append(loginHTML);

});

