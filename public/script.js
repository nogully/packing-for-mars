$('#item-submit').on('click', () => addItem());
  

const loadItems = async () => {
  $('main').empty();
  try {
    const response = await fetch('/api/v1/items');
    const list = await response.json();
    if (list) {
      list.forEach(item => {
        $('main').append(`<p>${item}</p>`)
      })
    } else {
      $('main').append(`<p>Try adding some items!</p>`)
    }
  } catch (error) {
    throw error;
  }
}

const addItem = () => {
  event.preventDefault();
  const item = $('#item-input').val();
  if (item) {
    sendItemToDb(item);
    loadItems();
  } else {
    $('main').append(`<p>Try adding some items!</p>`)
  }
  
};

const sendItemToDb = (item) => {
  const response = await fetch('/api/v1/items', {
    method: 'POST', 
    headers: { 'Content-Type': 'application/json'}
    body: JSON.stringify({
      name: item
    })
  })
  console.log(response)
};

