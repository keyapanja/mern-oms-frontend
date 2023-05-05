$(window).on('load', function () {
    $('#sidebarCloseBtn').click(() => {
        $('body').removeClass('sidebar-open');
        $('body').addClass('sidebar-collapse');
    })
})
