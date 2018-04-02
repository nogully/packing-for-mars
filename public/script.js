$('#item-submit').on('click', () => addItem());


const loadItems = () => {
  $('main').empty();
}

const addItem = () => {
  event.preventDefault();
  const item = $('#item-input').val();
  console.log(item)
  sendItemToDb();
};

const sendItemToDb = (item) => {
  console.log('I wanna send it to the db')
};

