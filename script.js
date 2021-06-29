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

        if ($(this).text() == "") {
            updateCell("text", $(this).text(), true);
        } else {
            updateCell("text", $(this).text(), false);
        }




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
/*Selected sheet is loaded*/
function loadsheet() {
    /*getting the data of selected sheet inside celldata */
    let sheetinfo = cellData[selectedSheet];

    /*Now as we have info of those cells that have value different than default
    we iterate over those rows and columns and make them their value
    */

    for (let i of Object.keys(sheetinfo)) {
        /*i-> rows  Iteration in rows */
        for (let j of Object.keys(sheetinfo[i])) {
            /*j-> columns in ith row */
            /*Now get the value of this cell in cellinfo */
            let cellinfo = sheetinfo[i][j];

            $(`#input-cell-id-${i}-${j}`).text(cellinfo["text"]);
            $(`#input-cell-id-${i}-${j}`).css("background-color", cellinfo["background-color"]);
            $(`#input-cell-id-${i}-${j}`).css("color", cellinfo["color"]);
            $(`#input-cell-id-${i}-${j}`).css("text-align", cellinfo["text-align"]);
            $(`#input-cell-id-${i}-${j}`).css("font-weight", cellinfo["font-weight"]);
            $(`#input-cell-id-${i}-${j}`).css("font-style", cellinfo["font-style"]);
            $(`#input-cell-id-${i}-${j}`).css("text-decoration", cellinfo["text-decoration"]);
            $(`#input-cell-id-${i}-${j}`).css("font-family", cellinfo["font-family"]);
            $(`#input-cell-id-${i}-${j}`).css("font-size", cellinfo["font-size"]);



        }
    }


}

/* Clearing the sheet for addition of new sheet */
function clearsheet() {
    let sheetinfo = cellData[selectedSheet];

    /*Now as we have info of those cells that have value different than default
    we iterate over those rows and columns and make them default this won't affect the already saved sheet cell info
    */

    for (let i of Object.keys(sheetinfo)) {
        /*i-> rows  Iteration in rows */
        for (let j of Object.keys(sheetinfo[i])) {
            /*j-> columns in ith row */
            /*Now make this cell as default */
            $(`#input-cell-id-${i}-${j}`).text("");
            $(`#input-cell-id-${i}-${j}`).css("background-color", "#ffffff");
            $(`#input-cell-id-${i}-${j}`).css("color", "#000000");
            $(`#input-cell-id-${i}-${j}`).css("text-align", "left");
            $(`#input-cell-id-${i}-${j}`).css("font-weight", "");
            $(`#input-cell-id-${i}-${j}`).css("font-style", "");
            $(`#input-cell-id-${i}-${j}`).css("text-decoration", "");
            $(`#input-cell-id-${i}-${j}`).css("font-family", "Noto Sans");
            $(`#input-cell-id-${i}-${j}`).css("font-size", 20);



        }
    }
}


$(".icon-add").click(function() {
    clearsheet();
    $(".sheet-tab").removeClass("selected");
    let sheetname = "Sheet" + (totalSheet + 1);
    totalSheet = totalSheet + 1;
    cellData[sheetname] = {};
    selectedSheet = sheetname;
    $(".sheet-tab-container").append(`<div class="sheet-tab selected" id=#${sheetname}>${sheetname}</div>`);

    addSheetEvent();
});


/*As there are multiple sheet even like left click right click so all are under one hood*/
function addSheetEvent() {
    $(".sheet-tab").click(function() {
        if (!$(this).hasClass("selected")) {
            selectsheet($(this));
        }

    });
    $(".sheet-tab").contextmenu(function(e) {
        e.preventDefault();
        $(".sheet-tab.selected").removeClass("selected");
        $(this).addClass("selected");
        selectedSheet=$(this).text();
        /*When we click on the sheet-tab-selected context menu at that time sheep option existance is 0 but if we keep on clicking
        it will increase so we only appending so that length remains only 1 not greater than that */
       
        if($(".sheet-option-menu").length == 1)
{   $(".sheet-option-menu").remove();

        /*When this contextmenu is triggered below sheetoption menu is appended on the container*/
        $(".container").append('<div class="sheet-option-menu"> <div class="rename-menu">Rename </div> <div class="delete-menu">Delete </div>');

        $(".rename-menu").click(function(){
            $(".container").append(`<div class="sheet-rename-modal">
            <h4 class="sheet-rename-modal-heading"> Rename Sheet To:</h4>
            <input type="text" class="new-sheet-name" placeholder="sheetname" />
                <div class="action-buttons">
                    <div class="submit-button">Submit</div>
                    <div class="cancel-button">Cancel</div>
                </div>
            
            </div>`);
            $(".cancel-button").click(function(){
                $(".sheet-rename-modal").remove();
            });

            $(".submit-button").click(function(){
                let currsheetname=selectedSheet;
                let sheetdata=cellData[currsheetname];
                let newname=$(".new-sheet-name").val();
                if(newname==""){
                    alert("Empty name can't be placed please give appropriate value");
                }
                else{
                    delete cellData[selectedSheet];
                    selectedSheet=newname;
                    cellData[newname]=sheetdata;
                    $(".sheet-tab.selected").html(newname);

                }
                $(".sheet-rename-modal").remove();
            });

        
        });

       
        /*Now setting the position of this sheet option menu according to event pagex and pagey value*/

        $(".sheet-option-menu").css("left", e.pageX + "px");}
    else if($(".sheet-option-menu").length == 0)
    {
            /*When this contextmenu is triggered below sheetoption menu is appended on the container*/
            $(".container").append('<div class="sheet-option-menu"> <div class="rename-menu">Rename </div> <div class="delete-menu">Delete </div>');
    
            $(".rename-menu").click(function(){
                $(".container").append(`<div class="sheet-rename-modal">
                <h4 class="sheet-rename-modal-heading"> Rename Sheet To:</h4>
                <input type="text" class="new-sheet-name" placeholder="sheetname" />
                    <div class="action-buttons">
                        <div class="submit-button">Submit</div>
                        <div class="cancel-button">Cancel</div>
                    </div>
                
                </div>`);
                $(".cancel-button").click(function(){
                    $(".sheet-rename-modal").remove();
                });
    
                $(".submit-button").click(function(){
                    let currsheetname=selectedSheet;
                    let sheetdata=cellData[currsheetname];
                    let newname=$(".new-sheet-name").val();
                    if(newname==""){
                        alert("Empty name can't be placed please give appropriate value");
                    }
                    else{
                        delete cellData[selectedSheet];
                        selectedSheet=newname;
                        cellData[newname]=sheetdata;
                        $(".sheet-tab.selected").html(newname);
    
                    }
                    $(".sheet-rename-modal").remove();
                });
    
            
            });
    
           
            /*Now setting the position of this sheet option menu according to event pagex and pagey value*/
    
            $(".sheet-option-menu").css("left", e.pageX + "px");}

        else {
        $(".sheet-option-menu").remove();
    }    
    console.log($(".sheet-option-menu").length)
    });
}

$(".container").click(function(){
    $(".sheet-option-menu").remove();
});
    


addSheetEvent();


function selectsheet(element) {
    $(".sheet-tab.selected").removeClass("selected");
    $(element).addClass("selected");
    clearsheet();
    selectedSheet = $(element).text();
    loadsheet();
}