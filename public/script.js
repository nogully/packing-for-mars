$('#item-submit').on('click', () => addItem());
  

const loadItems = async () => {
  $('main').empty();
  const response = await fetch('/api/v1/items');
  const list = await response.json();
  list.forEach(item => {
    $('main').append(`<p>${item}</p>`)
  })
}

const addItem = () => {
  event.preventDefault();
  const item = $('#item-input').val();
  console.log(item)
  sendItemToDb();
  loadItems();
};

const sendItemToDb = (item) => {
  console.log('I wanna send it to the db')
};

