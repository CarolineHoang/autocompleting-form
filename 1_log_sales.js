// Author: Caroline Hoang
// A Sales Logging List with Dynamic Div Generation and Autocomplete JS
// [A UI Design Class Assignment]

clients = [
    "Shake Shack",
    "Toast",
    "Computer Science Department",
    "Teacher's College",
    "Starbucks",
    "Subsconsious",
    "Flat Top",
    "Joe's Coffee",
    "Max Caffe",
    "Nussbaum & Wu",
    "Taco Bell",
];
var autoClientList = clients;
var entries = [];
var sales = [
	{
		"salesperson": "James D. Halpert",
		"client": "Shake Shack",
		"reams": 100
	},
	{
		"salesperson": "Stanley Hudson",
		"client": "Toast",
		"reams": 400
	},
	{
		"salesperson": "Michael G. Scott",
		"client": "Computer Science Department",
		"reams": 1000
	},
]
var salesList = sales.reverse(); //the only purpose of this innitial reversal is 
                                 //to get the prexisting info initially shown in 
                                 //the top-to-bottom order given originally
                                 //because the View adds the divs by prepending 
                                 //so we should structure the json list thusly



//build all the rows seen in the view from the model provided as "entryJSON"

//the structure here is to make a single row with 4 boostrap column divs in it
//each div contains on piece of the information in the JSON and the last column makes the delete-row button

//I did it this way so that if the input values for one input field are very long, 
//the whole row reacts to even itself out height-wise

//SET UP VIEW FOR UPDATE
function makeRowEntries( entryJSON ){
    entries = entryJSON.map(function(s, index){
        var salespersonDiv = $("<div>" + s.salesperson + "</div>");
        salespersonDiv.addClass("col-md-3 starting-column")

        var clientDiv = $("<div>" + s.client + "</div>");
        clientDiv.addClass("col-md-4")

        var reamsDiv = $("<div>" + s.reams + "</div>");
        reamsDiv.addClass("col-md-2")

        var buttonX = $("<button value="+ index+">X</button>");  //save index as value
        buttonX.addClass("delete-button")
        var buttonDiv = $("<div>");
        buttonDiv.append(buttonX )
        buttonDiv.addClass("col-md-3 ")

        var rowEntry  = $("<div></div>")
        rowEntry.addClass("row entry-row")
        rowEntry.append(salespersonDiv , clientDiv, reamsDiv,  buttonDiv)
        return rowEntry;
        
    })

}
//UPDATE THE VIEW
function renderRowEntries( modelJSON ){
    makeRowEntries(modelJSON); //remake entries array of rows
    $("#entries").empty();   //clear out HTML elements representing old rows before update
    //generate new HTML rows
    entries.forEach(function(c){
        $("#entries").prepend(c)
    })
}

//styles and values to preset for when the page first loads
window.onload = function(){  
    makeRowEntries(sales);
    entries.forEach(function(c){
        $("#entries").prepend(c)
    })
};

//check for only positive integer numbers and 0 with regEx
function isPositiveInteger(strInt) {
    return /^(0|[1-9]\d*)$/.test(strInt); // the conditional considers 0, without 0 it would be:
                                          //    return /^[1-9]\d*$/.test(strInt);
}

//jquery autocomplete function
$(document).ready(function(){
    $("#client-input").autocomplete({
        source: autoClientList
    });
})

