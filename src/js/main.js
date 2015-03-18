var tableManager;
var shiftPressed = false;
var eventSeriesVisualization;

$(document).ready(function () {
    tableManager = new TableManager();
    tableManager.init();


    $.getJSON("php/get_second_vis_data.php", function (result) {
        var scatterPlot = new ScatterPlot(result);
        scatterPlot.init();
    });


    getJsonData();

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
        getJsonData();
    });

    $('#markFilter').change(function () {
        getJsonData();
    });

});

function getJsonData() {
    tableManager.clearData();
    $("#results").html("");
    var plannedType = $("[name=planned]:checked").val();
    var markType = $('#markFilter').find("option:selected").attr('value');

    var url = "php/get_data.php?plannedType=" + plannedType + "&markType=" + markType;

    $.getJSON(url, function (result) {
        eventSeriesVisualization = new EventSeriesVisualization(result, plannedType, markType);
        eventSeriesVisualization.init();
    });
}


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