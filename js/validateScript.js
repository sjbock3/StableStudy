/**
 * Created by bcelii on 3/24/2015.
 */


//event listener that will validate the email when hit submit
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

/*$(".loginBut").click(function(){
    alert('clickedLogin');
})*/
$( "#loginButton" ).click(function(){
    //alert('clicked login');
    console.log('made it inside clicked');
    //get the email entered
    var  userName = $('#username');
    if(userName.length) {
        var userEmail = userName.eq(0).val();
        var valid = askDatabaseIfUser(userEmail);
        if (valid != true) {
            $(".incorrect_Login").css("visibility","inherit");
            /*var warning = $(".incorrect_Login");
            if(warning){
                alert("warning got something");
                alert($(".incorrect_Login").css("visibility"));
            }*/

        }
        else {
            //go to the main site
            //alert("Password correct");
            location.href = "http://www.youtube.com";
        }
    }
    else {
        console.log('jquery not find login button');
    }
});


$(".loginBut").click(function(){
    alert('clickedLogin');
});

function askDatabaseIfUser(){
    //alert('askedDatabaseIfUser')
    return false;
}