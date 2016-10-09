/**
 * Created by shaun on 16/9/26.
 */
var index = {};

index.init = function () {
    this.getArticleList();
    this.pageIndex = 1;
    this.pageSize = 5;
    this.pageCount = 0;
    this.articleList = [];
};

index.bind = function () {
    $('#pagination').find('a').off().on("click", function () {
        index.pageTurning($(this).attr('no'));
    });
};

index.getArticleList = function () {
    $.ajax({
        url: '/resources/articleList.json',
        type: 'GET',
        dataType: 'json',
        data: ""
    }).done(function (articleList) {
        index.articleList = articleList;
        index.pageCount = parseInt(articleList.length / index.pageSize) + (articleList.length % index.pageSize > 0 ? 1 : 0);
        index.render(index.operationArticleList(articleList));
    }).fail(function () {
        console.log("error");
    }).always(function () {
    });
};

index.operationArticleList = function (articleList) {
    var start = (index.pageIndex - 1) * index.pageSize;
    var end = (index.pageIndex * index.pageSize - 1) > articleList.length ? articleList.length : index.pageIndex * index.pageSize;
    return articleList.slice(start, end);
};

index.render = function (articleSubList) {
    var html = "";
    $.each(articleSubList, function (index, item) {
        var temp = '<article><h2 class="title">';
        temp += '<a href="/articles/' + item.link + '">' + item.title + '</a><span>' + item.createTime + '</span></h2>';
        temp += '<ul class="text">' + item.description + '</ul>';
        temp += '<div class="textfoot"><a href="/articles/' + item.link + '" target="_blank">阅读全文</a></div> </article>';
        html += temp;
    });
    html += index.pagination();
    $("#blogitem").empty().html(html);
    index.bind();
};

index.pagination = function () {
    var pageHtml = '<div class="pages" id="pagination">';
    if (index.pageIndex != 1) {
        pageHtml += '<a href="javascript:void(0);" no="pre">&lt;&lt;上一页</a>';
    }
    for (var i = 1; i <= index.pageCount; i++) {
        if (i == index.pageIndex) {
            pageHtml += '<span>' + i + '</span>'
        } else {
            pageHtml += '<a href="javascript:void(0);" no="' + i + '">' + i + '</a>'
        }
    }
    if (index.pageCount > 1) {
        pageHtml += '<a href="javascript:void(0);" no="next">下一页&gt;&gt;</a></div>';
    }
    return pageHtml;
};

index.pageTurning = function (flag) {
    if (flag == 'pre') {
        index.pageIndex--;
    } else if (flag == 'next') {
        index.pageIndex++;
    } else {
        index.pageIndex = parseInt(flag);
    }
    index.render(index.operationArticleList(index.articleList));
    $("body").scrollTop(0);
};

$(function () {
    index.init();
});