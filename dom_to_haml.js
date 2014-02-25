// All functions are passed in as args or are in a parent scope!

var walk = (function(indent, walkDom) {
    // walk
    return function(element) {
        var lines = [];
        walkDom(walkDom, element, 0, function(level, text) {
            if (text) {
                lines.push(indent(level) + text);
            }
        });
        return lines;
    };
}(
    // indent
    function(level) {
        var out = "";
        for (var i = 0; i < level; i++) {
            out += "  ";
        }
        return out;
    },
    (function(showTag, showContent){
        // walkDom
        return function(walkDom, element, level, addLine) {
            if (element) {
                if (element.tagName) {
                    addLine(level, showTag(element));

                    for (var i = 0; i < element.childNodes.length; i++) {
                        walkDom(walkDom, element.childNodes[i], level + 1, addLine);
                    }
                } else if (element.textContent) {
                    addLine(level, showContent(element));
                } else {
                    addLine(level, "### what is: " + element);
                }
            } else {
                addLine(level, "### something that was falsey");
            }
        };
    }(
        (function(showId, showClasses, showAttrs) {
            // showTag
            return function(tag) {
                return '%' + tag.tagName.toLowerCase() +
                    showId(tag) + showClasses(tag) + showAttrs(tag);
            };
        }(
            // showId
            function(tag) {
                return tag.id ? '#' + tag.id : '';
            },
            // showClasses
            function(tag) {
                var classes = "";
                for (var i = 0; i < tag.classList.length; i++) {
                    classes += "." + tag.classList[i];
                }
                return classes;
            },
            (function(showAttr) {
                // showAttrs
                return function(tag) {
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
                };
            }(
                // showAttr
                function(attr) {
                    return "'" + attr.name + "': '" + attr.value + "'";
                }
            ))
        )),
        // showContent
        function(tag) {
            return tag.textContent.replace(/^\s+|\s+$/g, '');
        }
    ))
));

var walkRoot = function() {
    return walk(document.getElementsByTagName('html').item(0));
};

var showHaml = function() {
    console.log(walkRoot().join("\n"));
};
