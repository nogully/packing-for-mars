$(document).ready(() => loadItems());
$('#item-submit').on('click', () => addItem());
  

const loadItems = async () => {
  $('main').empty();
  try {
    const response = await fetch('/api/v1/items');
    const list = await response.json();
    if (list) {
      list.forEach(item => {
        const checked = item.packed === 't' ? true : false;
        $('main').append(`
          <article id="${item.id}">
          <h2>${item.name}</h2>
          <input id="checkbox" type="checkbox" checked="${checked}">
          <label for="checkbox">Packed</label>
          <h4>DELETE</h4>
          </article>
        `)
      })
    } else {
      $('main').append(`<h3>Try adding some items</h3>`)
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

const sendItemToDb = async (item) => {
  try {
    const response = await fetch('/api/v1/items', {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: item
      })
    }) 
    if (response) {
      console.log(`${item} sent to db`)
    } 
  } catch (error) { 
    throw error;
  }
  
};
