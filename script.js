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




            $(this).addClass("selected");

        } else {
            $(".input-cell.selected").removeClass("selected");
            $(this).toggleClass("selected");
        }


    });


    $(".input-cell").dblclick(function() {
        $(".input-cell.selected").removeClass("selected");
        $(this).addClass("selected");
        $(this).attr("contenteditable", "true");
        $(this).focus();
    });

    $(".input-cell").blur(function() {

        $(".input-cell.selected").attr("contenteditable", "false");
    });


    function updateCell(property, val) {
        $(".input-cell.selected").each(function() {
            $(this).css(property, val);
        });

    }


    $(".icon-bold").click(function() {

        if ($(".icon-bold").hasClass("selected")) {
            updateCell("font-weight", "normal");
        } else {
            updateCell("font-weight", "bold");
        }

    });

    $(".icon-italic").click(function() {

        if ($(".icon-italic").hasClass("selected")) {
            updateCell("font-style", "");
        } else {
            updateCell("font-style", "italic");
        }

    });

    $(".icon-underline").click(function() {

        if ($(".icon-underline").hasClass("selected")) {
            updateCell("text-decoration", "");
        } else {
            updateCell("text-decoration", "underline");
        }

    });



    $(".input-cell-container").scroll(function() {
        //console.log(this.scrollLeft);
        $(".column-name-container").scrollLeft(this.scrollLeft);
        //console.log(this.scrollTop);
        $(".row-name-container").scrollTop(this.scrollTop);

    });




});