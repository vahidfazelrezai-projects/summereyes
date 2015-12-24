var displaySource = function (source) {

    // create string to be placed inside <pre> tag
    var makePreString = function (dom, tagList) {

        // escape < and >
        var sanitize = function (string) {
            return string.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        // aggregate result into string
        var string = '';

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

    // add chips to #tag with highlighting functionality
    var displayTags = function (tagList) {

        var uniqueTags = tagList.filter(function (tag, index, list) {
            return (index === list.indexOf(tag)); // keep only first occurrence of each tag
        });

        uniqueTags.forEach(function (tag) {
            var count = tagList.filter(function (searchTag) {
                return (tag === searchTag);
            }).length;

            var tagDiv = $('<div class="chip"></div>').html(tag + ' (' + count + ')');
            tagDiv.click(function () {
                // toggle highlighting using selected class
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

        var highlightTags = function (tag) {
            $('#source').children('.tag-' + tag).css('background-color', 'yellow');
            $('#source').children('.tag-' + tag).css('color', 'red');
        }

        var unhighlightTags = function (tag) {
            $('#source').children('.tag-' + tag).css('background-color', 'white');
            $('#source').children('.tag-' + tag).css('color', 'black');
        }
    }

    var handler = new Tautologistics.NodeHtmlParser.DefaultHandler(function (error, dom) {
        if (error) {
            Materialize.toast('Error: Page could not be parsed. Please try again.', 3000);
            endLoad();
        } else {
            tagList = [];
            $('#source').html(makePreString(dom, tagList));
            displayTags(tagList);
        }
    });

    var parser = new Tautologistics.NodeHtmlParser.Parser(handler);
    parser.parseComplete(source);
}
