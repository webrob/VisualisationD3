function AsterPlot(jsonData) {
    this.jsonData = jsonData;

    var _this = this;

    AsterPlot.prototype.getMaxCost = function () {
        return _this.jsonData[0]['lifecycleCost'];
    };

    AsterPlot.prototype.init = function () {
        $('html, body').animate({
            scrollTop: $("#asterPlot").offset().top
        }, 10);


        var width = 600,
            height = 600,
            radius = Math.min(width, height) / 2,
            innerRadius = 0.5 * radius;

        var pie = d3.layout.pie()
            .sort(null)
            .value(function (d) {
                return d.lifecycleCost;
            });

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([0, 0])
            .html(function (d) {
                return d.data.lifecycleCost;
            });


        var maxCost = _this.getMaxCost();

        var arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(function (d) {
                return 100;//(radius - innerRadius) * (d.data.lifecycleCost / maxCost) + innerRadius;
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
                return "#000000";
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
            .attr("text-anchor", "middle") // text-align: right
            .text("aa");
            //.text(Math.round(score));
    }
}