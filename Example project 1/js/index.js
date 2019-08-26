



$(function(){
    $(window).scroll(function() {
        if($(this).scrollTop() >3) {
           
            $('.header-top').addClass('stickytop1');
            $('.logo').addClass('delete-block');
            $('.black-nav-logo-login').addClass('add-block-join');
            $('.black-nav-logo-powered-base').addClass('add-block');
            $('.black-nav-login-table').addClass('max-width-login-table');
            $('.black-nav-phone').addClass('center-for-black-nav');
            $('.black-nav-timetable').addClass('center-for-black-nav');
            $('.black-nav-login').addClass('center-for-black-nav');
 			$('.black-nav-adress').addClass('center-for-black-nav');
 			$('.join').addClass('min-join');
 			$('.btn-menu').addClass('btn-menu-black-nav');

        }
        else{
        	$('.btn-menu').removeClass('btn-menu-black-nav');
            $('.logo').removeClass('delete-block');
            $('.black-nav-logo-login').removeClass('add-block-join');
            $('.black-nav-logo-powered-base').removeClass('add-block');
            $('.header-top').removeClass('stickytop1');
           $('.black-nav-login-table').removeClass('max-width-login-table');
            $('.black-nav-phone').removeClass('center-for-black-nav');
            $('.black-nav-timetable').removeClass('center-for-black-nav');
            $('.black-nav-login').removeClass('center-for-black-nav');
 			$('.black-nav-adress').removeClass('center-for-black-nav');
 			$('.join').removeClass('min-join');


        }
    });
});
				$(window).on('load', function () {
			    $preloader = $('.loaderArea'),
			      $loader = $preloader.find('.loader');
			    $loader.fadeOut();
			    $preloader.delay(350).fadeOut('slow');
			  });

				jQuery(function($) {
			var $SCULPTING = $('.SCULPTING');
			$SCULPTING.on('click', function(event) {
				event.preventDefault();
                $('.about-SCULPTING').addClass('add-block-about');
                $('.SCULPTING').addClass('active');
                $('.RECOVERY').removeClass('active');
                $('.SCULPTING-RECOVERY').removeClass('active');
                $('.about-RECOVERY').removeClass('add-block-about');
                $('.about-SCULPTING-RECOVERY').removeClass('add-block-about');
			});
		});
                jQuery(function($) {
            var $RECOVERY = $('.RECOVERY');
            $RECOVERY.on('click', function(event) {
                event.preventDefault();
                $('.about-SCULPTING').removeClass('add-block-about'); 
                $('.about-RECOVERY').addClass('add-block-about'); 
                $('.about-SCULPTING-RECOVERY').removeClass('add-block-about');
                $('.SCULPTING').removeClass('active');
                $('.RECOVERY').addClass('active');
                $('.SCULPTING-RECOVERY').removeClass('active');
            });
        });
               jQuery(function($) {
            var $SCULPTINGRECOVERY = $('.SCULPTING-RECOVERY');
            $SCULPTINGRECOVERY.on('click', function(event) {
                event.preventDefault();
                $('.about-SCULPTING-RECOVERY').addClass('add-block-about');
                $('.about-SCULPTING').removeClass('add-block-about');
                $('.about-RECOVERY').removeClass('add-block-about');
                $('.SCULPTING').removeClass('active');
                $('.RECOVERY').removeClass('active');
                $('.SCULPTING-RECOVERY').addClass('active');
            });
        });
            jQuery(function($) {
            var $windowTable = $('.black-nav-timetable');
            $windowTable.on('click', function(event) {
                event.preventDefault();
                $('.window-timetable').addClass('add-block-about');
                
            });
        });

//slider

var slideNow = 1;
var slideCount = $('#slidewrapper').children().length;
var slideInterval = 3000;
var navBtnId = 0;
var translateWidth = 0;

$(document).ready(function() {
    var switchInterval = setInterval(nextSlide, slideInterval);

    $('#viewport').hover(function() {
        clearInterval(switchInterval);
    }, function() {
        switchInterval = setInterval(nextSlide, slideInterval);
    });

    $('#next-btn').click(function() {
        nextSlide();
    });

    $('#prev-btn').click(function() {
        prevSlide();
    });

    $('.slide-nav-btn').click(function() {
        navBtnId = $(this).index();

        if (navBtnId + 1 != slideNow) {
            translateWidth = -$('#viewport').width() * (navBtnId);
            $('#slidewrapper').css({
                'transform': 'translate(' + translateWidth + 'px, 0)',
                '-webkit-transform': 'translate(' + translateWidth + 'px, 0)',
                '-ms-transform': 'translate(' + translateWidth + 'px, 0)',
            });
            slideNow = navBtnId + 1;
        }
    });
});


function nextSlide() {
    if (slideNow == slideCount || slideNow <= 0 || slideNow > slideCount) {
        $('#slidewrapper').css('transform', 'translate(0, 0)');
        slideNow = 1;
    } else {
        translateWidth = -$('#viewport').width() * (slideNow);
        $('#slidewrapper').css({
            'transform': 'translate(' + translateWidth + 'px, 0)',
            '-webkit-transform': 'translate(' + translateWidth + 'px, 0)',
            '-ms-transform': 'translate(' + translateWidth + 'px, 0)',
        });
        slideNow++;
    }
}

function prevSlide() {
    if (slideNow == 1 || slideNow <= 0 || slideNow > slideCount) {
        translateWidth = -$('#viewport').width() * (slideCount - 1);
        $('#slidewrapper').css({
            'transform': 'translate(' + translateWidth + 'px, 0)',
            '-webkit-transform': 'translate(' + translateWidth + 'px, 0)',
            '-ms-transform': 'translate(' + translateWidth + 'px, 0)',
        });
        slideNow = slideCount;
    } else {
        translateWidth = -$('#viewport').width() * (slideNow - 2);
        $('#slidewrapper').css({
            'transform': 'translate(' + translateWidth + 'px, 0)',
            '-webkit-transform': 'translate(' + translateWidth + 'px, 0)',
            '-ms-transform': 'translate(' + translateWidth + 'px, 0)',
        });
        slideNow--;
    }
}
