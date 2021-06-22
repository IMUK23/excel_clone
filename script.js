let defaultproperties = {
    text: "",
    "font-weight": "normal",
    "font-style": "",
    "text-decoration": "",
    "text-align": "left",
    "background-color": "#ffffff",
    "color": "#000000",
    "font-family": "Noto Sans",
    "font-size": 20
};

let cellData = {
    "Sheet1": {}
};

let selectedSheet = "Sheet1";
let totalSheet = 1;

$(document).ready(function() {
    function conversion(n) {

        let ans = "";

        while (n != 0) {
            let rem = n % 26;

            if (rem == 0) {
                ans = "Z" + ans;
                n = Math.floor(n / 26) - 1;
            } else {
                ans = String.fromCharCode(rem - 1 + 65) + ans;

                n = Math.floor(n / 26);

            }

        }
        return ans;
    }



    let cellContainer = $(".input-cell-container");
    let columnContainer = $(".column-name-container");
    let rowContainer = $(".row-name-container");

    for (let i = 1; i <= 100; i++) {
        let ans = conversion(i);

        let column = $(`<div class="column-name column-class-${i}" id="column-id-${ans}">${ans}</div>`);
        columnContainer.append(column);


        let row = $(`<div class="row-name" id="row-id-${i}">${i}</div>`);
        rowContainer.append(row);
    }


    for (let i = 1; i <= 100; i++) {
        let cellRow = $(`<div class="cell-row" id="cell-row-id-${i}">`);
        cellContainer.append(cellRow);
        let currRow = $(`#cell-row-id-${i}`);
        for (let j = 1; j <= 100; j++) {
            let rowCols = $(`<div class="input-cell" id="input-cell-id-${i+"-"+j}" contentEditable="false"></div> `);
            currRow.append(rowCols);
        }
    }



    $(".align-icon").click(function() {

        $(".align-icon.selected").removeClass("selected");

        $(this).addClass("selected");

    });

    $(".style-icon").click(function() {
        /*This means if there remove class and if not there add class*/
        $(this).toggleClass("selected");


    });

    function getRowCol(ele) {

        return $(ele).attr("id");
    }







    $(".input-cell").click(function(e) {
        /*if already part of any selected cells it will remove that as soon as it is again single clicked*/
        $(this).removeClass("top-cell-selected");
        $(this).removeClass("bottom-cell-selected");
        $(this).removeClass("left-cell-selected");
        $(this).removeClass("right-cell-selected");
        if (e.ctrlKey) {
            let idArray = getRowCol(this).split('-');
            let rowid = parseInt(idArray[3]);
            let colid = parseInt(idArray[4]);
            //console.log(rowid + " " + colid);

            if (rowid > 1) {
                let topcellselected = $(`#input-cell-id-${rowid-1}-${colid}`).hasClass("selected");

                if (topcellselected) {
                    $(this).addClass("top-cell-selected");
                    $(`#input-cell-id-${rowid-1}-${colid}`).addClass("bottom-cell-selected")
                }
            }

            if (rowid < 100) {
                let bottomcellselected = $(`#input-cell-id-${rowid+1}-${colid}`).hasClass("selected");

                if (bottomcellselected) {
                    $(this).addClass("bottom-cell-selected");
                    $(`#input-cell-id-${rowid+1}-${colid}`).addClass("top-cell-selected")
                }
            }

            if (colid > 1) {
                let leftcellselected = $(`#input-cell-id-${rowid}-${colid-1}`).hasClass("selected");

                if (leftcellselected) {
                    $(this).addClass("left-cell-selected");
                    $(`#input-cell-id-${rowid}-${colid-1}`).addClass("right-cell-selected")
                }
            }

            if (colid < 100) {
                let rightcellselected = $(`#input-cell-id-${rowid}-${colid+1}`).hasClass("selected");

                if (rightcellselected) {
                    $(this).addClass("right-cell-selected");
                    $(`#input-cell-id-${rowid}-${colid+1}`).addClass("left-cell-selected")
                }
            }






        } else {
            $(".input-cell.selected").removeClass("selected");

        }
        $(this).addClass("selected");
        changeHeader(this);
    });


    function changeHeader(element) {
        let idArray = getRowCol(element).split('-');
        let rowid = parseInt(idArray[3]);
        let colid = parseInt(idArray[4]);
        /*if exist or not*/
        let cellinfo = defaultproperties;

        if (cellData[selectedSheet][rowid] && cellData[selectedSheet][rowid][colid]) {
            cellinfo = cellData[selectedSheet][rowid][colid];
        }

        cellinfo['font-weight'] == "bold" ? $(".icon-bold").addClass("selected") : $(".icon-bold").removeClass("selected");
        cellinfo['font-style'] ? $(".icon-italic").addClass("selected") : $(".icon-italic").removeClass("selected");
        cellinfo['text-decoration'] ? $(".icon-underline").addClass("selected") : $(".icon-underline").removeClass("selected");

        let alignment = cellinfo['text-align'];

        $(".align-icon.selected").removeClass("selected");

        $(".icon-align-" + alignment).addClass("selected");

        $(".font-family-selector").val(cellinfo["font-family"]);
        $(".font-size-selector").val(cellinfo["font-size"]);

        $(".input-cell-color").val(cellinfo["background-color"]);
        $(".input-cell-font-color").val(cellinfo["color"]);
    }


    $(".input-cell").dblclick(function() {
        $(".input-cell.selected").removeClass("selected");
        $(this).addClass("selected");
        $(this).attr("contenteditable", "true");
        $(this).focus();
    });

    $(".input-cell").blur(function() {

        $(".input-cell.selected").attr("contenteditable", "false");
    });


    function updateCell(property, val, defaultPossible) {
        $(".input-cell.selected").each(function() {
            $(this).css(property, val);

            /*Getting rowid and colid*/
            let idArray = getRowCol(this).split('-');
            let rowId = parseInt(idArray[3]);
            let colId = parseInt(idArray[4]);


            if (cellData[selectedSheet][rowId]) {
                /*rowid is there it means any data cell is there of that row whose property is altered*/
                if (cellData[selectedSheet][rowId][colId]) {
                    /*cell id exist it means this data cell already have any other propery altered*/
                    cellData[selectedSheet][rowId][colId][property] = val;
                } else {
                    /*It means it didnt have any property value other than default so we made an object of default property and then
                    changed value.
                    */
                    //This is sparse which copies the object 
                    cellData[selectedSheet][rowId][colId] = {...defaultproperties };
                    cellData[selectedSheet][rowId][colId][property] = val;

                }
            } else {
                /*No data cell of that particular row is having different property but not it have so created an object and changed
                the property*/
                cellData[selectedSheet][rowId] = {};
                cellData[selectedSheet][rowId][colId] = {...defaultproperties };
                cellData[selectedSheet][rowId][colId][property] = val;

            }

            // Now check whether the curr cell data is equal to default values or not but it will be only when default is possible
            // and when default is possible when we are giving default values to the property
            if (defaultPossible && JSON.stringify(cellData[selectedSheet][rowId][colId]) === JSON.stringify(defaultproperties)) {
                delete cellData[selectedSheet][rowId][colId];
                if (Object.keys(cellData[selectedSheet][rowId]).length == 0) {
                    delete cellData[selectedSheet][rowId];
                }
            }
        });

        console.log(cellData);

    };


    $(".icon-bold").click(function() {

        if ($(".icon-bold").hasClass("selected") == false) {
            updateCell("font-weight", "normal", true);

        } else {
            updateCell("font-weight", "bold", false);
        }

    });

    $(".icon-italic").click(function() {

        if ($(".icon-italic").hasClass("selected") == false) {
            updateCell("font-style", "", true);

        } else {
            updateCell("font-style", "italic", false);
        }

    });

    $(".icon-underline").click(function() {

        if ($(".icon-underline").hasClass("selected") == false) {
            updateCell("text-decoration", "", true);
        } else {

            updateCell("text-decoration", "underline", false);
        }

    });


    $(".icon-align-left").click(function() {

        if ($(".icon-align-left").hasClass("selected") === true) {

            updateCell("text-align", "left", true);
        }

    });

    $(".icon-align-right").click(function() {

        if ($(this).hasClass("selected") == true) {

            updateCell("text-align", "right", true);
        }

    });

    $(".icon-align-center").click(function() {

        if ($(this).hasClass("selected") == true) {
            updateCell("text-align", "center", true);
        }

    });

    $(".font-family-selector").change(function() {
        let font = $(".font-family-selector option:selected").text();
        if (font === "Noto Sans") {
            updateCell("font-family", font, true);
        } else {
            updateCell("font-family", font, false);
        }
    });

    $(".font-size-selector").change(function() {
        let font = parseInt($(".font-size-selector option:selected").text());

        if (font == 20) {
            updateCell("font-size", font, true);
        } else {
            updateCell("font-size", font, false);
        }
    });



    $(".input-cell-container").scroll(function() {
        //console.log(this.scrollLeft);
        $(".column-name-container").scrollLeft(this.scrollLeft);
        //console.log(this.scrollTop);
        $(".row-name-container").scrollTop(this.scrollTop);

    });



    $(".color-fill-icon").click(function() {
        $(".input-cell-color").click();
    });

    /*When the value of input cell color picker changes we need to update the cell property*/

    $(".input-cell-color").change(function() {
        if ($(this).val() == "#ffffff") {
            updateCell("background-color", $(this).val(), true);
        } else {
            updateCell("background-color", $(this).val(), false);
        }
    });

    $(".color-text-icon").click(function() {
        $(".input-cell-font-color").click();
    });

    $(".input-cell-font-color").change(function() {
        if ($(this).val() == "#000000") {
            updateCell("color", $(this).val(), true);
        } else {
            updateCell("color", $(this).val(), false);
        }
    });


});