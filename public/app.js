//

// Click Events

//
$('#addComment').on('click', function(){
  $.ajax({
    type: "POST",
    url: '/submit',
    dataType: 'json',
    data: {
      comment: $('#comment').val(),
      created: Date.now()
    }
  })
  .done(function(data){
    console.log(data);
    getComment();
    $('#comment').val("");
  }
  );
  return false;
});


//refresh box for new article 

$(document).on('click', '.article', function(){
    var thisId = $(this).attr('data-id');
    $.ajax({
      type: "GET",
      url: '/article/' + thisId,
    });
    $(this).parents().remove();
    getComment();
});




// $(document).on('click', '.markunread', function(){
//   var thisId = $(this).attr('data-id');
//   $.ajax({
//     type: "GET",
//     url: '/markunread/' + thisId,
//   });
//   $(this).parents('tr').remove();
//   getUnread();
// });








// Get comments and articles on screen

function getComment(){
  $('#comments').empty();
  $.getJSON('/comment', function(data) {
    for (var i = 0; i<data.length; i++){
      $('#comments').prepend('<tr><td>' + data[i].comment + '</td>' + '</td><td><button class="delete" data-id="' +data[i]._id+ '">Delete</button></td></tr>');
    }
  });
}

function getArticle(){
  $('#article').empty();
  $.getJSON('/article', function(data) {
    for (var i = 0; i<data.length; i++){
      $('#article').prepend(data[i].title);
    }
    // $('#read').prepend('<tr><th>Title</th><th>Author</th><th>Read/Unread</th></tr>');
  });
}

getComment();
getArticle();
