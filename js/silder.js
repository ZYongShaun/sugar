$(function () {
    var currentUrl = location.href;
    var navList = $("#nav").find('a');
    navList.first().addClass('nav_current');
    navList.each(function (index, item) {
         if(currentUrl.indexOf(item.href) != -1){
             $(item).addClass('nav_current');
         }
     })
});