let dropped;

$(() => {
///// setting up variables for drag and drop

  const $pic1 = $('#pic1');
  const $slots = $('.slots')
  let pickedUpFrom = ''
  let heldItem = ''

  ///// drag functions
  const dragStart = (event) => {
    if (event.target !== event.currentTarget) {
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
    }
  }

  const dragEnter = () => {
    //check if slot is occupied
    if ($(event.target).attr('class') !== 'fill') {
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
      $(event.target).append($(`#${heldItem}`).attr('class', 'fill'));
      dropped = true;
    }
  }


  const dragEnd = (event) => {
    if (event.target !== event.currentTarget) {
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
