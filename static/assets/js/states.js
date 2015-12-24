var states = (function () {
    return {
        loading: function () {
            $('#go').addClass('disabled');
            $('#url').prop('disabled', true);

            $('#result-card').show();

            $('#preloader').show();
            $('#tags').hide();
            $('#divider').hide();
            $('#source-container').hide();

            $('#tags').empty();
            $('#source').empty();
        },
        loaded: function () {
            $('#go').removeClass('disabled');
            $('#url').prop('disabled', false);

            $('#result-card').show();

            $('#preloader').hide();
            $('#tags').show();
            $('#divider').show();
            $('#source-container').show();
        },
        noResults: function () {
            $('#go').removeClass('disabled');
            $('#url').prop('disabled', false);

            $('#result-card').hide();
            $('#preloader').hide();

            $('#tags').empty();
            $('#source').empty();
        }
    }
})();
