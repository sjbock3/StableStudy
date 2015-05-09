/**
 * Created by Brendan on 4/10/2015.
 */
var dummyClassData = {
    "capacity": null,
    "name": "Brendan's Dorm",
    "external_id": null,
    "extended_info": {
        "rating": "3.0",
        "review_count": "1",
        "orientation": "1st floor; near hughest trig",
        "noise_level": "variable",
        "location_description": "Physics/Astronomy Tower, near H-Bar",
        "has_natural_light": "true",
        "food_nearby": "building",
        "campus": "SMU"
    },
    "uri": "/api/v1/spot/666", /*********Need to change********/
    "available_hours": {
        "monday": [
            ["00:00", "23:59"]
        ],
        "tuesday": [
            ["00:00", "23:59"]
        ],
        "friday": [
            ["00:00", "23:59"]
        ],
        "wednesday": [
            ["00:00", "23:59"]
        ],
        "thursday": [
            ["00:00", "23:59"]
        ],
        "sunday": [
            ["00:00", "23:59"]
        ],
        "saturday": [
            ["00:00", "23:59"]
        ]
    },
    "manager": "",
    "last_modified": "2014-12-01T19:35:17+00:00",
    "etag": "01603d4ae534fbc1b329d1da04f4e8013e545b4d",
    "type": "Outdoor area",
    "images": [{
        "upload_user": "cstimmel",
        "thumbnail_root": "/api/v1/spot/591/image/1324/thumb", /*********Need to change********/
        "modification_date": "2014-07-29T17:10:13+00:00",
        "url": "/api/v1/spot/591/image/1324",
        "upload_application": "spotseeker_admin_1.0",
        "display_index": 0,
        "height": 2000,
        "width": 3008,
        "creation_date": "2012-08-30T10:25:27+00:00",
        "content-type": "image/jpeg",
        "id": 1,
        "description": ""
    }, {
        "upload_user": "cstimmel",
        "thumbnail_root": "/api/v1/spot/591/image/1325/thumb", /*********Need to change********/
        "modification_date": "2014-07-29T17:10:13+00:00",
        "url": "/api/v1/spot/591/image/1325", /*********Need to change********/
        "upload_application": "spotseeker_admin_1.0",
        "display_index": 1,
        "height": 2000,
        "width": 3008,
        "creation_date": "2012-08-30T10:26:00+00:00",
        "content-type": "image/jpeg",
        "id": 2,
        "description": ""
    }],
    "organization": "",
    "display_access_restrictions": "",
    "id": 666,
    "location": {
        "floor": "1st floor",
        "height_from_sea_level": null,
        "room_number": "",
        "longitude": -96.786326,
        "latitude": 32.840536,
        "building_name": "Brendans_Dorm"
    }
};

