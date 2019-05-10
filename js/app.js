
/// functions

const darkMode = (event) => {
  // check if dark mode toggle on
  if (!$('#checkbox').is(':checked')) {
    // change class of body
    console.log('dark mode class added to body');
    $('body').addClass('darkmode');

    //change class of other elements
    // code here

  } else {
    // remove dark classes from all elements on page
    console.log('dark mode class removed from body');
    $('body').attr('class', '')
  }
};



$(() => {
  //grabbing nodes
  const $darkModeButton = $('.slider');


// listeners
  $darkModeButton.on('click', () => {
    darkMode(event);
  })
})
