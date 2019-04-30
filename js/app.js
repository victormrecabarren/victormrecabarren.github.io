///// establishing query url for ajax

const baseURL = `https://gateway.marvel.com:443/v1/public/characters?`;
let ts = `1234567654321`;
const apiKey = `apikey=012c4351d4aecfb2c181fd0b1977192d`;
const privateKey = `4ed1801c49dd47d9034022152101a0959db7b215
`;
const hash = `81f0138cb4590bc6deaacb6e4db98c31`
let queryType = `name=`

// name that will be decided by user
let characterName = 'Spider-Man';

//  hash must = `md5 of ts+privateKey+apiKey`

let queryURL = baseURL + `ts=`+ ts + `&` + apiKey + `&` + `hash=` + hash + `&` + queryType

// function that will make call to API






//// global variable to keep track of dragged node
let dropped;

$(() => {



  const getCharacter = (hero) => {
    $.ajax({
          url: queryURL + hero
        }).then((data) => {
        const imgSrc = (data.data.results[0].thumbnail.path +`.`+ data.data.results[0].thumbnail.extension);
        $('#card1').css('background-image', `url('${imgSrc}')`)
      })
    }


  getCharacter('Spider-Man')





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
    if ($(event.target).attr('class') !== 'fill') {
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
    if ($(event.target).attr('class') !== 'fill') {
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
      $(event.target).append($(`#${heldItem}`).attr('class', 'fill'));
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
      $(event.target).attr('class', 'fill');
      $(`#${pickedUpFrom}`).append($(event.target));
    }
}

  ///// listeners
  // loop to set listeners to all card slots
  for (let i = 0; i < $slots.length; i++) {
    $slots.eq(i).on('dragover', dragOver);
    $slots.eq(i).on('dragenter', dragEnter);
    $slots.eq(i).on('dragleave', dragLeave);
    $slots.eq(i).on('drop', dragDrop);
  }
  // listeners for card
  for (let i = 0; i < $slots.length; i++) {
    $slots.eq(i).on('dragstart', dragStart);
    $slots.eq(i).on('dragend', dragEnd);

  }

    // $pic2.on('dragstart', dragStart)
    // $pic2.on('dragend', dragEnd)

})
