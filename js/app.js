///// establishing query url for ajax

const baseURL = `https://gateway.marvel.com:443/v1/public/characters?`;
let ts = `1234567654321`;
const apiKey = `apikey=012c4351d4aecfb2c181fd0b1977192d`;
const privateKey = `4ed1801c49dd47d9034022152101a0959db7b215
`;
let hash = `81f0138cb4590bc6deaacb6e4db98c31`
let queryType = `nameStartsWith=`

// name that will be decided by user
// let characterName = 'black panther';

//  hash must = `md5 of ts+privateKey+apiKey`

let queryURL = baseURL + `ts=`+ ts + `&` + apiKey + `&` + `hash=` + hash + `&` + queryType







//// global variable to keep track of dragged node
let dropped;

// function that will make call to API

$(() => {

  const getCharacter = (hero) => {
    $.ajax({
          url: queryURL + hero
        }).then((data) => {
          console.log(data);
          // get thumbnail img
        const imgSrc = (data.data.results[0].thumbnail.path +`.`+ data.data.results[0].thumbnail.extension);

        // create and append card to available slot
        if ($('#drawSlot1').children().length === 0) {
          $('#drawSlot1').append($('<div>').addClass('card').attr({'id': 'card1', 'draggable': 'true'}).css('background-image', `url('${imgSrc}')`));
        } else if ($('#drawSlot2').children().length === 0) {
          $('#drawSlot2').append($('<div>').addClass('card').attr({'id': 'card2', 'draggable': 'true'}).css('background-image', `url('${imgSrc}')`));
        } else if ($('#drawSlot3').children().length === 0) {
          $('#drawSlot3').append($('<div>').addClass('card').attr({'id': 'card3', 'draggable': 'true'}).css('background-image', `url('${imgSrc}')`));
        } else {
          console.log('cards filled!')
        }
      })
    }


///// functions to give delete card option

  const deleteButton = $('<div>').addClass('deleteButton')
  const showDelete = (event) => {
    if (event.target !== event.currentTarget) {
      $(event.currentTarget).children().eq(0).append(deleteButton);
    }
  }

  const removeDelete = (event) => {
    if (event.target !== event.currentTarget) {
      $('div[class="deleteButton"]').remove()
    }
  }

  const deleteResponse = (event) => {
    if ($(event.target).attr('class') === 'deleteButton') {
      $(event.target).text('X')
    } else {
      $('div[class="deleteButton"]').text('')
    }
  }


  const removeCard = () => {

    if ($(event.target).attr('class') === 'deleteButton') {
      $(event.target).parent().remove()
    }

  }











///// setting up variables for drag and drop

  const $slots = $('.slots')
  let pickedUpFrom = ''
  let heldItem = ''

  ///// drag functions
  const dragStart = (event) => {
    if (event.target !== event.currentTarget) {
      //change stage slots to indicate dropzone
      $('#compareSlot1').css('background', 'lightblue').css('border', '2px dashed black');
      $('#compareSlot2').css('background', 'lightblue').css('border', '2px dashed black');
      // add a class to show card is being held onto
      $(event.target).addClass('hold');
      // make the card invisible in its original slot, but wait a little
      // so that you can still "hold" onto the item
      setTimeout(() => {
        $(event.target).attr('class', 'invisible')
      }, 1);
      // change heldItem to id of item we are holding
      heldItem = $(event.target).attr('id');

      // set pickedUpFrom to the parent of where you took the div from
      pickedUpFrom = $(event.target).parent().attr('id');

      // make stage slots glow to indicate to user to go drag there

    }
  }

  const dragEnter = () => {
    //check if slot is occupied
    if ($(event.target).attr('class') !== 'card') {
      // give the slot a new class to show its being hovered over
      if ($(event.target).parent() === 'stage') {
        $(event.target).addClass('stageHovered');
      } else {
        $(event.target).addClass('hovered');
      }
    }
  }

  const dragOver = () => {
    /// this makes the dragDrop function work
    event.preventDefault();
  }

  const dragLeave = () => {
    //check if slot is occupied
    if ($(event.target).attr('class') !== 'card') {
      /// set card slot class back to normal
      $(event.target).attr('class', 'slots')
    }
  }

  const dragDrop = (event) => {
    ///// if item dropped on a card slot, then take away the
    ////  invisible class and append the dragged item to it
    /// also set dropped to true to prevent dragEnd from putting
    /// item back into its original slot
    if (event.target.classList.contains('slots')) {
      //revert stage slots back to normal
      $('#compareSlot1').css('background', 'white').css('border', '1px black solid');
      $('#compareSlot2').css('background', 'white').css('border', '1px black solid')
      $(event.target).removeClass('hovered');
      $(event.target).append($(`#${heldItem}`).attr('class', 'card'));
      dropped = true;
    }
  }


  const dragEnd = (event) => {
    if (event.target !== event.currentTarget) {
      // revert stage slots back to normal
      $('#compareSlot1').css('background', 'white').css('border', '1px black solid');
      $('#compareSlot2').css('background', 'white').css('border', '1px black solid');
      /// check if dropped is true, then change it to false and stop
      if (dropped === true) {
        dropped = false;
        return
      }
      /// if dropped is false, then return back to original slot
      $(event.target).attr('class', 'card');
      $(`#${pickedUpFrom}`).append($(event.target));
    }
}

  ///// listeners


// input
  $('form').on('submit', (event) => {
    event.preventDefault();
    const myCharacter = $('#textbox').val();
    getCharacter(myCharacter);
    $(event.currentTarget).trigger('reset');

  })

  // loop to set listeners on all card slots
  for (let i = 0; i < $slots.length; i++) {
    // the callback function on these will run when event.target is
    // currentTarget
    $slots.eq(i).on('dragover', dragOver);
    $slots.eq(i).on('dragenter', dragEnter);
    $slots.eq(i).on('dragleave', dragLeave);
    $slots.eq(i).on('drop', dragDrop);
    // the callback function on these will run when event.target is
    // NOT currentTarget. in other words, will work with card not slot
    $slots.eq(i).on('dragstart', dragStart);
    $slots.eq(i).on('dragend', dragEnd);
        // show and remove delete button
    $slots.eq(i).hover(showDelete, removeDelete)

        // listener that will respond to hovering over delete btn
    $slots.eq(i).mouseover(deleteResponse)

        // listener that will respond to clicking delete btn and
        // delete card
    $slots.eq(i).on('click', removeCard)

  }



})
