const form = document.querySelector('form');
const LoadingElement = document.querySelector('.loading')
const mewsElement = document.querySelector('.mews')
const API_URL =  window.location.hostname === 'localhost' ? 'http://localhost:8080/mews' : 'https://meower-api-o20y99rny.now.sh/mews'

LoadingElement.style.display = "";

listAllMews();

form.addEventListener('submit',(event) => {
  event.preventDefault();

  const formData = new FormData(form);
  // formDataObjectにform要素をぶち込むといじれる
  // getメソッドでid検索
  const name = formData.get('name');
  const content = formData.get('content');

  const mew = {
    name,
    content
  }

  form.style.display = "none";
  LoadingElement.style.display = "";

  // 簡易POSTMAN URI,{method,body,header}
  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(mew),
    headers: {
      'content-type': 'application/json'
    }
  }).then((response) => response.json())
    .then((createdMew) => {
      form.style.display = ""
      form.reset
      listAllMews();
    })
})

function listAllMews() {
  mewsElement.innerHTML = ""
  fetch(API_URL)
    .then(response => response.json())//objからjson取り出す
    .then(mews => {
      mews.reverse();
      mews.forEach(mew => {
        const div = document.createElement('div')
        const header = document.createElement('h3')
        const content = document.createElement('p')
        const date = document.createElement('small')

        header.textContent = mew.name;
        content.textContent = mew.content;
        date.textContent = new Date(mew.created);

        div.appendChild(header);
        div.appendChild(content);
        div.appendChild(date)
        mewsElement.appendChild(div)
      })
    })
  LoadingElement.style.display = "none"
}