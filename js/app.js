

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
        const description = (data.data.results[0].description);
        console.log(description);

        // check for available slots, then append to first avail

        for (let i= 2; i < $('.slots').length; i++) {
          if ($('.slots').eq(i).children().length === 0) {
            //// create card
            const $newCard = $('<div>').addClass('card').attr('draggable', 'true');

            const $cardPic = $('<div>').css('background-image', `url('${imgSrc}')`).addClass('cardPic');

            const $cardInfo = $('<p>').attr('class', 'cardInfo').append(`${description}`);

            $newCard.append($cardPic).append($cardInfo)

            ///// append card to correct slot

            //// add listeners to new card
            $newCard.on('dragstart', dragStart);
            $newCard.on('dragend', dragEnd);
            $newCard.hover(showDelete, removeDelete);
            $newCard.on('click', removeCard);

            $(`#drawSlot${i-1}`).append($newCard);

            if ($('.card').length > 1) {
              $('#compareSlot1').addClass('stageAppear')
              $('#compareSlot2').addClass('stageAppear');

            }



            return
          } else {
            console.log('cards filled');
          }
        }





      })
    }


///// functions to give delete card option

  const deleteButton = $('<div>').addClass('deleteButton').append('&times;');

  const showDelete = (event) => {

      $(event.currentTarget).prepend(deleteButton);
      if ($(event.currentTarget).parent().parent().attr('class') !== 'stage') {
      }

      $(event.currentTarget).addClass('glow');

  }

  const removeDelete = (event) => {
      $('div[class="deleteButton"]').remove();
  }




  const removeCard = () => {
    if ($(event.target).attr('class') === 'deleteButton') {
      $(event.target).parent().remove()
    }
  }











///// setting up variables for drag and drop

  const $slots = $('.slots')
  let pickedUpFrom = ''
  let $heldItem;

  ///// drag functions
  const dragStart = (event) => {
      //change stage slots to indicate dropzone
      $('#compareSlot1').addClass('stageGlow')
      $('#compareSlot2').addClass('stageGlow');
      // add a class to show card is being held onto
      $(event.currentTarget).addClass('hold');
      // make the card invisible in its original slot, but wait a little
      // so that you can still "hold" onto the item
      setTimeout(() => {
        $(event.currentTarget).attr('class', 'invisible')
      }, 1);
      // change heldItem to  item we are holding
      $heldItem = $(event.currentTarget);
      // console.log($heldItem);

      // set pickedUpFrom to the parent of where you took the div from
      pickedUpFrom = $(event.currentTarget).parent().attr('id');
      console.log(pickedUpFrom);


      // make stage slots glow to indicate to user to go drag there

  }

/////// drag enter elements, setting hover to elements, need to set to card not event.
  const dragEnter = () => {
    //check if slot is occupied
    if (!$(event.target).parents('div.slots').length) {
      // give the slot a new class to show its being hovered over
        $(event.target).addClass('hovered');
    }
  }

  const dragOver = () => {
    /// this makes the dragDrop function work
    event.preventDefault();
  }

  const dragLeave = () => {
    //check if slot is occupied
    if (!$(event.target).parents('div.slots').length) {
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
      // revert stage slots back to normal but first...
        // if ($(event.target).parent()) {
        //   $('#compareSlot1').attr('class', 'slots');
        //   if ($('#compareSlot2').children().length > 0) {
        //     $('#compareSlot2').attr('class', 'slots');
        //   }
        // }
      $(event.target).attr('class', 'slots');
      $(event.target).append($heldItem.attr('class', 'card'));
      dropped = true;
    }
  }


  const dragEnd = (event) => {
      // revert stage slots back to normal if less than 2 cards on board
      if ($('.card').length < 2) {
      $('#compareSlot1').attr('class', 'slots')
      $('#compareSlot2').attr('class', 'slots')
    } else {
      $('#compareSlot1').attr('class', 'slots stageAppear');
      $('#compareSlot2').attr('class', 'slots stageAppear');
    }
      /// check if dropped is true, then change it to false and stop
      if (dropped === true) {
        dropped = false;
        return
      }
      /// if dropped is false, then return back to original slot
      $(event.target).attr('class', 'card');
        if ($('.card').length > 1) {
          $('#compareSlot1').attr('class', 'slots stageAppear');
          $('#compareSlot2').attr('class', 'slots stageAppear');
        }
      $(`#${pickedUpFrom}`).append($(event.target));


}

  ///// listeners


// input
  $('form').on('submit', (event) => {
    event.preventDefault();
    let myCharacter = $('#textbox').val();
    /// correct spelling of spiderman to fit API 
    if (myCharacter === 'spiderman' || myCharacter === 'Spiderman' || myCharacter === 'spider man' || myCharacter === 'Spider man') {
      myCharacter = 'spider-man'
    }
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
    // NOT currentTarget. in other words, will work with card, not slot
  //   $slots.eq(i).on('dragstart', dragStart);
  //   $slots.eq(i).on('dragend', dragEnd);
  //       // show and remove delete button
  //   $slots.eq(i).hover(showDelete, removeDelete)
  //
  //       // listener that will respond to hovering over delete btn
  //   $slots.eq(i).mouseover(deleteResponse)
  //
  //       // listener that will respond to clicking delete btn and
  //       // delete card
  //   $slots.eq(i).on('click', removeCard)
  //
  // }

}

})
