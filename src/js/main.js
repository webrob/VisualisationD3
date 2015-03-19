var tableManager;
var shiftPressed = false;
var eventSeriesVisualization;
var scatterPlot;

$(document).ready(function () {
    initAll();
});

function initAll() {
    initScatterPlot();
    initMonthsSelects();
    initShiftKeyListener();
    initFilterChanges();
    initTableManager();
    getJsonData();
}

function initScatterPlot() {
    $.getJSON("php/get_data_for_scatterplot.php", function (result) {
        scatterPlot = new ScatterPlot(result);
        scatterPlot.init();
    });
}

function initTableManager() {
    tableManager = new TableManager();
    tableManager.init();
}

function initFilterChanges() {
    $("input[name=planned]").on("change", function change() {
        getJsonData();
    });

    $('#markFilter').change(function () {
        getJsonData();
    });
}

function initShiftKeyListener() {
    $(window).keydown(function (evt) {
        if (evt.which == 16) {
            shiftPressed = true;
        }
    }).keyup(function (evt) {
        if (evt.which == 16) {
            shiftPressed = false;
        }
    });
}

function initMonthsSelects() {
    $('#fromMonth').change(function () {
        var fromMonthValue = $(this).val();
        var toMonth = $('#toMonth');
        if (fromMonthValue > toMonth.val()) {
            toMonth.val(fromMonthValue);
        }
        scatterPlot.recreateAsterPlotIfAlreadyExists();
    });

    $('#toMonth').change(function () {
        var toMonthValue = $(this).val();
        var fromMonth = $('#fromMonth');
        if (toMonthValue < fromMonth.val()) {
            fromMonth.val(toMonthValue);
        }

        scatterPlot.recreateAsterPlotIfAlreadyExists();
    });
}

function getJsonData() {
    tableManager.clearData();
    $("#chartResults").html("");
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