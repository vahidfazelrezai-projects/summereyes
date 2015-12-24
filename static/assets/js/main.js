// depends on display-source.js and states.js
$(document).ready(function () {

    // start with no results
    states.noResults();

    // autofocus input field
    $('#url').focus()

    // enter on url input triggers go button click
    $('#url').on('keyup', function (event) {
        if (event.keyCode == 13) {
            $('#go').click();
        }
    });

    // disable "go" while loading
    var loading = false;

    // when go button is clicked...
    $('#go').on('click', function () {

        if (!loading) {

            loading = true;
            states.loading();

            // get url from input field
            var url = $('#url').val();

            // https unsupported because server can't make https calls
            if (url.indexOf('https') === 0) {
                Materialize.toast('Error: HTTPS not supported. Please try a different URL.', 3000);

                loading = false;
                states.noResults();

            } else {

                // accept url with no 'http://' by assuming prefix
                if (url.indexOf('http://') !== 0) {
                    url = 'http://' + url;
                }

                // call server to fetch source from url
                $.get('/source?url=' + url).then(function (data) {
                    // data contains source of given url
                    displaySource(data);

                    loading = false;
                    states.loaded();

                }, function (xhr) {
                    // endpoint error indicates that url request failed
                    Materialize.toast('Error: Page could not be fetched. Please try a different URL.', 3000);

                    loading = false;
                    states.noResults();
                });
            }
        }
    });
});
