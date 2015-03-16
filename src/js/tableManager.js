function TableManager() {
    this.table = null;

    TableManager.prototype.init = function () {
        var _this = this;
        _this.table = $('#example').DataTable({
            "scrollY": "200px",
            "scrollCollapse": true,
            "paging": false,
            "jQueryUI": true
        });
    };

    TableManager.prototype.loadNewData = function (date, agencyName, plannedType, markType) {
        var newUrl = "php/get_info_with_date.php?Start_Date=" + date[0].toStringFormat() +
            "&Agency_Name=" + agencyName + "&plannedType=" + plannedType + "&markType=" + markType;

        var _this = this;
        _this.table.ajax.url(newUrl).load();
    };
    TableManager.prototype.clearData = function() {
        var _this = this;
        _this.table.clear().draw();
    }

}