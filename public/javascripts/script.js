document.addEventListener('DOMContentLoaded', () => {

    console.log('IronGenerator JS imported successfully!');

}, false);

$(".over").mouseover(function() {
    $("#lista").removeClass("none");
    $("#lista").addClass("show");
});

$(".over").mouseout(function() {
    $("#lista").removeClass("show");
    $("#lista").addClass("none");
});