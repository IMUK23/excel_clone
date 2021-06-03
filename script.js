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
            let rowCols = $(`<div class="input-cell" id="input-cell-id-${i-j}" contentEditable="true"></div> `);
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

    $(".input-cell").click(function() {

        $(".input-cell.selected").removeClass("selected");
        $(this).toggleClass("selected");


    });

});