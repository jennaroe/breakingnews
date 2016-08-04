// Click Events

//
$('#addComment').on('click', function(){
  $.ajax({
    type: "POST",
    url: '/submit',
    dataType: 'json',
    data: {
      id: $('#articleTitle').attr('data-id'),
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

//Delete comment 

$('.delete').on('click', '.comment', function(){
    var thisId = $(this).attr('data-id');
    $.ajax({
      type: "POST",
      url: '/delete/' + thisId,
    });
    $(this).parents().remove();
    getComment();
});


// refresh box for new article 


// $(document).on('click', '.article', function(){
//     var thisId = $(this).attr('data-id');
//     $.ajax({
//       type: "GET",
//       url: '/article/' + thisId,
//     });
//     $(this).parents().remove();
//     getComment();
// });




// Get comments and articles on screen

function getComment(){
  $('#dbComments').empty();
  $.getJSON('/comment', function(data) {
    for (var i = 0; i< data.length; i++){
      $('#dbComments').prepend('<tr><td>' + data[i].comment + '</td>' + '</td><td><button class="delete" data-id="' +data[i]._id+ '">Delete</button></td></tr>');
      console.log(data, "IMM DATTTTTAAA")
    }
  });
}

function getArticle(){
  $('#article').empty();
  $.getJSON('/article', function(data) {
    console.log(data)
    $('#article').prepend('<div id="articleTitle" data-id="'+ data[0]._id + '" >'+data[0].title+'</div>');
  });
}

getComment();
getArticle();
