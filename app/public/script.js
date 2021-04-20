
const todoUrl = 'http://localhost:3000/dashboard'



// Delete - DELETE symptoms
$('.symptom-list').on('click', 'span', function(event){
    event.stopPropagation();
    $(this).addClass('removed')
    var self = this; 
    var thisId = $(this).parent().data('id');
    
    var url = `${todoUrl}/symptom/${thisId}`
    $.ajax({
        url: url,
        method: 'DELETE',
    })
    .done('transitioned', '.removed', function(){
        $(self).parent().remove(); // removes the li element of the span clicked in browser

    })
    .fail(function(err){
        console.log('Delete failed with error ', err)
    });
  });



  // Delete - DELETE treatment
$('.treatment-list').on('click', 'span', function(event){
    event.stopPropagation();
    $(this).addClass('removed')
    var self = this; 
    console.log('I am self: ', self)
    
    var thisId = $(this).parent().data('id');
    console.log('I am the id ', thisId)
    var url = `${todoUrl}/treatment/${thisId}`;
    $.ajax({
        url: url,
        method: 'DELETE',
    })
    .done('transitioned', '.removed', function(){
        $(self).parent().remove(); // removes the li element of the span clicked in browser
        refresh()
    })
    .fail(function(err){
        console.log('Delete failed with error ', err)
    });
  });
  

    // Delete - DELETE treatment
$('.doctor-list').on('click', 'span', function(event){
    event.stopPropagation();
    $(this).addClass('removed')
    var self = this; 
    console.log('I am self: ', self)
    
    var thisId = $(this).parent().data('id');
    console.log('I am the id ', thisId)
    var url = `${todoUrl}/doctor/${thisId}`;
    $.ajax({
        url: url,
        method: 'DELETE',
    })
    .done('transitioned', '.removed', function(){
        $(self).parent().remove(); // removes the li element of the span clicked in browser
    })
    .fail(function(err){
        console.log('Delete failed with error ', err)
    });
  });
