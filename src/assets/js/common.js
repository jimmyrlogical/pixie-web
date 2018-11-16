if(window.location.href.split('/')[4] == 'index'){
    console.log('index page load .. .. !! !!');
    setIndex();
}else if(window.location.href.split('/')[4] == 'login'){
    console.log('login page load .. .. !! !!');
    setLogin();
} else if(window.location.href.split('/')[4] == 'setting'){
    console.log('setting page load .. .. !! !!');
    setSetting();
} else if(window.location.href.split('/')[4] == 'dashboard') {
    console.log('dashboard page load .. .. !! !!');
    setDashboard();
}

function setDashboard() {
    $('.cm_select').select2({
        minimumResultsForSearch: -1
      });
      $(".drop_toggle").click(function(){        
          $(this).next('.drop_menu').toggleClass('opONE');
      });
      $(".content").mCustomScrollbar({
          theme:"dark"
      });
  
      $(".bar_icon").click(function(){    	
          $('body').toggleClass('navSmall');            
      });
}   
function setSetting() {
    $('.cm_select').select2({
        minimumResultsForSearch: -1
   });
   $(".drop_toggle").click(function(){        
       $(this).next('.drop_menu').toggleClass('opONE');
   });
   $(".content").mCustomScrollbar({
       theme:"dark"
   });
    $(".bar_icon").click(function(){        
        $('body').toggleClass('navSmall');    
    });
}
function setLogin(){
    var hgt = $(window).height();
    $(".ad_hEight").css("height", hgt);
    $(".inner_img_randow_change img").css("height", hgt);
    var log_hght = $(".logo_login_main").height() + 60;
    var theight = hgt - log_hght;
    var countheight = $(".login_box_mnc").height();
    var totlHeight = theight - countheight;
    $(".login_box_mnc").css("padding-top", (totlHeight / 2) - 50);
    
    $(window).resize(function() {
        var hgt = $(window).height();
        $(".ad_hEight").css("height", hgt);
        $(".inner_img_randow_change img").css("height", hgt);
        var log_hght = $(".logo_login_main").height() + 60;
        var theight = hgt - log_hght;
        var countheight = $(".login_box_mnc").height();
        var totlHeight = theight - countheight;

        $(".login_box_mnc").css("padding-top", (totlHeight / 2) - 50);
    });

}
function setIndex(){

    $('.testi_slider').owlCarousel({
        dots: true,
        loop: true,
        margin: 10,
        nav: false,
        responsiveClass: true,
        responsive: {
          0: {
            items: 1
          },
          599: {
            items: 1
          },
          600: {
            items: 2                    
          },
          1000: {
            items: 3,                    
            loop: true,
            margin: 15
          }
        }
      })
}