//Main program:
$(document).ready(function(){

    //ADD a sale entry
    $("#add-entry").click(function(){

        //variables to update with
        var newSalesPerson = "Caroline Hoang"   // hardcode sales person name
        var newClient = $("#client-input").val();
        var newReamsCount = $("#reams-input").val()
        var newReamsCountInt = (parseInt( newReamsCount,  10)); //parse the string into an integer for storing as an int variable

        //deactivate all warnings
        $("#name-warning").removeClass("show-warning").addClass("hide-warning")
        $("#space-warning").removeClass("show-warning").addClass("hide-warning")
        $("#reams-warning").removeClass("show-warning").addClass("hide-warning")
        $("#int-warning").removeClass("show-warning").addClass("hide-warning")


        //if both fields have valid input, update model and then the view
        if (  (((newClient).trim()).length != 0)  && (newReamsCount.length != 0) 
                                   && (isPositiveInteger(newReamsCount.trim()) ) ){  //we trim so we can accept numbers with starting spaces


            //UPDATE MODEL:
            //add a new "row" of information to saleslist JSON list
            salesList.push(
                {
                    "salesperson": newSalesPerson,
                    "client": newClient,
                    "reams": newReamsCountInt
                }

            )
            //UPDATE VIEW:
            renderRowEntries( salesList );


            //clear input values when values passed
            $("#client-input").val("");
            $("#reams-input").val("");

            //put focus back on the the #client-input field
            $("#client-input").focus();

            // if the last input client is not in autoClientList, add it to the list (given that it's not empty or just spaces)
            if (   (!autoClientList.includes(  newClient ) ) && ( newClient!= null)  && (((newClient).trim()).length != 0) ){
                autoClientList.push(newClient)
            }
        }
        else{
            //handle the display of warnings
            //note, the newClient group is on the bottom so it will fire last and take priority if they are both wrong

            //handle all error displays pertaining to and put focus on #reams-input
            //if #reams-input is empty
            if ((newReamsCount.length)==0) {
                $("#int-warning").removeClass("show-warning").addClass("hide-warning")
                $("#reams-warning").removeClass("hide-warning").addClass("show-warning")
                $("#reams-input").focus();
            }
            //if #reams-input is not a valid, positive integer or zero
            else if (!isPositiveInteger(newReamsCount.trim()) ){ //we trim so we can accept numbers with starting spaces
                $("#reams-warning").removeClass("show-warning").addClass("hide-warning")
                $("#int-warning").removeClass("hide-warning").addClass("show-warning")
                $("#reams-input").focus();
            }
            //#reams-input is correct, remove all error displays
            else{
                $("#reams-warning").removeClass("show-warning").addClass("hide-warning")
                $("#int-warning").removeClass("show-warning").addClass("hide-warning")
            }

            //handle all error displays pertaining to and put focus on #client-input
            //if #client-input is empty
            if ((newClient).length === 0) {
                $("#space-warning").removeClass("show-warning").addClass("hide-warning")
                $("#name-warning").removeClass("hide-warning").addClass("show-warning")
                $("#client-input").focus();
            } 
            //if #client-input is all space characters
            else if (((newClient).trim()).length === 0) {
                $("#name-warning").removeClass("show-warning").addClass("hide-warning")
                $("#space-warning").removeClass("hide-warning").addClass("show-warning")
                $("#client-input").focus();
            }
            //#client-input is correct, remove all error displays
            else{
                $("#name-warning").removeClass("show-warning").addClass("hide-warning")
                $("#space-warning").removeClass("show-warning").addClass("hide-warning")
            }
        } 
    })

    //DELETE a sale entry
    $("#entries").on("click", "button.delete-button", function(){ // ".click()" does not work on dynamically generated objects
                                                                  // We must do the following:
                                                                  // 1) call the containing div in which the topmost level of nested divs is being 
                                                                  //    presented in the actual .html document ("#entries") as the div being clicked
                                                                  // 2) use .on() and then use the second parameter to call the div we want to use the click event on  
                                                                  // 3) put it in the format [HTML object type].[class name (optional)]
                                                
        //UPDATE MODEL
        salesList.splice($(this).val(), 1); // "this" refers to the button we clicked

                                            // we had stored the index postion of the row in the entries list as the value so we call this

                                            // since this index should match the index of the position of the data in the json, 
                                            // use this value to splice (remove) that entry from the model

                                            // Note: since the view is just a product of the model, 
                                            // the updated model will ensure that the buttons have 
                                            // the right index values saved even after one is deleted

        //UPDATE VIEW:
        renderRowEntries( salesList ); 
    })
})



$(document).ready(function(){
    // pressing enter to submit the form
    $("#reams-input").keyup(function(event){
        if (event.key == "Enter"){
                $("#add-entry").click(); //trigger button click event behavior
        }
    })
})