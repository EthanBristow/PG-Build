function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
    alert("deviceready");
    // cordova.plugins.notification.local is now available
    var addReminderBtn = document.getElementById("addReminderBtn");
    addReminderBtn.addEventListener("click", addReminder);
    
    //REMINDER
    var remCount = localStorage.getItem("remCount");
    
    if (remCount === null) {
        remCount = 0;
    }
    
    function addReminder() {
        alert("Add functions runs");
        remCount++;

        var date = document.getElementById("date").value,
            time = document.getElementById("time").value,
            title = document.getElementById("title").value,
            message = document.getElementById("message").value,
            id = remCount;
        
        if(date == "" || time == "" || title == "" || message == "") {
            alert("Please enter all details");
            return;
        }

        //generate a time to post notification
        var slctdTime = new Date((date + " " + time).replace(/-/g, "/")).getTime();
        slctdTime = new Date(slctdTime);

        //setup notification    
        cordova.plugins.notification.local.schedule({ 
            id: id,
            title: title,
            text: message,
            at: slctdTime
        });

        //Display new reminder
        $("<div />")
            .attr("id", "rem" + remCount + "container")
            .text(id + ": " + title + " " + message + " " + slctdTime)
            .appendTo("#remContainer");
        
        //Store info in local storage
        localStorage.setItem("RemCount", id);
        localStorage.setItem("Rem" + id + "title", title);
        localStorage.setItem("Rem" + id + "message", message);
        localStorage.setItem("Rem" + id + "date", slctdTime);        

    }
}

