//Axios Global
axios.defaults.headers.common['X-auth-token'] = 'some--token';

// GET REQUEST
function getTodos() {
  axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5',{
    timeout :5000
  })
    .then(res => showOutput(res))
    .catch(err => console.log(err))
}

// POST REQUEST
function addTodo() {
  axios.post('https://jsonplaceholder.typicode.com/todos?_limit=5',
    { title: 'new one', completed: false })
    .then(res => showOutput(res))
    .catch(err => console.log(err))
}


// PUT->it will replace the whole
//PATCH REQUEST
function updateTodo() {
  axios.patch('https://jsonplaceholder.typicode.com/todos/1', {
    title: 'Updated', completed: true
  }).then(res => showOutput(res))
    .catch(err => console.log(err))
}

// DELETE REQUEST
function removeTodo() {
  axios.delete('https://jsonplaceholder.typicode.com/todos/1')
    .then(res => showOutput(res))
    .catch(err => console.log(err))
}

// SIMULTANEOUS DATA SLIM REQUEST
function getData() {
  axios.all([
    axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5'),
    axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5')
  ]).then(axios.spread((todo, post) => showOutput(todo)))//we can get whichever we want
    .catch(err => console.log(err))
}

// CUSTOM HEADERS
function customHeaders() {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorizataion: 'Some token'
    }
  }
  axios.post('https://jsonplaceholder.typicode.com/todos?_limit=5',
    { title: 'new one', completed: false }, config)
    .then(res => showOutput(res))
    .catch(err => console.log(err))
}

// TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {
  const option = {
    method: 'post',
    url: 'https://jsonplaceholder.typicode.com/todos',
    data: {
      title: 'hello world'
    },
    transformResponse: axios.defaults.transformResponse.concat(data => {
      data.title = data.title.toUpperCase();
      return data;
    })
  }
  axios(option).then(res => showOutput(res))
}

// ERROR HANDLING
function errorHandling() {
  axios
    .get('https://jsonplaceholder.typicode.com/todos?_limit=5')
    .then(res => showOutput(res))
    .catch(err => {
      if (err.response) {
        if (err.response.status === 404) {
          alert('error : page not found')
        }
      }
      else if (err.request) {
        console.log(err.request);
      } else {
        console.log(err.message);
      }
    });
}

// CANCEL TOKEN
function cancelToken() {
  const source = axios.CancelToken.source();
  axios.get('https://jsonplaceholder.typicode.com/todos', {
    cancelToken: source.token
  })
    .then(res => {
      showOutput(res)
    })
    .catch(thrown => {
      if (axios.isCancel(thrown)) {
        console.log('req cancelled', thrown.msg);
      }
    });
  if (true) {
    source.cancel('Request cancel');
  }
}

// INTERCEPTING REQUESTS & RESPONSES
axios.interceptors.request.use(config => {
  console.log(`${config.method.toUpperCase()} request send to 
  ${config.url} at ${new Date()}`);
  return config;
},
  error => {
    return Promise.reject(error);
  }
);

// AXIOS INSTANCES
const instance = axios.create({
  baseURL : 'https://jsonplaceholder.typicode.com'
});
//instance.get('/comments').then(res=>showOutput(res))

// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
    <div class="card card-body mb-4">
      <h5>Status: ${res.status}</h5>
    </div>
  
    <div class="card mt-3">
      <div class="card-header">
        Headers
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.headers, null, 2)}</pre>
      </div>
    </div>
  
    <div class="card mt-3">
      <div class="card-header">
        Data
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.data, null, 2)}</pre>
      </div>
    </div>
  
    <div class="card mt-3">
      <div class="card-header">
        Config
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.config, null, 2)}</pre>
      </div>
    </div>
  `;
}

// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
  .getElementById('transform')
  .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);