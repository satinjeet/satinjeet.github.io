var linker = function() {

    var constraints = ["decimal", "number", "email", "regex", "ip", "ipAddress", "custom"];
    
    var constraintRules = {

        number: function(ev) {
            if (!(ev.keyCode >= 48 && ev.keyCode <= 57)) {
                ev.preventDefault();
                return;
            }
        },

        decimal: function(ev) {
            if (!((ev.keyCode >= 48 && ev.keyCode <= 57) || ev.keyCode == 46)) {
                ev.preventDefault();
                return;
            }

            if (String.fromCharCode(ev.keyCode) == '.' && ev.target.value.indexOf('.') >= 0) {
                ev.preventDefault();
                return;
            }
        },

        ip: function(ev) {
            if (!((ev.keyCode >= 48 && ev.keyCode <= 57) || ev.keyCode == 46)) {
                ev.preventDefault();
                return;
            }

            value = ev.currentTarget.value + String.fromCharCode(ev.keyCode);
            values = value.split(".");

            if (values.length > 4) {
                ev.preventDefault();
                return;
            }

            for (var i = 0; i < values.length; i++) {
                var v = values[i];
                var cond = v.length < 1 && i < values.length - 1;

                if (v.length > 3 || (cond)) {
                    ev.preventDefault();
                    return;
                }
            }
        },

        ipAddress: function(ev) {
            return this.ip.apply(this, arguments);
        }

    }

    function bind(element, constraintType) {
        if (constraintRules.hasOwnProperty(constraintType)) {
            element.removeEventListener('keypress', constraintRules[constraintType].bind(constraintRules));
            element.addEventListener('keypress', constraintRules[constraintType].bind(constraintRules));
        }
    }

    function isEligible(element) {
        for (var i = 0; i < constraints.length; i++) {
            val = constraints[i];
            if (element.attributes.hasOwnProperty(val)) {
                bind(element, val);
            }
        }
    }

    function handler(ev){
        var newElement = ev.target;
        if (newElement.nodeName == 'INPUT') {
            isEligible(newElement);
        } else {
            checkElementsIn(newElement);
        }
    }

    function checkElementsIn(root) {
        var inputs = root.querySelectorAll('input');
        for (var i = 0; i < inputs.length; i++) {
            isEligible(inputs[i]);
        }
    }

    document.body.addEventListener('DOMNodeInserted', handler);
    document.body.addEventListener('DOMNodeInsertedIntoDocument', handler);
    checkElementsIn(document);
}


window.addEventListener('load', linker);