//return true if raining and false if not raining
function createWeather(){
    //query the weather database
    weatherURL = 'api/index.php/getWeather';
    $.get(weatherURL,function(data){
        data = JSON.parse(data);
        var newData = {};
        newData.temperature = data.temperature;
        if(data.storm == true){
            newData.sky = "Stormy";

        }else{
            newData.sky = "Sunny!";
        }

        if(data.precipitation == true && data.windy == true){
            newData.condition = "Rainy and Windy";
        }else if(data.precipitation == true){
            newData.condition = "Rainy";
        }
        else if(data.windy == true){
            newData.condition = "Windy";
        }
        else{
            newData.condition = "Clear";
        }

        var beforeTemplate_1 = $('#weatherScript').html();
        var Template_1 = Handlebars.compile(beforeTemplate_1);

        var newHTML_1 = Template_1(newData);
        $('#weather_Alert').html(newHTML_1);

        var buttonData = {};
        if(newData.condition == "Clear" && newData.sky == "Sunny!"){
            buttonData.IndoorOutdoor = "Outdoor";
        }
        else{
            buttonData.IndoorOutdoor = "Indoor";
        }

        var beforeTemplate_2 = $('#weatherButtonScript').html();
        var Template_2 = Handlebars.compile(beforeTemplate_2);

        var newHTML_2 = Template_2(buttonData);
        $('#weatherButtonCont').html(newHTML_2);

        $("#weatherButton").click(function(){
            alert('weatherButton clicked');
            console.log('outside indoor/outdoor');
            //clear the filter
            clear_filter();
            console.log('outside indoor/outdoor');
            filterURL = 'api/index.php/search?' ;
            var query = '';
            if(buttonData.IndoorOutdoor == "Indoor"){
                console.log('inside indoor');
                query = 'chairs=0&open_now=1&study_room=1&study_area=1&classroom=1&open=1&lounge=1&outdoor=0&open_space=1&computers=0&whiteboards=0&printers=0&projectors=0&restricted=0';
                    $.get(filterURL+query,function(data){
                    _loadData(JSON.parse(data));
                });
                //check the outdoor spaces

                /*$('#filter_space_types [type="checkbox"]').each(function() {
                    console.log("this.val() = "+ $(this).attr('id'));
                    if($(this ).attr('id') != "outdoor"){
                        console.log('inside indoor checked loop');
                        /*name is not outdoor
                        $(this).prop( "checked" );
                    }

                })*/

            }
            else{
                query = 'chairs=0&open_now=1&study_room=0&study_area=0&classroom=0&open=0&lounge=0&outdoor=1&open_space=0&computers=0&whiteboards=0&printers=0&projectors=0&restricted=0'
                $.get(filterURL+query,function(data){
                    _loadData(JSON.parse(data));
                });
                /*//check all but outdoor spaces
                console.log('inside outdoor');
                $('#outdoor').prop( "checked" );*/

            }
            //call the apply_custom_filter
            //run_custom_search();
            //clear_filter();


        });

    });


}
$(document).ready(function() {

    /*BC_edit*/
    $("#meetingButton").click(function(){
        window.location.href = "meetingForm.html";
    });

    var baseURL = 'http://192.168.33.10';
    //add the user's name in right corner
    var username = getCookie('fName');

    //use handlebars scripts
    var beforeTemplate = $('#userGreeting').html();
    console.log('beforeTemplate = '+beforeTemplate);
    var Template = Handlebars.compile(beforeTemplate);
    var data = {firstName:username};
    var newHTML = Template(data);

    //insert the new HTML
    $('#user_Greet').html(newHTML);

    //will load all the sources from the database
    window._fetchData();
    window._reloadOnIdle();

    //get the weather info
    createWeather();
    /*var rainy = getRainyInfo();
    //get the script for weather alert:
    var beforeTemplate_1 = $('#weatherScript').html();
    var Template_1 = Handlebars.compile(beforeTemplate_1);
    var data_1 = {};
    if(rainy == true){
        data_1 = {
            weatherInfo:"It's Raining Out!",
            IndoorOutdoor: "Indoor"
        }
    }
    else{
        data_1 = {
            weatherInfo:"It's Sunny Out!",
            IndoorOutdoor: "Outdoor"
        }
    }

    var newHTML_1 = Template_1(data_1);
    $('#weather_Alert').html(newHTML_1);*/
    console.log($('#weatherButton').length + ' = weatherButton')
    //add the event handlers
    $("#weatherButton").click(function(){
        alert('weatherButton clicked');
        //clear the filter
        clear_filter();
        if(rainy == true){

            //check the outdoor spaces
            var dummy = true;
            $('#filter_space_types [type="checkbox"]').each(function() {
                if(dummy == true){
                /*name is not outdoor*/
                    this.checkbox();
                }

            })

        }
        else{
            //check all but outdoor spaces
            $('#filter_space_types #outdoor').checkbox();

        }
        //call the apply_custom_filter
        run_custom_search();


    });


    //console.log($('#userGreeting').html());

    /*var data = {
        'email': 'bcelii@smu.edu',
        'password': "parkhill"
    };

    $.post('http://192.168.33.10/api/index.php/loginUser', data, function (passedData) {
        console.log(passedData);
    });*/
    //alert('made inside brendan script');
    //$("#map_canvas").css('background-image', 'url( "../img/google_Maps_Pic")');

    //will make the favorite button link to another page

    var fav_button = $('button#favorite_space');
    fav_button.click(function (e) {

        window.location.href = '/userAccount#favoriteSpaces';
    });

    var fav_button = $('button#favorite_space');
    fav_button.click(function (e) {
        /*make share pope up list*/
        window.location.href = '/userAccount#share';

    });


    //load all the spaces from the initial json stored in the html
    /*window.window.initial_load = true;
    window._reloadOnIdle();*/

    //get all the spaces from the database on initial load
    var AllInfoQuery = 'api/index.php/locinfo';
    $.get(AllInfoQuery,function(allRooms){
        console.log("allRooms type = "+ allRooms);
        window._loadData(JSON.parse(allRooms));

    });

    //at the initial onload of page will get the favorite spaces of the user
    //so when putton is clicked then
    /*var userSpaces = {};
    //get all the favorite spaces for username
    username = getCookie('username');
    console.log('username = '+ username);
    var favQuery = 'api/index.php/favorites?username=' + username;
    var data2 = {
        'username':username
    };


    $.post(favQuery,data2, function(dataReceived){
        userSpaces = JSON.parse(dataReceived);
    });*/


    //click function when hit favorites button:
    $("#favSpaces").click(function() {
        //alert('favButtonClicked');
        var userSpaces = {};
        //get all the favorite spaces for username
        username = getCookie('username');
        console.log('username = '+ username);
        var favQuery = 'api/index.php/getFavorites';
        var data2 = {
            'username':username
        };


        $.post(favQuery,data2, function(dataReceived){
            console.log('dataRecieved from favorites = ' + dataReceived);
            _loadData(JSON.parse(dataReceived));

        });

    });





    //make sure every image loaded as background
   /* $('#info_list').lazyScrollLoading({
        lazyItemSelector: ".lazyloader",
        onLazyItemFirstVisible: function(e, $lazyItems, $firstVisibleLazyItems) {
            $firstVisibleLazyItems.each(function() {
                var $img = $(this);
                console.log('inside lazy item');
                console.log($img);
                var src = $img.data('src');
                $img.css('background', 'transparent url("' + src + '") no-repeat 50% 50%');
                $img.css('background-size','cover');
            });
        }
    });*/

    //makes sure all the pictures will load

    //can change images
    /*setTimeout(function(){
        var dummyBuildings = ["","Brendan's Dorm", "Fondren Library", "Fondren Science"];
        /*console.log("dummyBuildings = " + dummyBuildings);
         window._formatLocationFilter(dummyBuildings);*/

     /*   alert('#BC_listImages length = ' + $('#BC_listImages').length);
        $('#BC_listImages').each(function () {
            alert('inside Brendan replace function');
            var $img = $(this);
            console.log('inside lazy item');
            console.log($img);
            var src = $img.data('src');
            alert('about to set background')
            src = 'http://google.com';

            $img.css('background', 'transparent url("' + src + '") no-repeat 50% 50%');
            $img.css('background-size', 'cover');

        });

    }, 5000);*/




    //go and replace the background image
    //$('.space0detail-list-image .lazyloader').

    setTimeout(function(){
        var dummyBuildings = ["","Brendan's Dorm", "Fondren Library", "Fondren Science"];
        /*console.log("dummyBuildings = " + dummyBuildings);
        window._formatLocationFilter(dummyBuildings);*/

    }, 5000)//mock formatting the building list


    //wait before popping up with the images as if pressed
/*    setTimeout(function (){

        window._showSpaceDetails(dummyClassData);

    }, 10000); // How long do you want the delay to be (in milliseconds)?
*/
});

    //initialize carousel function is what adds the list of images
 /*   function initializeCarousel() {
        $('.carousel').each(function() {
            var $this = $(this);
            $this.carousel({
                interval: false
            });
            var html = '<div class="carousel-nav" data-target="' + $this.attr('id') + '"><ul>';
            for (var i = 0; i < $this.find('.item').size(); i++) {
                html += '<li><a';
                if (i === 0) {
                    html += ' class="active"';
                }
                html += ' href="#">â€¢</a></li>';
            }
            html += '</ul></li>';
            $this.before(html);
            $this.find(".item:first-child").addClass("active");
            if ($this.find('.item').length == 1) {
                $this.find('.carousel-control').hide();
                $this.prev().hide();
            }
        }).bind('slid', function(e) {
            var $nav = $('.carousel-nav[data-target="' + $(this).attr('id') + '"] ul');
            var index = $(this).find('.item.active').index();
            var item = $nav.find('li').get(index);
            $nav.find('li a.active').removeClass('active');
            $(item).find('a').addClass('active');
        });
        $('.carousel-nav a').bind('click', function(e) {
            var index = $(this).parent().index();
            var $carousel = $('#' + $(this).closest('.carousel-nav').data('target'));
            $carousel.carousel(index);
            e.preventDefault();
        });
        resizeCarouselMapContainer();
    }
    window.initializeCarousel = initializeCarousel;
});*/

