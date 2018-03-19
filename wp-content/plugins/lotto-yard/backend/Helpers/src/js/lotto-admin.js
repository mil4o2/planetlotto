jQuery(document).ready(function($) {

    $('#wp-admin-bar-button-for-transients a').click(function(e){
        e.preventDefault();
        if (window.confirm("Are you sure?")) {
            localStorage.clear();
            data = {
                action: 'del_transients'
            };

            var jqxhr = $.post(ajaxurl, data, function(response){

            })
            .done(function() {
                alert('Successfully deleted!');
                location.reload();
            })
            .fail(function() {
                alert( "error" );
            })
        }
    });
});
