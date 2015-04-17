/**
 * Created by bcelii on 3/20/2015.
 */

/*for all of posts should be to
* http://192.168.33.10/api/index.php....and then the resource
* Ex: http://192.168.33.10/api/index.php/loginUser*/

/*var databaseURL = 'http://192.168.33.10/api/index.php';*/
var databaseURL = './api/index.php';


$(document).keyup(function(e) {

 if (e.keyCode == 27) { //alert("An escape key has been pressed")
    //make sure background is not blurred


     //make the element hidden again
     $(".userLogin").css("display","none");
     $(".header").css("-webkit-filter","blur(0px)");


     /*//remove the html added earlier
     var oldHTML = $("body").html();
     //console.log(oldHTML);
     //find where added old html
     var index = oldHTML.indexOf('<div class="userLogin">');
     //console.log("index = " + index);
     if(index >= 0 ){
         $("body").html(oldHTML.substring(0,index-1));
     }
    */


 }   // escape key maps to keycode `27`
 });

$( "#sign" ).click(function(){
    //will blur the current webpage when clicked and show the login page
    //-webkit-filter: blur(5px);
    //alert("Button clicked sign in button");

    $(".header").css("-webkit-filter","blur(5px)");
    $(".userLogin").css("display","block");

    //Add in the login info and such...
    /*var loginHTML = '<div class="userLogin"> \
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


    $("body").append(loginHTML);*/


});

//will handle the login validation when enter email and password
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

/*$(".loginBut").click(function(){
 alert('clickedLogin');
 })*/
$( "#loginButton" ).click(function(){
    //alert('clicked login');
    //console.log('made it inside clicked');
    //get the email entered


    var  userName = $('#username');
    var password = $('#userPassword');
    console.log(password);
    if(userName.length && password.length) {
        console.log('expression ='+ userName.eq(0).val());
        var userEmail = userName.eq(0).val();
        console.log("userEmail = "+ userEmail);

        var userPass = password.eq(0).val();
        console.log("userPass = "+ userPass);
        askDatabaseIfUser(userEmail, userPass);
        /*console.log("valid3 = "+valid);
        if (valid != true) {
            $(".incorrect_Login").css("visibility","inherit");
            //want to clear the fiedls if incorrect
            userName.eq(0).val('');
            password.eq(0).val('');


        }
        else {
            //go to the main site
            //alert("Password correct");
            window.location.href = '/index.html';
        }*/
    }
    else {
        console.log('jquery not find login button');
    }
});


function askDatabaseIfUser(userEmail, password){
    /*var data = {'email':'bcelii@smu.edu',
        'password':"parkhill"};

    $.post('http://192.168.33.10/api/index.php/loginUser',data,function(passedData){
        console.log(passedData);
    });
    */

    console.log(userEmail,password);
    //create the JSON to pass to database
    var data2 = {"email":userEmail,
                "password":password};

    var valid = true;
    /*$.post('http://192.168.33.10/api/index.php/loginUser',data2,function(originalReturn){*/
    $.post('api/index.php/loginUser',data2,function(originalReturn){
        console.log(originalReturn);
        var returnData = JSON.parse(originalReturn);
        console.log(returnData);
        console.log((returnData.status == "Success"));
        console.log((returnData.fName != null));
        console.log((returnData.lName != null));

        if((returnData.status == "Success") && (returnData.fName != null) && (returnData.lName != null)){
            valid = true;
            console.log("valid2 = "+valid);
            //compile all data into arrays
            var names = ["status","fName","lName","school","username"];
            var values = [returnData.status, returnData.fName, returnData.lName, returnData.school, returnData.username]
            setMultipleCookies(names,values);
            console.log(document.cookie);
            window.location.href = '/index.html';
            return true;

        }
        else{
            $(".incorrect_Login").css("visibility","inherit");
            //want to clear the fiedls if incorrect
            var  userName = $('#username');
            var password = $('#userPassword');
            userName.eq(0).val('');
            password.eq(0).val('');


        }
    });
    console.log("valid1 = "+valid);
    return valid;
}
function setMultipleCookies(names,values){
    var counter;
    for(counter = 0;counter<names.length;counter++){
        setCookie(names[counter],values[counter],1);
    }
    //console.log(document.cookie);
}
