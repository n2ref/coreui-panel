$(document).ready(function() {
    $(document).click(function() {
        if ($('.panel-tabs .dropdown.open')[0]) {
            $('.panel-tabs .dropdown.open').removeClass('open');
        }
    });

    $('.panel-tabs .dropdown-toggle').click(function() {
        $(this).parent().toggleClass('open');
        return false;
    });
});