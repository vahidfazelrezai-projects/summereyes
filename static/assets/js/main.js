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

        // get url from input field
        var url = $('#url').val();

        // call server to fetch source from url
        $.get('/source?url=' + url).then(function (data) {
            // data contains source of given url

            alert('data in console');
            console.log(data);

        }, function (xhr) {
            // endpoint error indicates that url request failed

            alert('Error: page could not be fetched.');

        });

    });

});
