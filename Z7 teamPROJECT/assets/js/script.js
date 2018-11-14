const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

Node.prototype.on = window.on = function (name, fn) {
    this.addEventListener(name, fn);
};

NodeList.prototype.__proto__ = Array.prototype;
NodeList.prototype.on = NodeList.prototype.addEventListener = function (name, fn) {
    this.forEach((elem) => {
        elem.on(name, fn);
    });
};

class Dates {
    constructor(names) {
        this.names = names;
        this.diacritics = {
            'á': "a",
            'ä': "a",
            'č': "c",
            'ď': "d",
            'é': "e",
            'í': "i",
            'ľ': "l",
            'ĺ': "l",
            'ň': "n",
            'ó': "o",
            'ŕ': "r",
            'š': "s",
            'ť': "t",
            'ú': "u",
            'ý': "y",
            'ž': "z"
        };
    }

    dateDayMonth(day, month) {
        return [this.dayNumber(day, month), this.names.months[month].nameofMonth];
    }

    nameofMonth(month) {
        return this.names.months[month].nameofMonth;
    }

    nameofDay(day, month) {
        return this.names.months[month].days[day].nameofDay;
    }

    dayNumber(day, month) {
        return this.names.months[month].days[day].dayNumber;
    }

    replaceDiacritics(stringToReplace) {

        for (let i in this.diacritics) {
            stringToReplace = stringToReplace.replace(new RegExp(i, "g"), this.diacritics[i]);
        }
        return stringToReplace;

    }

    formatName(name) {
        if (typeof name == 'object') {
            let newArray = [];
            name.forEach(element => {
                element = element.toLowerCase();
                element = this.replaceDiacritics(element);
                newArray.push(element);
            });
            return newArray;
        } else {
            name = name.toLowerCase();
            name = this.replaceDiacritics(name);
            return name;
        }
    }

    getNameFromDate(date) {
        let dateArray = date.split(".");
        if (this.checkDateFromat(dateArray) == false) return -1; //checking correct format of date
        else {
            dateArray.forEach(i => {
                if (i.charAt(0) === '0') i = i.substr(1);
            });
            let name = this.nameofDay(Number(dateArray[0]) - 1, Number(dateArray[1]) - 1);
            if (typeof name == 'object') {
                let returnString = "";
                for (let i = 0; i < name.length - 2; i++) {
                    returnString = returnString + name[i] + ', ';
                }
                returnString = returnString + name[name.length - 2] + ' a ' + name[name.length - 1];
                return returnString;
            }
            return name;
        }
    }

    checkDateFromat(dateArray) {
        return dateArray.length >= 2 && dateArray.length <= 3 && !isNaN(Number(dateArray[0] - 1)) && !isNaN(Number(dateArray[0] - 1)) && dateArray[1] >= 0 && dateArray[1] <= 12 && this.names.months[dateArray[1] - 1].days.length >= dateArray[0];
    }

    getDateFromName(name) {
        name = this.formatName(name);
        let returnDate = [];
        for (let i = 0; i < names.months.length; i++) {
            for (let j = 0; j < names.months[i].days.length; j++) {
                let currentDay = this.formatName(this.nameofDay(j, i));
                if (typeof currentDay == 'object') currentDay.forEach(element => {
                    if (element == name) {
                        returnDate = this.dateDayMonth(j, i);
                    }
                });

                if (currentDay == name) returnDate = this.dateDayMonth(j, i);
            }
        }
        return returnDate;
    }
}

class navBar {

}

  //*****************************************//
 //***************Code Here Bitch***********//
//*****************************************//

let date;

window.onload = () => {
    let array = [
        {name: "Domov", link: "index.html"},
        {name: "Naše práce", link: "#", child: [
            {name: "Individuálne úlohy", link: "#", child: [
                {name: "Dávidova úloha", link: "#"},
                {name: "Martinova úloha", link: "#"},
                {name: "Šimonova úloha", link: "#"}
            ]}
        ]},
        {name: "Autori", link: "#"},
    ];
    loadNamesAndDatesArray();
    //updateCounter();
    $("#navigation").innerHTML = createNavBar(array);
}

function loadJSON(url, callback) {
    let newRequest = new XMLHttpRequest();
    newRequest.overrideMimeType("application/json");
    newRequest.open('GET', url, true);
    newRequest.onreadystatechange = function () {
        if (newRequest.readyState == 4 && newRequest.status == "200") {
            callback(newRequest.responseText);
            console.log("hla");
        }
    };
    console.log("tutoka");
    newRequest.send(null);
}

function loadNamesAndDatesArray() {
    loadJSON('/assets/js/namesanddates.json', function (response) {
        date = new Dates(JSON.parse(response));
        console.log(date);
        $("#nameDay").innerHTML =  `Meniny dnes má ${displayTodayName()}`;  
    });
}

function updateCounter() {
    let countNumberString = localStorage.getItem("counter");
    if (!countNumberString) localStorage.setItem("counter", 1);
    else localStorage.setItem("counter", parseInt(countNumberString) + 1);
    displayCounter();
}

function displayCounter() {
    $("#counter").innerHTML = localStorage.getItem("counter");
}

function displayTodayName() {
    let today = new Date();
    let todayString = today.getDate() + "." + (today.getMonth() + 1);
    return date.getNameFromDate(todayString);
}

function createNavBar (array) {
    let output = '<ul class="nav-bar">';
    for (let item of array) {
        if(window.location.pathname.split("/").pop() === item.link)
            if(item.child)
                output += `<li class="selected"><a href="${item.link}">${item.name}<span class="downArrow"> ▼</span></a>`;
            else
                output += `<li class="selected"><a href="${item.link}">${item.name}</a>`;
        else
            if(item.child)
                output += `<li><a href="${item.link}">${item.name}<span class="downArrow"> ▼</span></a>`;
            else
                output += `<li><a href="${item.link}">${item.name}</a>`;
        if(item.child)
            output += createNavBar(item.child);
        output += '</li>';
    }
    output += '</ul>';

    return output;
}
