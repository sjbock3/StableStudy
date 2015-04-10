$(document).ready(function() {
    alert('made inside brendan script');
    $("#map_canvas").css('background-image', 'url( "../img/google_Maps_Pic")');

    //will make the favorite button link to another page

    var fav_button = $('button#favorite_space');
    fav_button.click(function(e) {

        window.location.href = '/userAccount#favoriteSpaces';
    } );

    var fav_button = $('button#favorite_space');
    fav_button.click(function(e) {
        /*make share pope up list*/
        window.location.href = '/userAccount#share';
    } );

    //initialize carousel function is what adds the list of images
    function initializeCarousel() {
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
});

