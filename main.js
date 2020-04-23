
// Firebase Integration
    firebase.initializeApp({
        apiKey: "AIzaSyBm0JiYrZS6RNVqg8qRCs-doJtrv5rNYYQ",
        authDomain: "tryfordsc.firebaseapp.com",
        databaseURL: "https://tryfordsc.firebaseio.com",
        projectId: "tryfordsc",
        storageBucket: "tryfordsc.appspot.com",
        messagingSenderId: "477532013523",
        appId: "1:477532013523:web:d7c9a27c450040be"
    });

var contentRef = firebase.database().ref("content/");



const inputTaken = $("#toBeEntered");
var inputContent = "";
var displayContent = "";
const parent = $("ul");



//  Retireving initial data
    retrieveIntialData();
    function retrieveIntialData(){
        var dataAll = firebase.database().ref("content/");
        dataAll.once("value", function(retrieve){
            
            retrieve.forEach(function(retrieveChild){
                var retrieveChildData = retrieveChild.val().newText;
                var retrieveKey = retrieveChild.key;
                
                $("ul").append("<li><input type='text' value='"+ retrieveChildData + "' class='display'></input><span class='delete'><i class='fas fa-minus-circle'></i></span><span class='key' style='display: none'>" + retrieveKey + "</span></li><hr>");
            })
        })
    }



//  Entering new input
    inputTaken.on("keypress",function(event){
        if( event.which === 13 )
        {
            inputContent = $(this).val();
            if(inputContent === "")
            {
                alert("Input is Empty. Please Enter Some Text");
                $(this).blur();
            }
            else{
                $(this).val("");
                $(this).blur();
                saveContent(inputContent);
            }
        }
    })

    //  Adding Text to Firebase, Retrieving it, Saving unique key in span, Appending to List
    function saveContent(inputContent){
        var newContent = contentRef.push();

        newContent.set({
            newText: inputContent
        });

        var newContentKey = newContent.key;

        firebase.database().ref("content/").child(newContentKey).child("newText").once("value", function(dataRetrieved){

            $("ul").append("<li><input type='text' value='"+ dataRetrieved.val() + "' class='display'></input><span class='delete'><i class='fas fa-minus-circle'></i></span><span class='key' style='display: none'>" + newContentKey + "</span></li><hr>");

        })
    }



//  Functions for Label
    inputTaken.focusin(function(){
        $("label").toggleClass("forLabel");
    })

    inputTaken.focusout(function(){
        $("label").toggleClass("forLabel");
    })



//  Updating the Text
    parent.on("keypress", "li ", function(event){
        if( event.which === 13 )
        {
            $(this).children(".display").blur();
            var newKey = $(this).children(".key").text();

            displayContent = $(this).children(".display").val();


            updateFirebase(displayContent, newKey);
        }
    })

    // Updating on Firebase
    function updateFirebase(displayContent, newKey){
        var newText = {
            newText: displayContent
        };
        var updates = {};
        updates["content/" + newKey] = newText;
        return firebase.database().ref().update(updates);
        
        // newText.set({
        //     newText: displayContent
        // });
    }



    //  Delete Function
    parent.on("click", "li .delete", function(){
        $(this).parent().slideUp(200,function(){
            $(this).remove();
        });
        event.stopPropagation();

        var deleteKey = $(this).parent().children(".key").text();
        return firebase.database().ref("content/").child(deleteKey).remove();
    })
