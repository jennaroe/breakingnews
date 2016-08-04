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


// refresh box for new article 


$(document).on('click', '.article', function(){
    var thisId = $(this).attr('data-id');
    $.ajax({
      type: "GET",
      url: '/article/' + thisId,
    });
    $(this).parents().remove();
    getComment();
});

//Delete comment 

$('#delete').on('click', '.comment', function(){
    var thisId = $(this).attr('data-id');
    $.ajax({
      type: "POST",
      url: '/delete/' + thisId,
    });
    $(this).parents().remove();
    getComment();
});






// Get comments and articles on screen

function getComment(){
  $('#dbComments').empty();
  $.getJSON('/comment', function(data) {
    for (var i = 0; i<data.length; i++){
      $('#dbComments').prepend('<tr><td>' + data[i].comment + '</td>' + '</td><td><button class="delete" data-id="' +data[i]._id+ '">Delete</button></td></tr>');
      console.log(data, "IMM DATTTTTAAA")
    }
  });
}

function getArticle(){
  $('#article').empty();
  $.getJSON('/article', function(data) {
    for (var i = 0; i<= 1; i++){
      $('#article').prepend(data[i].title);
    }
  });
}

getComment();
getArticle();
