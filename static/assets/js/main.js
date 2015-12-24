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

        if (url.indexOf('https') === 0) {
            Materialize.toast('Error: HTTPS not supported. Please try a different URL.', 3000);
        } else {
            // display loading features
            startLoad();

            // call server to fetch source from url
            $.get('/source?url=' + url).then(function (data) {
                // data contains source of given url
                displaySource(data);

            }, function (xhr) {
                // endpoint error indicates that url request failed
                Materialize.toast('Error: Page could not be fetched. Please try a different URL.', 3000);
                endLoad();
            });
        }

    });

});

// display preloaders
var startLoad = function () {
    $('#tags').empty();
    $('#source').empty();
    $('#tags-preloader').show();
    $('#source-preloader').show();
}

// hide preloaders
var endLoad = function () {
    $('#tags-preloader').hide();
    $('#source-preloader').hide();
}


var displaySource = function (source) {

    var handler = new Tautologistics.NodeHtmlParser.DefaultHandler(function (error, dom) {
        if (error) {
            Materialize.toast('Error: Page could not be parsed. Please try again.', 3000);
            endLoad();
        } else {
            tagList = [];
            string = makePreString(dom, tagList);
            $('#source').html(string);
            displayTags(tagList);
            endLoad();
        }
    }, { ignoreWhitespace: false });

    var parser = new Tautologistics.NodeHtmlParser.Parser(handler);
    parser.parseComplete(source);
}

var makePreString = function (dom, tagList) {
    string = '';

    dom.forEach(function (e) {

        // sanitize input
        if (e.raw) { e.raw = sanitize(e.raw); }
        if (e.name) { e.name = sanitize(e.name); }

        // determine type and process
        if (e.type === 'text') {
            string += e.raw;

        } else if (e.type === 'directive') {
            string += '&lt;' + e.raw + '&gt;';

        } else if (e.type === 'comment') {
            string += '&lt;!--' + e.raw + '--&gt;';

        } else if (e.type === 'script') {
            string += '<span class="tag-script">' + '&lt;' + e.raw + '&gt;' + '</span>';
            // enable if desired: includes scripts as tags
            // tagList.push('script');
            if (e.children) {
                string += makePreString(e.children);
            }
            string += '&lt;/script&gt;';

        } else if (e.type === 'style') {
            string += '<span class="tag-style">' + '&lt;' + e.raw + '&gt;' + '</span>';
            // enable if desired: includes styles as tags
            // tagList.push('style');
            if (e.children) {
                string += makePreString(e.children);
            }
            string += '&lt;/style&gt;';

        } else if (e.type === 'tag') {
            string += '<span class="tag-' + e.name + '">' + '&lt;' + e.raw + '&gt;' + '</span>';
            tagList.push(e.name);
            if (e.children) {
                string += makePreString(e.children, tagList);
                string += '&lt;/' + e.name + '&gt;';
            }
        }
    });

    return string;
}

var sanitize = function (string) {
    return string.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

var displayTags = function (tagList) {

    $('<span>Tags: </span>').appendTo('#tags');

    var uniqueTags = tagList.filter(function (tag, index, list) {
        return (index === list.indexOf(tag));
    });

    uniqueTags.forEach(function (tag) {
        var count = tagList.filter(function (searchTag) {
            return (tag === searchTag);
        }).length;

        var tagDiv = $('<div class="chip"></div>').html(tag + ' (' + count + ')');
        tagDiv.click(function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
                unhighlightTags(tag);
            } else {
                $(this).addClass('selected');
                highlightTags(tag);
            }
        });
        tagDiv.appendTo('#tags');
    });
}

var highlightTags = function (tag) {
    $('#source').children('.tag-' + tag).css('background-color', 'yellow');
    $('#source').children('.tag-' + tag).css('color', 'red');
}

var unhighlightTags = function (tag) {
    $('#source').children('.tag-' + tag).css('background-color', 'white');
    $('#source').children('.tag-' + tag).css('color', 'black');
}
