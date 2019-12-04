"use strict";

let $searchForm = $("#search-form");

$searchForm.on("submit", function(event) {
    event.preventDefault();
    let query = $(this).find("[name='search-term']").val().replace(/\s/g, "+");
    getBooks(query);
});

function getBooks(query) {
    let url = 'https://itunes.apple.com/search';
    $.ajax({
        url,
        method: "GET",
        data: `limit=10&entity=musicVideo&term=${query}`,
        dataType: 'json',
        mimeType: 'video/mp4',
        headers: {
            'Access-Control-Allow-Credentials' : true,
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Methods':'GET',
            'Access-Control-Allow-Headers':'application/json',
        },
        contentType: 'application/json',
        responseType:'application/json'
    }).done((response) => {
        $('#slider').filter('.slick-initialized').slick('unslick');
        $('#slider .slide').remove();
        if (response.resultCount > 0) {
            response.results.forEach((element)=> {
                $('#slider').append(`
                    <div class="slide">
                        <video width="400" controls>
                          <source src=${element.previewUrl} type="video/mp4">
                        </video>
                   </div>
               `);
            });
            $('#slider').slick({
                infinite: false,
                slidesToShow: 1,
                slidesToScroll: 1
            });

            $('#slider').on('afterChange', function(){
                if ($('.slick-active').prev().find('video').get(0)) {
                    $('.slick-active').prev().find('video').get(0).pause();
                }
                if ($('.slick-active').next().find('video').get(0)) {
                    $('.slick-active').next().find('video').get(0).pause();
                }
            });
        }
        console.log("response", response);
    }).fail((error) => {
        console.log("error", error);
    });
}
