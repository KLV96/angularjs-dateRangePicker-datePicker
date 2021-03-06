var calendarApp = angular.module('calendarApp', []);
calendarApp.controller('calendarController', function($scope)
{

    // Variables that can be changed
    var maxNumberOfMonths = 12;
    var bookingOnTheSameDayAllowed = true;
    $scope.singleDatePickerAllowed = false;



    var todayDate = new Date();
    var currentMonth  = new Date().getMonth();
    var IsfirstRangeIsChosen = false;
    var numOflicks = 0;

    if($scope.singleDatePickerAllowed)
    {
        $scope.startDate = 'Select Date';
    }
    else
    {
        $scope.startDate = 'Start Date';
    }

    $scope.endDate   = 'End Date';
    $scope.startWeekDay = '';
    $scope.endWeekDay = '';

    $scope.currentYear   = new Date().getFullYear();
    $scope.todayDateOfTheMonth = todayDate.getUTCDate();
    $scope.currentMonth = todayDate.getMonth();
    $scope.months        = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    $scope.NextMaxNumOfMonths = new Array();
    $scope.enableSaveBtn = false;

    var weekDays = new Array("Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat");
    var monthsAbbreviation = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec");

    var detailsOfFirstNumberClicked =
    {
        id: 0,
        month: todayDate.getMonth(),
        year: new Date().getFullYear(),
    }

    var detailsOfSecondNumberClicked =
    {
        id: 0,
        month: todayDate.getMonth(),
        year: new Date().getFullYear(),
    }

    const month =
    {
      monthName: '',
      year: new Date().getFullYear(),
      numberOfDays: 31,
      numberOfGapDays: 0
    };

    function addzeroIfDayOneDegit(day)
    {
        if(day.length == 1 )
        {
            day = "0" + day;
        }

        return day;
    }


    function createNextMaxNumOfMonths(currentMonth)
    {
        for(var i=0; i < maxNumberOfMonths; i++)
        {
            var incrementedCurrentMonth = currentMonth + i;
            const nextMonth = Object.create(month);

            populateMonth(nextMonth,getMonthName(incrementedCurrentMonth),
                                    getYearForMonth(incrementedCurrentMonth),
                                    getNumberOfDays(getYearForMonth(incrementedCurrentMonth),getIndexForNextMonth(incrementedCurrentMonth)+1),
                                    getNumberOfGapDays(getYearForMonth(incrementedCurrentMonth),getIndexForNextMonth(incrementedCurrentMonth)+1)
                         );
        }
    }

    function getIndexForNextMonth(incrementedCurrentMonth)
    {
        if(incrementedCurrentMonth > 11)
        {
            return incrementedCurrentMonth -12;
        }
        else
        {
            return incrementedCurrentMonth;
        }

    }

    function getMonthName(monthIndex)
    {
        if(monthIndex > 11)
        {
            return $scope.months[monthIndex-12];
        }
        else
        {
            return $scope.months[monthIndex];
        }
    }


    function getYearForMonth(monthIndex)
    {
        if(monthIndex <= 11)
        {
            return new Date().getFullYear();
        }
        else
        {
            return new Date().getFullYear() +1;
        }
    }

    function getNumberOfDays (year,month)
    {
        return new Date(year, month, 00).getDate();
    }


    function populateMonth(monthObject,monthName,year,numberOfDays,numberOfGapDays)
    {
        monthObject.monthName = monthName;
        monthObject.year = year;
        monthObject.numberOfDays = numberOfDays;
        monthObject.numberOfGapDays = numberOfGapDays;
        ($scope.NextMaxNumOfMonths).push(monthObject);
    }

    function getNumberOfGapDays(year,month)
    {
        var IndexFordayOfTheWeek = new Date(year + "-" + month + "-01").getDay();
        IndexFordayOfTheWeek = (IndexFordayOfTheWeek===0) ? 7 : IndexFordayOfTheWeek
        return IndexFordayOfTheWeek-1;
    }

    function setYearMonthDateOfClickedItem(passedID, numOfClicks)
    {
        var partsOfID = passedID.split('-');
        if(numOfClicks == 1)
        {
            detailsOfFirstNumberClicked.id = parseInt(partsOfID[2]);
            detailsOfFirstNumberClicked.month = partsOfID[1];
            detailsOfFirstNumberClicked.year = parseInt(partsOfID[0]);
        }
        else if (numOfClicks == 2)
        {
            detailsOfSecondNumberClicked.id = parseInt(partsOfID[2]);
            detailsOfSecondNumberClicked.month = partsOfID[1];
            detailsOfSecondNumberClicked.year = parseInt(partsOfID[0]);
        }
    }

    function getYearMonthDateFromID(id)
    {
        var seperatedIDDetails = id.split('-');
        return seperatedIDDetails;
    }

    function getMonthIndex(mon)
    {
       return new Date(Date.parse(mon +" 01, 2018")).getMonth()+1;
    }

    function checkIfDateAvialable(eventTargetID)
    {
        var idDetails = getYearMonthDateFromID(eventTargetID);

        idDetails[1] =  getMonthIndex(idDetails[1]);
        var selectedDate = new Date((idDetails[0] + ',' + idDetails[1] + ',' + addzeroIfDayOneDegit(idDetails[2])).replace(/,/g,"/") );
        console.log("here we are " + (idDetails[0] + ',' + idDetails[1] + ',' + addzeroIfDayOneDegit(idDetails[2])).replace(/,/g,"/"));
        var stringOfToday =  todayDate.getFullYear() + "-" + $scope.months[todayDate.getMonth()] + "-" + todayDate.getDate();
        var todayElement = document.getElementById(stringOfToday);
        console.log("selected day is " + selectedDate);
        console.log("today element is " + todayElement);

        if( selectedDate > todayDate)
        {
            if(numOflicks%2 != 0 )
            {
                if(!checkIfRangeAvailable(idDetails))
                {
                    // $scope.clear();
                    numOflicks = 0;
                    return true;
                }

                if( detailsOfFirstNumberClicked.id > selectedDate.getDate() &&
                    getMonthIndex(detailsOfFirstNumberClicked.month)-1 >= (selectedDate.getMonth()) &&
                    detailsOfFirstNumberClicked.year >= selectedDate.getFullYear() )
                    {
                        numOflicks = 0;
                        return true;
                    }
            }
            return true;
        }
        else if (   selectedDate.getDate() == todayDate.getDate() &&
                    selectedDate.getMonth() == todayDate.getMonth() &&
                    selectedDate.getYear() == todayDate.getYear())
        {

            if(numOflicks%2 != 0 )
            {
                numOflicks = 0;
                return bookingOnTheSameDayAllowed;
            }
            return bookingOnTheSameDayAllowed;

        }
        else
        {

            $scope.clear();
            numOflicks = 0;
            return false;
        }

    }

    function checkIfRangeAvailable(secondSelectedItem)
    {

        if( getMonthIndex(detailsOfFirstNumberClicked.month) > secondSelectedItem[1] &&
            detailsOfFirstNumberClicked.year == secondSelectedItem[0])
        {
            return false;
        }
        else if (detailsOfFirstNumberClicked.year > secondSelectedItem[0] )
        {
            return false;
        }

        return true;
    }

    function checkWhichItemIsClicked(event, numOflicks)
    {
        if($(event.target).hasClass('numberContainer'))
        {
            return 'container';
        }
        else if($(event.target).hasClass('number'))
        {
            return "number";
        }
    }

    function hightLightNumbersInBetween()
    {

        var numberContainers = document.querySelectorAll('[class^=numberContainer]');
        var indexOfFirstMonthClicked = getMonthIndex(detailsOfFirstNumberClicked.month);
        var indexOfSecondMonthclicked = getMonthIndex(detailsOfSecondNumberClicked.month);

        if(detailsOfSecondNumberClicked.year != detailsOfFirstNumberClicked.year)
        {
            indexOfSecondMonthclicked = parseInt(indexOfSecondMonthclicked) + 12;
        }
        var numberOfMonthsInBetween = indexOfSecondMonthclicked - indexOfFirstMonthClicked;


        for(var i=0; i < numberContainers.length; i++)
        {
            var idDetails = getYearMonthDateFromID(numberContainers[i].id);

            if( parseInt(idDetails[2]) > detailsOfFirstNumberClicked.id &&
                parseInt(idDetails[2]) <= detailsOfSecondNumberClicked.id &&
                detailsOfFirstNumberClicked.month == detailsOfSecondNumberClicked.month &&
                idDetails[1] === detailsOfFirstNumberClicked.month  )
            {
                numberContainers[i].classList.add("numberSelected");
            }

            if(detailsOfFirstNumberClicked.month != detailsOfSecondNumberClicked.month)
            {
                if(idDetails[1] == detailsOfFirstNumberClicked.month && parseInt(idDetails[2]) > detailsOfFirstNumberClicked.id)
                {
                    numberContainers[i].classList.add("numberSelected");
                }

                if(idDetails[1] == detailsOfSecondNumberClicked.month && parseInt(idDetails[2]) < detailsOfSecondNumberClicked.id)
                {
                    numberContainers[i].classList.add("numberSelected");
                }


                if(numberOfMonthsInBetween != 1 && getMonthIndex(idDetails[1]) > indexOfFirstMonthClicked &&  getMonthIndex(idDetails[1]) < indexOfSecondMonthclicked )
                {
                    numberContainers[i].classList.add("numberSelected");
                }
            }

        }


        console.log("second month index : " + indexOfSecondMonthclicked);
        console.log("first month index : " + indexOfFirstMonthClicked);
        highLightGapDays(numberOfMonthsInBetween-1);


    }

    function highLightGapDays(numberOfMonths)
    {

        if(numberOfMonths>=0)
        {
            var starGapDays = detailsOfSecondNumberClicked.year + '-' + detailsOfSecondNumberClicked.month + '-' + 'start';
            var endGapDays = detailsOfFirstNumberClicked.year + '-' + detailsOfFirstNumberClicked.month + '-' + 'end';

            var starGapDaysElements = document.querySelectorAll("[class~='" + starGapDays + "']");
            var endGapDaysElements = document.querySelectorAll("[class~='" + endGapDays + "']");

            for(var i=0; i < starGapDaysElements.length; i++)
            {
                starGapDaysElements[i].classList.add("gapDayBg");
            }

            for(var i=0; i < endGapDaysElements.length; i++)
            {
                endGapDaysElements[i].classList.add("gapDayBg");
            }

            console.log("passed: " + numberOfMonths);
            for(var i=0; i<numberOfMonths; i++)
            {
                console.log("running");
                console.log($scope.months[getMonthIndex(detailsOfFirstNumberClicked.month)+i]);
                var startGapDays = detailsOfFirstNumberClicked.year + '-' + $scope.months[getMonthIndex(detailsOfFirstNumberClicked.month)+i] + '-' + 'start';
                var endGapDays = detailsOfFirstNumberClicked.year + '-' + $scope.months[getMonthIndex(detailsOfFirstNumberClicked.month)+i] + '-' + 'end';
                console.log(startGapDays);
                console.log(endGapDays);
                var startgapDaysElements = document.querySelectorAll("[class~='" + startGapDays + "']");
                var endgapDaysElements = document.querySelectorAll("[class~='" + endGapDays + "']");

                for(var j=0; j < startgapDaysElements.length; j++)
                {
                    startgapDaysElements[j].classList.add("gapDayBg");
                }

                for(var z=0; z < endgapDaysElements.length; z++)
                {
                    endgapDaysElements[z].classList.add("gapDayBg");
                }

            }
        }

    }

    function addClassToQuerySelector(selector,className)
    {
        for (int =0; i < selector.length;i++)
        {
            selector[i].classList.add(className);
        }
    }

    function highlightItemNumber(item, numOflicks)
    {

        if($scope.singleDatePickerAllowed)
        {
            item.classList.add("numberSelected");
            return;
        }

        item.classList.add("numberSelected");
        if(numOflicks%2 != 0)
        {
            setYearMonthDateOfClickedItem(item.id,1);
            item.classList.add("firstNumberSelected");
            item.classList.add("secondNumberSelected");
        }
        else if(numOflicks%2 == 0)
        {
            setYearMonthDateOfClickedItem(item.id,2);
            var firstElement = document.querySelectorAll('.firstNumberSelected.secondNumberSelected');
            firstElement[0].classList.remove("secondNumberSelected");;
            item.classList.add("secondNumberSelected");
            hightLightNumbersInBetween();
            IsfirstRangeIsChosen = true;
        }
    }

    function addOrRemoveCircle(numOflicks)
    {
        var stringOfToday =  todayDate.getFullYear() + "-" + $scope.months[todayDate.getMonth()] + "-" + todayDate.getDate();
        var todayElement = document.getElementById(stringOfToday);

        if (        detailsOfFirstNumberClicked.id == todayDate.getDate() &&
                    detailsOfFirstNumberClicked.month == $scope.months[todayDate.getMonth()] &&
                    detailsOfFirstNumberClicked.year == todayDate.getFullYear())
        {
            todayElement.classList.remove("numberCircle");
        }

        else
        {
            if(numOflicks%2 != 0 )
            {
                todayElement.classList.add("numberCircle");
            }
        }
    }

    function highlightItemContainer(item, numOflicks)
    {
        if($scope.singleDatePickerAllowed)
        {
            item.classList.add("numberSelected");
            return;
        }

        item.classList.add("numberSelected");
        if(numOflicks%2 != 0)
        {
            setYearMonthDateOfClickedItem(item.id,1);
            item.classList.add("firstNumberSelected");
            item.classList.add("secondNumberSelected");
        }
        else if(numOflicks%2 == 0)
        {
            setYearMonthDateOfClickedItem(item.id,2);
            var firstElement = document.querySelectorAll('.firstNumberSelected.secondNumberSelected');
            firstElement[0].classList.remove("secondNumberSelected");
            item.classList.add("secondNumberSelected");
            hightLightNumbersInBetween();
            IsfirstRangeIsChosen = true;
        }
    }

    function clearPreviousSelection(numOflicks)
    {

        if($scope.singleDatePickerAllowed)
        {
            $scope.clear();
        }

        if(numOflicks%2 != 0)
        {
               $scope.clear();
        }

    }

    $scope.runWhenItemClicked  = function(event, passedMonth)
    {
        if ($scope.singleDatePickerAllowed)
        {
            var itemClicked = checkWhichItemIsClicked(event);
            if(itemClicked == "container")
            {
                if(checkIfDateAvialable(event.target.id))
                {
                    console.log(event.target.id);
                    $('#'+event.target.id).css("border-radius", "50%");
                    clearPreviousSelection(numOflicks);
                    highlightItemNumber(event.target,numOflicks);
                    var seperatedDateForSelectedDate = getYearMonthDateFromID(event.target.id);
                    detailsOfFirstNumberClicked = {id: seperatedDateForSelectedDate[2], month: seperatedDateForSelectedDate[1], year: seperatedDateForSelectedDate[0]};
                    updateStartEndDates();
                }

            }
            else if (itemClicked == "number")
            {
                if(checkIfDateAvialable(event.target.parentNode.id))
                {
                    $('#'+event.target.parentNode.id).css("border-radius", "50%");
                    clearPreviousSelection(numOflicks);
                    highlightItemNumber(event.target.parentNode,numOflicks);
                    var seperatedDateForSelectedDate = getYearMonthDateFromID(event.target.parentNode.id);
                    detailsOfFirstNumberClicked = {id: seperatedDateForSelectedDate[2], month: seperatedDateForSelectedDate[1], year: seperatedDateForSelectedDate[0]};
                    updateStartEndDates();

                }
            }
        }
        else
        {
            var itemClicked = checkWhichItemIsClicked(event);
            if (itemClicked == "container")
            {
                if(checkIfDateAvialable(event.target.id))
                {
                    console.log("test 1");
                    numOflicks++;
                    clearPreviousSelection(numOflicks);
                    highlightItemNumber(event.target,numOflicks);
                    addOrRemoveCircle(numOflicks);
                    updateStartEndDates();
                }
            }
            else if (itemClicked == "number")
            {
                if(checkIfDateAvialable(event.target.parentNode.id))
                {
                    console.log("test 2");
                    numOflicks++;
                    clearPreviousSelection(numOflicks);
                    highlightItemContainer(event.target.parentNode,numOflicks);
                    addOrRemoveCircle(numOflicks);
                    updateStartEndDates();

                }
            }
        }

    }

    function updateStartEndDates()
    {
        if($scope.singleDatePickerAllowed)
        {
            $scope.startDate = detailsOfFirstNumberClicked.id + " " + monthsAbbreviation[getMonthIndex(detailsOfFirstNumberClicked.month)-1] ;
            $scope.startWeekDay = weekDays[(new Date(detailsOfFirstNumberClicked.month + " " + detailsOfFirstNumberClicked.id + " " + detailsOfFirstNumberClicked.year) ).getDay()];
        }

        if(numOflicks%2 != 0)
        {
            $scope.startDate = detailsOfFirstNumberClicked.id + " " + monthsAbbreviation[getMonthIndex(detailsOfFirstNumberClicked.month)-1];
            $scope.startWeekDay = weekDays[(new Date(detailsOfFirstNumberClicked.month + " " + detailsOfFirstNumberClicked.id + " " + detailsOfFirstNumberClicked.year) ).getDay()];
        }
        else
        {
            $scope.endDate = detailsOfSecondNumberClicked.id + " " + monthsAbbreviation[getMonthIndex(detailsOfSecondNumberClicked.month)-1];
            $scope.endWeekDay = weekDays[(new Date(detailsOfSecondNumberClicked.month + " " + detailsOfSecondNumberClicked.id + " " + detailsOfSecondNumberClicked.year) ).getDay()];
        }
    }

    $scope.saveDates = function()
    {

    }

    $scope.clear = function()
    {

        if($scope.singleDatePickerAllowed)
        {
            var numberContainers = document.querySelectorAll('.numberContainer');

            for (var i=0; i< numberContainers.length; i++)
            {
                numberContainers[i].classList.remove("numberSelected");
            }

            $scope.startDate = 'Select Date';
            detailsOfFirstNumberClicked = {id: todayDate.getDay(), month: todayDate.getMonth(), year: new Date().getFullYear()};
            $scope.startWeekDay = "";

        }
        else
        {
            var numberContainers = document.querySelectorAll('.numberContainer');
            var GapDaysElements = document.querySelectorAll('.gapDayBg');


            for(var i=0; i < numberContainers.length; i++)
            {
                numberContainers[i].classList.remove("secondNumberSelected");
                numberContainers[i].classList.remove("firstNumberSelected");
                numberContainers[i].classList.remove("numberSelected");
            }

            for(var i=0; i < GapDaysElements.length; i++)
            {
                // console.log("iiiiiiiiiiiiiii = " + i);
                GapDaysElements[i].classList.remove("gapDayBg");
            }


            $scope.startDate = 'Start date';
            $scope.endDate   = 'End date';
            $scope.startWeekDay = '';
            $scope.endWeekDay = '';

            detailsOfFirstNumberClicked = {id: todayDate.getDay(), month: todayDate.getMonth(), year: new Date().getFullYear()};
            detailsOfSecondNumberClicked = {id: todayDate.getDay(), month: todayDate.getMonth(), year: new Date().getFullYear()};
        }


    }

    $scope.getNumberOfClicks = function()
    {
        return numOflicks;
    }

    function capitalizeFirstLetter(string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    $scope.disableSaveBtn = function()
    {
        if($scope.startDate === 'Start date' || $scope.startDate === 'Select Date' || $scope.endDate  === 'End date')
        {
            return true;
        }
        return false;
    }

    createNextMaxNumOfMonths(currentMonth);

});


calendarApp.filter('range', function()
{
  return function(input, total)
  {
    total = parseInt(total);
    if(total < 0)
    {
        total += 7;
    }

    for (var i=0; i<total; i++)
    {
      input.push(i);
    }

    return input;
  };
});
