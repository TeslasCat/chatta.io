var path = "http://rebus.0x6c77.co.uk/embed/";


var Rebus = function() {
    // Start loading comments
    this.get();

    // Get comments container
    this.containers = document.querySelectorAll('.rebus-container');

    // Build templates
    this.templates = [];
    this.templates['comment'] = new t("<div class='rebus-comment'><img src='https://www.gravatar.com/avatar/00000000000000000000000000000000'/><div><span class='rebus-since'>12 mins ago</span><h4>Anonymous</h4>{{=comment}}</div></div>");

    // Include styles
    var link = document.createElement("link");
    link.href = path + '/rebus.css';
    link.type = "text/css";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);
};

// Load comments
Rebus.prototype.get = function() {
    var self = this,
        request = new XMLHttpRequest();
    request.open('GET', path + 'get.html', true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = JSON.parse(request.responseText);

            Array.prototype.forEach.call(data.comments, function(comment, i) {
                self.renderComment(comment);
            });

        } else {
            // We reached our target server, but it returned an error
        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
    };

    request.send();
};

// Render comment
Rebus.prototype.renderComment = function(comment) {
    var self = this;

    Array.prototype.forEach.call(self.containers, function(container, i) {
        container.appendChild(self.templates['comment'].render(comment)[0]);
    });
};








/*
         _     _
        | |   (_)
        | |_   _ ___
        | __| | / __|
        | |_ _| \__ \
         \__(_) |___/
             _/ |
            |__/

    t.js
    a micro-templating framework in ~400 bytes gzipped

    @author  Jason Mooberry <jasonmoo@me.com>
    @license MIT
    @version 0.1.0

*/
(function() {

    var blockregex = /\{\{(([@!]?)(.+?))\}\}(([\s\S]+?)(\{\{:\1\}\}([\s\S]+?))?)\{\{\/\1\}\}/g,
        valregex = /\{\{([=%])(.+?)\}\}/g;

    function t(template) {
        this.t = template;
    }

    function scrub(val) {
        return new Option(val).innerHTML.replace(/"/g,"&quot;");
    }

    function get_value(vars, key) {
        var parts = key.split('.');
        while (parts.length) {
            if (!(parts[0] in vars)) {
                return false;
            }
            vars = vars[parts.shift()];
        }
        return vars;
    }

    function render(fragment, vars) {
        return fragment
            .replace(blockregex, function(_, __, meta, key, inner, if_true, has_else, if_false) {

                var val = get_value(vars,key), temp = "", i;

                if (!val) {

                    // handle if not
                    if (meta == '!') {
                        return render(inner, vars);
                    }
                    // check for else
                    if (has_else) {
                        return render(if_false, vars);
                    }

                    return "";
                }

                // regular if
                if (!meta) {
                    return render(if_true, vars);
                }

                // process array/obj iteration
                if (meta == '@') {
                    // store any previous vars
                    // reuse existing vars
                    _ = vars._key;
                    __ = vars._val;
                    for (i in val) {
                        if (val.hasOwnProperty(i)) {
                            vars._key = i;
                            vars._val = val[i];
                            temp += render(inner, vars);
                        }
                    }
                    vars._key = _;
                    vars._val = __;
                    return temp;
                }

            })
            .replace(valregex, function(_, meta, key) {
                var val = get_value(vars,key);

                if (val || val === 0) {
                    return meta == '%' ? scrub(val) : val;
                }
                return "";
            });
    }

    t.prototype.render = function (vars) {
        var div = document.createElement('div');
        div.innerHTML = render(this.t, vars);
        return div.childNodes;
    };

    window.t = t;

})();




new Rebus();