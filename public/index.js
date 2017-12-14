const emailInput = document.querySelector('#email');
const appInput = document.querySelector('#app-name');
const submitButton = document.querySelector('#submit')
const tokenDiv = document.querySelector('.token')

const submitData = (event) => {
  event.preventDefault();
  fetch('/api/v1/auth', {
    method: 'POST',
    headers: {
      'content-type' : 'application/json'
    },
    body: JSON.stringify({
      email: emailInput.value,
      appName: appInput.value
    })
  })
    .then(response => response.json())
    .then(parsedResponse => {
      tokenDiv.innerHTML = '<h3>Token:</h3> ' + parsedResponse;
    });
};


submitButton.addEventListener('click', (event) => submitData(event));
