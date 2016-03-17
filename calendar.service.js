(function (root, factory) {
    var CalendarService = factory();

    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else if (angular && angular.module) {
        angular.module("vj.calendar.service", [])
            .factory("CalendarService", [function () {
                function getInstance (input) {
                    return new CalendarService(input);
                }

                return {
                    getInstance: getInstance
                };
            }]);
    } else {
        root.CalendarService = CalendarService;
    }
}(this, function () {

    function CalendarService (input) {
        this._state = {
            selected: (input instanceof Date) ? input : new Date(),
            current: (input instanceof Date) ? this.util.dateClone(input) : new Date()
        };
    }

    CalendarService.prototype.util = {
        names: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

        getLastDay: function (d) {
            return (new Date(d.getFullYear(), d.getMonth() + 1, 0)).getDate();
        },

        getFirstDayth: function (input) {
            var d = new Date(input);
            d.setDate(1);
            return d.getDay();
        },

        areTheyInSameMonthYear: function (d1, d2) {
            return (d1.getMonth() === d2.getMonth()) && (d1.getFullYear() === d2.getFullYear());
        },

        dateClone: function (d) {
            return new Date(d.getTime());
        }
    };

    CalendarService.prototype.getNames = function () {

        return this.util.names;
    };

    CalendarService.prototype.getSeries = function () {
        var output = [],
            current = this.getCurrentDate(),
            selected = this.getSelectedDate(),
            last = this.util.getLastDay(current),
            firstDayth = this.util.getFirstDayth(current),
            prefix = firstDayth,
            suffix,
            isTodayInCurrentMonth = this.util.areTheyInSameMonthYear(new Date(), current),
            isSelectedInCurrentMonth = this.util.areTheyInSameMonthYear(selected, current),
            today = (new Date()).getDate(),
            selectedDay = selected.getDate();

        while (prefix > 0) {
            output.unshift({
                day: -1,
                dayth: --prefix
            });
        }

        for (var i = 1; i <= last; i++) {
            output.push({
                day: i,
                dayth: (firstDayth++)%7,
                today: (isTodayInCurrentMonth && today === i) ? true : false,
                selected: (isSelectedInCurrentMonth && selectedDay === i) ? true : false
            });
        }

        suffix = firstDayth%7;

         while (suffix > 0 && suffix <= 6) {
            output.push({
                day: -1,
                dayth: suffix++
            });
        }

        return output;
    };

    CalendarService.prototype.getMatrix = function () {
        var output = [],
            series = this.getSeries(),
            rowCount = series.length/7,
            tmpArr;

        for (var i = 0; i < rowCount;  i++) {
            tmpArr = [];
            for (var j = 0; j < 7; j++) {
                tmpArr.push(series[i*7 + j]);
            }
            output.push(tmpArr);
        }

        return output;
    };

    CalendarService.prototype.goTo = function (type, dir) {
        var d = this.getCurrentDate(), moveBy;

        d.setDate(1);

        if (type === "month") {
            moveBy = 1;
        } else if (type === "year") {
            moveBy = 12;
        }

        if (dir === "next") {
            d.setMonth(d.getMonth() + moveBy);
        } else if (dir === "prev") {
            d.setMonth(d.getMonth() - moveBy);
        }

    }

    CalendarService.prototype.getCurrentDate = function () {
        return this._state.current;
    }

    CalendarService.prototype.getSelectedDate = function () {
        return this._state.selected;
    }

    CalendarService.prototype.setSelectedDate = function (day) {
        var d = this.util.dateClone(this.getCurrentDate());
        d.setDate(+day);
        this._state.selected = d;
    }

    return CalendarService;

}));
