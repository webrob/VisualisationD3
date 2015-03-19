function ScatterPlot(jsonData) {
    this.jsonData = jsonData;
    this.label = null;
    this.svg = null;
    this.xScale = null;
    this.yScale = null;
    this.radiusScale = null;
    this.colorScale = null;
    this.yearScale = null;
    this.overlay = null;
    this.dot = null;
    this.tip = null;
    this.selectedYear = null;
    this.selectedAgencyName = null;
    this.asterPlot = null;

    var _this = this;

    ScatterPlot.prototype.x = function (d) {
        return d.lifecycleSum;
    };

    ScatterPlot.prototype.y = function (d) {
        return d.projectsCount;
    };

    ScatterPlot.prototype.radius = function (d) {
        return d.daysAmount;
    };

    ScatterPlot.prototype.color = function (d) {
        return d.name;
    };

    ScatterPlot.prototype.key = function (d) {
        return d.name;
    };

    ScatterPlot.prototype.init = function () {
        _this.createPlot();
        _this.initPlotWithData();
    };

    ScatterPlot.prototype.interpolateDataSet = function (year) {
        return _this.jsonData.map(function (d) {
            return {
                name: d.name,
                lifecycleSum: _this.interpolateWithMinValue(d.lifecycleSum, year, 0.1),
                daysAmount: _this.interpolateWithMinValue(d.daysAmount, year, 0),
                projectsCount: _this.interpolateWithMinValue(d.projectsCount, year, 0)
            };
        });
    };

    ScatterPlot.prototype.interpolateWithMinValue = function (values, year, min) {
        var interpolatedValue = min;
        for (var v in values) {
            if (values[v][0] == year) {
                interpolatedValue = values[v][1];
            }
        }
        return interpolatedValue;
    };

    ScatterPlot.prototype.position = function (dot) {
        dot.attr("cx", function (d) {
            var cx = _this.xScale(d.lifecycleSum);
            if (isNaN(cx)) {
                cx = 0.1;
            }
            return cx;
        })
            .attr("cy", function (d) {
                var cy = _this.yScale(_this.y(d));
                if (isNaN(cy)) {
                    cy = 0;
                }
                return cy;
            })
            .attr("r", function (d) {
                var r = _this.radiusScale(_this.radius(d));
                if (isNaN(r)) {
                    r = 0;
                }
                return r;
            });
    };

    ScatterPlot.prototype.mouseover = function () {
        if (!shiftPressed) {
            _this.label.classed("active", true);
            d3.select("#overlayID").classed("overlay", true);
            d3.select("#overlayID").classed("doNotOverlay", false);
        } else {
            _this.label.classed("active", false);
            d3.select("#overlayID").classed("doNotOverlay", true);
            d3.select("#overlayID").classed("overlay", false);
        }

    };

    ScatterPlot.prototype.mouseout = function () {
        _this.label.classed("active", false);
        d3.select("#overlayID").classed("overlay", true);
        d3.select("#overlayID").classed("doNotOverlay", false);
    };

    ScatterPlot.prototype.mousemove = function () {
        if (!shiftPressed) {
            var year = Math.round(_this.yearScale.invert(d3.mouse(this)[0]));
            _this.displayYear(year);
        } else {
            _this.label.classed("active", false);
            d3.select("#overlayID").classed("doNotOverlay", true);
            d3.select("#overlayID").classed("overlay", false);
        }
    };

    ScatterPlot.prototype.tweenYear = function () {
        var year = d3.interpolateNumber(1996, 2013);
        return function (t) {
            var y = year(t);
            _this.displayYear(Math.round(y));
        };
    };

    ScatterPlot.prototype.displayYear = function (year) {
        _this.dot.data(_this.interpolateDataSet(year), _this.key).call(_this.position).sort(_this.order);
        _this.label.text(Math.round(year));
    };

    ScatterPlot.prototype.createPlot = function () {
        var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 69.5},
            width = 1000 - margin.right,
            height = 600 - margin.top - margin.bottom;

        _this.xScale = d3.scale.log().domain([0.1, 1e5]).range([0, width]);
        _this.yScale = d3.scale.linear().domain([0, 150]).range([height, 0]);

        _this.radiusScale = d3.scale.sqrt().domain([0, 120000]).range([0, 40]);
        _this.colorScale = d3.scale.category20();

        var xAxis = d3.svg.axis().orient("bottom").scale(_this.xScale).ticks(12, d3.format(",d")),
            yAxis = d3.svg.axis().scale(_this.yScale).orient("left").ticks(30, d3.format(",d"));

        _this.svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        _this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        _this.svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        _this.svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height - 6)
            .text("lifecycle sum ($M)");

        _this.svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("projects count");


        _this.label = _this.svg.append("text")
            .attr("class", "year label")
            .attr("text-anchor", "end")
            .attr("y", height - 24)
            .attr("x", width)
            .text(1996);

        _this.tip = d3.tip()
            .attr('class', 'd3-scatterTip')
            .offset([0, 0])
            .html(function (d) {
                return d.name  + "<br/>" +
                    "Lifecycle sum: " + d.lifecycleSum + "<br/>" +
                    "Projects count: " + d.projectsCount + "<br/>" +
                    "Days amount: " + d.daysAmount;
            });

        _this.svg.call(_this.tip);
    };

    ScatterPlot.prototype.recreateAsterPlotIfAlreadyExists = function () {
        if (_this.asterPlot != null) {
            scatterPlot.initAsterPlot(_this.selectedYear, _this.selectedAgencyName);
        }
    };

    ScatterPlot.prototype.initAsterPlot = function (year, agencyName) {
        _this.selectedYear = year;
        _this.selectedAgencyName = agencyName;
        var fromMonth = $('#fromMonth').val();
        var toMonth = $('#toMonth').val();

        var url = "php/get_data_for_asterplot.php?year=" + year + "&agencyName=" + agencyName +
            "&fromMonth=" + fromMonth + "&toMonth=" + toMonth;
        $.getJSON(url, function (result) {
            d3.select("#asterPlot").select("svg").remove();

            _this.asterPlot = new AsterPlot(result);
            _this.asterPlot.init();
        });
    };

    ScatterPlot.prototype.initPlotWithData = function () {
        _this.dot = _this.svg.append("g")
            .attr("class", "dots")
            .selectAll(".dot")
            .data(_this.jsonData)
            .enter().append("circle")
            .attr("class", "dot")
            .style("fill", function (d) {
                return _this.colorScale(_this.color(d));

            })
            .call(_this.position)
            .on("mouseenter", function (d, i) {
                var year = _this.label.text();
                var agencyName = d.name;

                $("#asterResults").html(agencyName + " in " + year);

                _this.tip.show(d);
                _this.initAsterPlot(year, agencyName);

            })
            .on("mouseleave", function (d, i) {
                _this.tip.hide();
            })
            .sort(_this.order);

        var box = _this.label.node().getBBox();
        _this.yearScale = d3.scale.linear()
            .domain([1996, 2013])
            .range([box.x + 10, box.x + box.width - 10])
            .clamp(true);

        _this.overlay = _this.svg.append("rect")
            .attr("id", "overlayID")
            .attr("class", "overlay")
            .attr("x", box.x)
            .attr("y", box.y)
            .attr("width", box.width)
            .attr("height", box.height)
            .on("mouseover", _this.enableInteraction);

        _this.svg.transition()
            .duration(15000)
            .ease("linear")
            .tween("year", _this.tweenYear)
            .each("end", _this.enableInteraction);
    };

    ScatterPlot.prototype.order = function (a, b) {
        return _this.radius(b) - _this.radius(a);
    };

    ScatterPlot.prototype.enableInteraction = function () {
        _this.svg.transition().duration(0);
        _this.overlay
            .on("mouseover", _this.mouseover)
            .on("mouseout", _this.mouseout)
            .on("mousemove", _this.mousemove)
            .on("touchmove", _this.mousemove);
    };
}