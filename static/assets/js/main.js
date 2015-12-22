$(document).ready(function () {

    // autofocus input field
    $('#url').focus()

    // enter on url input triggers go button click
    $('#url').on('keyup', function (event) {
        if (event.keyCode == 13) {
            $('#go').click();
        }
    });


    // when go button is clicked...
    $('#go').on('click', function () {

        // display loading features
        startLoad();

        // get url from input field
        var url = $('#url').val();

        // call server to fetch source from url
        $.get('/source?url=' + url).then(function (data) {
            // data contains source of given url

            endLoad();
            displaySource(data);

        }, function (xhr) {
            // endpoint error indicates that url request failed

            Materialize.toast('Error: Page could not be fetched. Please try a different URL.', 3000);

        });

    });

});

// display preloaders
var startLoad = function () {
    $('#summary-preloader').show();
    $('#source-preloader').show();
}

// hide preloaders
var endLoad = function () {
    $('#summary-preloader').hide();
    $('#source-preloader').hide();
}

//
var displaySource = function (source) {

    $('#source').html(escape(source));

    // Materialize.showStaggeredList('#summary-list'); // transition
}
