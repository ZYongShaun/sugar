$(function () {
    var currentUrl = location.href;
    var navList = $("#nav").find('a');
    navList.first().addClass('nav_current');
    navList.each(function (index, item) {
        if (currentUrl.indexOf(item.href) != -1) {
            $(item).addClass('nav_current');
        } else {
            $(item).removeClass('nav_current');
        }
    });

    $.ajax({
        url: '/imgList.json',
        type: 'GET',
        dataType: 'json',
        data: ""
    }).done(function (articleList) {
        var html = '';
        $.each(articleList, function (index, item) {
            html += '<li><a href="' + item + '"><img src="' + item + '" width="100%" onerror=\'javascript:this.src=\"/images/info/img_miss_out.png\";\'></a></li>';
        });

        $('#woodMarkList').append(html);

        $('#woodMarkList').magnificPopup({
            delegate: 'li:not(.inactive) a',
            type: 'image',
            gallery: {
                enabled: true
            }
        });

        imagesLoaded('#woodMarkList', function () {
            $('#woodMarkList').wookmark({
                align: 'center',
                autoResize: false,
                comparator: null,
                container: $('#woodMarkList'),
                direction: undefined,
                ignoreInactiveItems: true,
                itemWidth: 200,
                fillEmptySpace: false,
                flexibleWidth: 200,
                offset: 15,
                onLayoutChanged: undefined,
                outerOffset: 10,
                possibleFilters: [],
                resizeDelay: 50,
                verticalOffset: undefined
            })
        });
    }).fail(function () {
        console.log("error");
    }).always(function () {
    });
});