function AsterPlot(jsonData) {
    this.jsonData = jsonData;
    this.colorIndex = -1;
    this.colors = ["#9E0041", "#C32F4B", "#E1514B",
        "#F47245", "#FB9F59", "#FEC574",
        "#FAE38C", "#EAF195", "#C7E89E", "#9CD6A4",
        "#6CC4A4", "#4D9DB4", "#4776B4", "#5E4EA1"];

    var _this = this;

    AsterPlot.prototype.getColor = function () {
        _this.colorIndex++;
        if (_this.colorIndex == _this.colors.length) {
            _this.colorIndex = 0;
        }
        return _this.colors[_this.colorIndex];
    };

    AsterPlot.prototype.getMaxCost = function () {
        if ( _this.jsonData.length > 0){
            return _this.jsonData[0]['lifecycleCost'];
        }

    };

    AsterPlot.prototype.init = function () {
        var width = 600,
            height = 600,
            radius = Math.min(width, height) / 2,
            innerRadius = 0.2 * radius;

        var pie = d3.layout.pie()
            .sort(null)
            .value(function (d) {
                return 1;
            });

        var tip = d3.tip()
            .attr('class', 'd3-asterTip')
            .offset([0, 0])
            .html(function (d) {
                return "Project name: " + d.data.projectName + "<br/>" + "<br/>" +
                    "Start date: " + d.data.startDate + "<br/>" + "<br/>" +
                    "Completion date: " + d.data.completionDate + "<br/>" + "<br/>" +
                    "Lifecycle cost: " + d.data.lifecycleCost + "<br/>" + "<br/>" +
                    "Investment title: " + d.data.investmentTitle + "<br/>" + "<br/>" +
                    "Project description: " + d.data.projectDescription;
            });


        var maxCost = _this.getMaxCost();

        var arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(function (d) {
                var len = (radius - innerRadius) * (d.data.lifecycleCost / maxCost) + innerRadius;
                var value = Math.log(len) + len;
                return Math.min(value, radius);
            });

        var outlineArc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(radius);

        var svg = d3.select("#asterPlot").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        svg.call(tip);


        var path = svg.selectAll(".solidArc")
            .data(pie(_this.jsonData))
            .enter().append("path")
            .attr("fill", function (d) {
                return _this.getColor();
            })
            .attr("class", "solidArc")
            .attr("stroke", "gray")
            .attr("d", arc)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        var outerPath = svg.selectAll(".outlineArc")
            .data(pie(_this.jsonData))
            .enter().append("path")
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("class", "outlineArc")
            .attr("d", outlineArc);


        // calculate the weighted mean score
        var score =
            _this.jsonData.reduce(function (a, b) {
                //console.log('a:' + a + ', b.score: ' + b.score + ', b.weight: ' + b.weight);
                return a + (b.score * b.weight);
            }, 0) /
            _this.jsonData.reduce(function (a, b) {
                return a + b.weight;
            }, 0);

        svg.append("svg:text")
            .attr("class", "aster-score")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(_this.getTextInsidePlot());
    };

    AsterPlot.prototype.getTextInsidePlot = function() {
        var text;
        if ( _this.jsonData.length > 0){
            text = _this.jsonData.length;
        } else {
            text = "No data";
        }
        return text;
    };
}