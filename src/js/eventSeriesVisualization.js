function EventSeriesVisualization(jsonData, plannedType, markType) {
    this.jsonData = jsonData;
    this.markType = markType;
    this.plannedType = plannedType;
    this.filteredData = null;
    this.graph = null;

    EventSeriesVisualization.prototype.convertJsonDatesToDatesObjects = function () {
        var _this = this;
        for (var i in _this.jsonData) {
            var dates = _this.jsonData[i].dates;
            for (var j in dates) {
                _this.jsonData[i]["dates"][j] = new Date(_this.jsonData[i]["dates"][j]);
                _this.jsonData[i]["Completion_Date_B1"][j] = new Date(_this.jsonData[i]["Completion_Date_B1"][j]);
                _this.jsonData[i]["Planned_Project_Completion_Date_B2"][j] = new Date(_this.jsonData[i]["Planned_Project_Completion_Date_B2"][j]);
            }
        }
        _this.filteredData = $.extend(true, [], _this.jsonData);
    };

    EventSeriesVisualization.prototype.getEventColor = function (datum, i, j) {
        var _this = this;
        var completionDate = _this.filteredData[i]["Completion_Date_B1"][j];
        var plannedDate = _this.filteredData[i]["Planned_Project_Completion_Date_B2"][j];
        var lifecycleCost = _this.filteredData[i]["Lifecycle_Cost"][j];
        var plannedCost = _this.filteredData[i]["Planned_Cost_M"][j];

        var color;

        switch (_this.plannedType) {
            case "compliant" :
                color = 'green';
                break;
            case "more":
                color = 'red';
                break;
            case "all" :
                switch (_this.markType) {
                    case "time":
                        if (isNaN(completionDate.getTime()) || isNaN(plannedDate.getTime())) {
                            color = 'blue';
                        }
                        else if (completionDate > plannedDate) {
                            color = 'red';
                        }
                        else {
                            color = 'green';
                        }
                        break;
                    case "cost":
                        if (lifecycleCost == 0 || plannedCost == 0) {
                            color = 'blue';
                        }
                        else if (lifecycleCost > plannedCost) {
                            color = 'red';
                        }
                        else {
                            color = 'green';
                        }
                        break;
                    case "all":
                        if ((!isNaN(completionDate.getTime()) && !isNaN(plannedDate.getTime()))
                            && lifecycleCost != 0 && plannedCost != 0 &&
                            (lifecycleCost > plannedCost) && (completionDate > plannedDate)) {
                            color = 'red';
                        }
                        else if ((!isNaN(completionDate.getTime()) && !isNaN(plannedDate.getTime()))
                            && lifecycleCost != 0 && plannedCost != 0 &&
                            (lifecycleCost <= plannedCost) && (completionDate <= plannedDate)) {
                            color = 'green';
                        }
                        else {
                            color = 'blue';
                        }
                        break;
                }
                break;
        }


        return color;
    };

    EventSeriesVisualization.prototype.createGraph = function () {
        var _this = this;

        var startDate = $(".start").text();
        if (startDate == "")
        {
            startDate = "1992-12-21";
        }
        var endDate = $(".end").text();
        if (endDate == "")
        {
            endDate = "2013-03-31";
        }

        _this.graph = d3.chart.eventDrops()
            .start(new Date(startDate))
            .end(new Date(endDate))
            .minScale(1)
            .maxScale(1000)
            .eventColor(function (datum, j) {
                var i = $(this).parent().index();
                return _this.getEventColor(datum, i, j);
            })
            .width(1200)
            .margin({top: 100, left: 380, bottom: 40, right: 40})
            .axisFormat(function (xAxis) {
                xAxis.ticks(10);
            })
            .eventHover(function (el) {
                var i = $(el).parent().index();
                var timestamp = d3.select(el).data();

                if (shiftPressed) {
                    var plannedType = $("[name=planned]:checked").val();
                    var markType = $('#markFilter').find("option:selected").attr('value');

                    tableManager.loadNewData(timestamp, _this.filteredData[i].name, plannedType, markType);
                    $("#results").html(" " + _this.filteredData[i].name + " on " + timestamp[0].toStringFormat());
                }
            });

        var element = d3.select('#chart_placeholder').datum(_this.filteredData);
        _this.graph(element);
    };

    EventSeriesVisualization.prototype.init = function () {
        var _this = this;

        _this.convertJsonDatesToDatesObjects();
        _this.createGraph();
    };
}