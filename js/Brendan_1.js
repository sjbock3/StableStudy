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
function getRainyInfo(){
    //query the weather database

    return true;
}
$(document).ready(function() {
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
    var rainy = getRainyInfo();
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
    $('#weather_Alert').html(newHTML_1);

    //add the event handlers
    $("#weatherButton").click(function(){
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
        window._loadData(JSON.parse(allRooms));
    });

    var userSpaces = {};
    //get all the favorite spaces for username
    username = getCookie('username');
    var favQuery = 'api/index.php/favorites?username=' + username;
    var data2 = {
        'username':username
    };


    $.post(favQuery,data2, function(dataReceived){
        userSpaces = JSON.parse(dataReceived);
    });

    //click function when hit favorites button:
    $("favSpaces").click(function() {
        if (userSpace != []) {
            _loadData(userSpaces)
        }
        else{
            alert('No current saved Favorite spaces');
        }

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
    $('#info_list .lazyloader').each(function(){
        var $img = $(this);
        console.log('inside lazy item');
        console.log($img);
        var src = $img.data('src');
        $img.css('background', 'transparent url("' + src + '") no-repeat 50% 50%');
        $img.css('background-size','cover');

    });

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

