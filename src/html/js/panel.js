$(document).ready(function() {
    $(document).click(function() {
        if ($('.coreui-panel-tabs .dropdown.open')[0]) {
            $('.coreui-panel-tabs .dropdown.open').removeClass('open');
        }
    });

    $('.coreui-panel-tabs .dropdown-toggle').click(function() {
        $(this).parent().toggleClass('open');
        return false;
    });
});