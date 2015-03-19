function TableManager() {
    this.table = null;
    var _this = this;

    TableManager.prototype.init = function () {
        _this.table = $('#tableData').DataTable({
            "scrollY": "200px",
            "scrollCollapse": true,
            "paging": false,
            "jQueryUI": true
        });
    };

    TableManager.prototype.loadNewData = function (date, agencyName, plannedType, markType) {
        var newUrl = "php/get_info_with_date.php?Start_Date=" + date[0].toStringFormat() +
            "&Agency_Name=" + agencyName + "&plannedType=" + plannedType + "&markType=" + markType;

        _this.table.ajax.url(newUrl).load();
    };
    TableManager.prototype.clearData = function() {
        _this.table.clear().draw();
    }
}