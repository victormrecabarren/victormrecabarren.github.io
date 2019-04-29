$(() => {
///// setting up variables for drag and drop

  const $fill = $('.fill');
  const $cards = $('.cards')


  ///// drag functions
  const dragStart = (event) => {
    console.log('dragStart');
    console.log($(event.target).attr('id'));

    $(event.target).addClass('hold');
    setTimeout(() => {
      $(event.target).attr('class', 'invisible')
    }, 1);

    const thingImGrabbing = $(event.target).attr('id');
    console.log(thingImGrabbing);
  }

  const dragEnter = () => {
    console.log('dragEnter');
    console.log($(event.target).attr('id'));
    $(event.target).addClass('hovered');
  }

  const dragOver = () => {
    console.log('dragover');
    console.log($(event.target).attr('id'));
    event.preventDefault();
  }

  const dragLeave = () => {
    console.log('dragLeave');
    console.log($(event.target).attr('id'));
    $(event.target).attr('class', 'cards')
  }

  const dragDrop = (event) => {
    console.log('dragDrop');
    console.log($(event.target).attr('id'));

    // if ($(event.target) === null) {
    //
    // }

    $(event.target).append($fill.attr('class', 'fill'));
  }

  const dragEnd = (event) => {
    // console.log('dropped');
  }


  ///// listeners

  for (let i = 0; i < $cards.length; i++) {
    $cards.eq(i).on('dragover', dragOver);
    $cards.eq(i).on('dragenter', dragEnter);
    $cards.eq(i).on('dragleave', dragLeave);
    $cards.eq(i).on('drop', dragDrop);
  }






  $fill.on('dragstart', dragStart)
  $fill.on('dragend', dragEnd)

})
