let search = $("#livesearch");

function showResult(str){
    if(str.length === 0){
        search.addClass("hide")
    }else{
        search.removeClass("hide");
    }

    console.log('quang');
    $.ajax({
        url: "/search",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({search: str}),
        success: function(result){
            search.html(result.response);
        }
    });
}