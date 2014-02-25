var walk = (function() {
    function showId(tag) {
        return tag.id ? '#' + tag.id : '';
    }

    function showClasses(tag) {
        var classes = "";
        for (var i = 0; i < tag.classList.length; i++) {
            classes += "." + tag.classList[i];
        }
        return classes;
    }

    function showAttr(attr) {
        return "'" + attr.name + "': '" + attr.value + "'";
    }

    function showAttrs(tag) {
        var attrList = [];
        for (var i = 0; i < tag.attributes.length; i++) {
            var attr = tag.attributes[i];
            if (attr.name != 'class') {
                attrList.push(showAttr(attr));
            }
        }

        if (attrList.length < 1) {
            return '';
        }

        return '{' + attrList.join(', ') + '}';
    }

    function showTag(tag) {
        return '%' + tag.tagName.toLowerCase() +
            showId(tag) + showClasses(tag) + showAttrs(tag);
    }

    function showContent(tag) {
        return tag.textContent.replace(/^\s+|\s+$/g, '');
    }

    function walkDom(element, level, addLine) {
        if (element) {
            if (element.tagName) {
                addLine(level, showTag(element));

                for (var i = 0; i < element.childNodes.length; i++) {
                    walkDom(element.childNodes[i], level + 1, addLine);
                }
            } else if (element.textContent) {
                addLine(level, showContent(element));
            } else {
                addLine(level, "### what is: " + element);
            }
        } else {
            addLine(level, "### something that was falsey");
        }
    }

    var indents = {0: ""};

    function indent(level) {
        if (!indents.hasOwnProperty(level)) {
            indents[level] = " " + indent(level - 1);
        }
        return indents[level];
    }

    function walk(element) {
        var lines = [];
        function addLine(level, text) {
            if (text) {
                lines.push(indent(level) + text);
            }
        }

        walkDom(element, 0, addLine);

        return lines;
    };

    return walk;
}());

var walkRoot = function() {
    return walk(document.getElementsByTagName('html').item(0));
};

var showHaml = function() {
    console.log(walkRoot().join("\n"));
};
