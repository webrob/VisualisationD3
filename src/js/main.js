var tableManager;
var shiftPressed = false;
var eventSeriesVisualization;

$(document).ready(function () {
    tableManager = new TableManager();
    tableManager.init();

    $.getJSON("php/get_data.php", function (result) {
        eventSeriesVisualization = new EventSeriesVisualization(result);
        eventSeriesVisualization.init();
    });

    $(window).keydown(function (evt) {
        if (evt.which == 16) {
            shiftPressed = true;
        }
    }).keyup(function (evt) {
        if (evt.which == 16) {
            shiftPressed = false;
        }
    });

    $("input[name=planned]").on("change", function change() {
        var plannedType = $(this).val();
        var markType = $('#markFilter').find("option:selected").attr('value');

        eventSeriesVisualization.filterResults(markType, plannedType);
    });

    $("input[name=cost]").on("change", function change() {

    });

    $('#markFilter').change(function () {
        var plannedType = $("[name=planned]:checked").val();
        var markType = $(this).find("option:selected").attr('value');

        eventSeriesVisualization.filterResults(markType, plannedType);
    });

});


Date.prototype.toStringFormat = function () {
    var day = this.getDate();
    var month = this.getMonth() + 1;
    var year = this.getFullYear();

    if (day < 10) {
        day = '0' + day;
    }

    if (month < 10) {
        month = '0' + month;
    }

    return year + '-' + month + '-' + day;
};

Array.prototype.remove = function (from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};