$(document).ready(function () {
    //NOTES
    var savesnotesbtn = document.getElementById("savenotesbtn");
    var addnotebtn = document.getElementById("addNoteBtn");
    var noteNumberInput = document.getElementById("noteNumberInput");
    var editNoteBtn = document.getElementById("editNoteBtn");
    var deleteNoteBtn = document.getElementById("deleteNoteBtn");
    var noteCount = localStorage.getItem("noteCount");  
    
    
    
    //LISTS
    var listInput = document.getElementById("listInput");
    var listCount = localStorage.getItem("listCount");

    
    if (noteCount === null) {
        noteCount = 0;
    }
    
    
    if (listCount === null) {
        noteCount = 0;
    }
    
    displayNotes();
    displayList();
    
    //DETECT PAGE CHANGE, EDIT FOOTER
    $( window ).hashchange(function() {
        var currentPage = $.mobile.pageContainer.pagecontainer( 'getActivePage' ).attr( 'id' );
        console.log(currentPage);
        if (currentPage == "article1") {
            $(".notespagebtn").addClass("currentPage");
            $(".reminderspagebtn").removeClass("currentPage");
            $(".listspagebtn").removeClass("currentPage");
        }
        
        if (currentPage == "article2") {
            $(".reminderspagebtn").addClass("currentPage");
            $(".notespagebtn").removeClass("currentPage");
            $(".listspagebtn").removeClass("currentPage");
        }
        
        if (currentPage == "article3") {
            $(".listspagebtn").addClass("currentPage");
            $(".notespagebtn").removeClass("currentPage");
            $(".reminderspagebtn").removeClass("currentPage");
        }
    });
    
    //SWIPE LEFT
    $(document).on('swipeleft', '.ui-page', function (event) {
        if (event.handled !== true) { // This will prevent event triggering more then once   
            var nextpage = $.mobile.activePage.next('[data-role="page"]');
            // swipe using id of next page if exists
            if (nextpage.length > 0) {
                $.mobile.changePage(nextpage, {transition: "slide", reverse: false}, true, true);
            }
            event.handled = true;
        }
        return false;
    });

    //SWIFE RIGHT
    $(document).on('swiperight', '.ui-page', function (event) {
        if (event.handled !== true) { // This will prevent event triggering more then once
            var prevpage = $(this).prev('[data-role="page"]');
            if (prevpage.length > 0) {
                $.mobile.changePage(prevpage, {transition: "slide", reverse: true}, true, true);
            }
            event.handled = true;
        }
        return false;
    });
    
    
    //FOOTER NAVIGATION
    $(".notespagebtn").click(function() {
        $.mobile.changePage("#article1");
        $(".notespagebtn").addClass("currentPage");
        $(".reminderspagebtn").removeClass("currentPage");
        $(".listspagebtn").removeClass("currentPage");
    });
    
    $(".reminderspagebtn").click(function() {
        $.mobile.changePage("#article2");
        $(".reminderspagebtn").addClass("currentPage");
        $(".notespagebtn").removeClass("currentPage");
        $(".listspagebtn").removeClass("currentPage");
    });
    
    $(".listspagebtn").click(function() {
        $.mobile.changePage("#article3");
        $(".listspagebtn").addClass("currentPage");
        $(".notespagebtn").removeClass("currentPage");
        $(".reminderspagebtn").removeClass("currentPage");
    });
    
    
    
    //ADD NOTES
    function addNotes() {
        if ($("#noteInput").val() == "") {
            alert("Cannot add an empty note. Please enter your note into the text area and then click 'Add Note'.");
        } else {
            noteCount++;
            var note = $("#noteInput").val();
            console.log("Note Count: " + noteCount);
            var display = document.createElement("div");
            document.getElementById("displayContainer").appendChild(display);
            display.className = "noteDisplay";
            display.id = "note" + noteCount;
            $("#note" + noteCount).text("Note " + noteCount + ": " + note);
            
            //Store the notecount
            localStorage.setItem("noteCount", noteCount);
            
            //Store the notes
            localStorage.setItem("note" + noteCount, "Note " + noteCount + ": " + note); //"Note " + noteCount + ": " + 
        }
    }
    
    //DISPLAY NOTES
    function displayNotes() {
        for (var i = 1; i < +localStorage.noteCount + 1; i++) {
            var note = localStorage.getItem("note" + i);
            if (note !== null) {
                var display = document.createElement("div");
                document.getElementById("displayContainer").appendChild(display);
                display.className = "noteDisplay";
                display.id = "note" + i;
                $("#note" + i).text(note); 
            }
             
        }
    }
    
    
    //EDIT NOTES
    function editNotes() {
        var noteId = $("#noteNumberInput").val(),
            editInput = $("#noteEditInput").val();
        
        if (isNaN(noteId)) {
            alert("Please only enter the note number e.g. 1, 2..14 etc.");
        } else {
            $("#note" + noteId).text( "Note " + noteId + ": " + editInput);
        
            //Store the updated note
            localStorage.setItem("note" + noteId, "Note " + noteId + ": " + editInput);
        }
        
    }
    
    //DELETE NOTES
    function deleteNotes() {
        var noteId = $("#noteNumberInput").val(),
            selectedNote = $("#note" + noteId);
        
        //Remove the note from the page
        selectedNote.remove();
        
        //Remove note from local storage
        localStorage.removeItem('note' + noteId);
        
    }
    
    
    //ADD LIST ITEM
    $("#listForm").submit(function(ev) {
        ev.preventDefault();
        var $listInput = $("#listInput");
        var input = $listInput.val();

        if (input == "") {
            alert("Please enter the item name, then click 'Add'.");
        } else {
            listCount++;

            $("<div />")
                .attr("id", "input" + listCount + "container")
                .attr("class", "inputContainer")
                .appendTo("#checkboxContainer");

            $("<input />")
                .attr("id", "input" + listCount)
                .attr("type", "checkbox")
                .attr("class", "inline checkbox")
                .appendTo("#input" + listCount + "container");

            $("<label />") //create new label
                .attr("id", "label" + listCount) //set ID
                .attr("for", "input" + listCount) //set For
                .attr("class", "inline")
                .attr("data-roll", "none")
                .html(input) //set contents
                .appendTo("#input" + listCount + "container");//add to checkbox container

            $("<img />")
                .attr("id", "closeBtn" + listCount)
                .attr("class", "closeBtn right")
                .attr("src", "assets/android-close.png")
                .appendTo("#input" + listCount + "container");


            //Store the list count
            localStorage.setItem("listCount", listCount);

            //Store the list title
            localStorage.setItem("input" + listCount, input); //"Note " + noteCount + ": " + 

        }
    });

    
    //DISPLAY LISTS
    function displayList() {
        for (var i = 1; i < +localStorage.listCount + 1; i++) {
            var listItem = localStorage.getItem("input" + i);
            var checked = localStorage.getItem(i + "checked");
            if (listItem !== null) {
                $("<div />")
                    .attr("id", "input" + i + "container")
                    .attr("class", "inputContainer")
                    .appendTo("#checkboxContainer");

                if (checked === "true") {
                    $("<input />")
                        .attr("id", "input" + i)
                        .attr("type", "checkbox")
                        .attr("class", "inline checkbox")
                        .prop("checked", true)
                        .attr("data-role", "none")
                        .appendTo("#input" + i + "container");
                } else {
                   $("<input />")
                        .attr("id", "input" + i)
                        .attr("type", "checkbox")
                        .attr("class", "inline checkbox")
                        .prop("checked", false)
                        .attr("data-role", "none")
                        .appendTo("#input" + i + "container"); 
                }

                $("<label />") //create new label
                    .attr("id", "label" + i) //set ID
                    .attr("for", "input" + i) //set For
                    .attr("class", "inline")
                    .attr("data-role", "none")
                    .html(listItem) //set contents
                    .appendTo("#input" + i + "container");//add to checkbox container

                $("<img />")
                    .attr("id", "closeBtn" + i)
                    .attr("class", "closeBtn right")
                    .attr("src", "assets/android-close.png")
                    .appendTo("#input" + i + "container");
            }
        }
    }

    //DELETE LIST ITEM
    function deleteItem() {
        var id = $(this).attr('id'),
            numSlctr = id.replace( /^\D+/g, ''),
            selectedItem = $("#input" + numSlctr + "container");
        
        //Remove the item from the page
        selectedItem.remove();
        
        //Remove item from local storage
        localStorage.removeItem('input' + numSlctr);
    }
    
    //WHEN BOX CHECK IS CHANGED
    function boxChanged() {
        var id = $(this).attr('id'),
            numSlctr = id.replace( /^\D+/g, '');
        
        if ($(this).is(':checked')) {
            localStorage.setItem(numSlctr + "checked", "true");
        } else {
            localStorage.setItem(numSlctr + "checked", "false");
        }
    }
    
    

    
    //EVENT LISTERNERS
    //Notes
    addnotebtn.addEventListener("click", addNotes);
    editNoteBtn.addEventListener("click", editNotes);
    deleteNoteBtn.addEventListener("click", deleteNotes);
    
    //Reminders
    
    
    //Lists
    $(document).on('click', '.closeBtn', deleteItem);
    $("#checkboxContainer").on('change', '.checkbox', boxChanged);
    
});


/*document.addEventListener('deviceready', function () {
    alert("deviceready");
    // cordova.plugins.notification.local is now available
    var addReminderBtn = document.getElementById("addReminderBtn");
    
    //ADD REMINDER
    function addReminder() {
        alert("Add functions runs");
        
        var date = document.getElementById("date").value;
        var time = document.getElementById("time").value;
        var title = document.getElementById("title").value;
        var message = document.getElementById("message").value;
        
        cordova.plugins.notifications.local.schedule({
            id: 1,
            text: message,
            title: title,
            at: date
        });
        
        		
	//
    //generate a time to post notification
    //
    var currentTime = new Date().getTime(); //current time
    var notificationTime = new Date(currentTime + 1000); //delayed time  - add 1 second
    			
    //
    //setup notification
    //
    
    cordova.plugins.notification.local.schedule({ 
    	id: 1,
        title: "Hey you",
        text: "This is an example notification",
        at: notificationTime
   	});
    
}
    
    
    addReminderBtn.addEventListener("click", addReminder);
    
}, false); */  





