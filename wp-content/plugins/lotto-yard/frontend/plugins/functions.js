(function() {
    "use strict";
    jQuery(document).ready(function($) {
        $('.dropdown-menu').click(function(e) {
            e.stopPropagation();
        })

        $('.ddown-cls').click(function(e) {
            alert(e);
        })
    });
}());