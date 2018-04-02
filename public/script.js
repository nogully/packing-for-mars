$(document).ready(() => loadItems());
$('#item-submit').on('click', () => addItem());
$('main').on('click', 'button', function () {
  const itemId = $(this).parent().attr('id');
  deleteItem(itemId);
  $(this).parent().remove();
}); 
$('main').on('click', '#checkbox', function () {
  const itemId = $(this).parent().attr('id');
  const check = $(this).prop('checked');
  updateChecked(itemId, check);
  $(this).prop('checked', !check);
}); 

const loadItems = async () => {
  $('main').empty();
  try {
    const response = await fetch('/api/v1/items');
    const list = await response.json();
    if (list) {
      list.forEach(item => {
        const checked = item.packed === 't' ? 'checked' : '';
        $('main').append(`
          <article id="${item.id}">
          <h2>${item.name}</h2>
          <input id="checkbox" type="checkbox" ${checked}>
          <label for="checkbox">Packed</label>
          <button>DELETE</button>
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
  } else {
    $('main').append(`<p>Try adding some items!</p>`)
  }
  loadItems();
  $('#item-input').val('');
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

const deleteItem = async (id) => {
  event.preventDefault();
  try {
    const response = await fetch(`/api/v1/items/${id}`, {
      method: 'DELETE', 
      body: JSON.stringify({ id }), 
      headers: { 'Content-Type': 'application/json'}
    });
  } catch (error) {
    throw error;
  }
}

const updateChecked = async (id, checked) => {
  try {
    const response = await fetch(`/api/v1/items/${id}`, {
      method: 'PATCH', 
      body: JSON.stringify({ packed: checked }), 
      headers: { 'Content-Type': 'application/json'}
    });
  } catch (error) {
    throw error;
  }
}
