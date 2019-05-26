UB.connect({ host: window.location.origin }).then(
  conn => {
    getProducts()
  }
)

const productCard = (name, imgPath) =>
  `<div class="card product m-2" style="width: 18rem;">
  <img src="/img/${imgPath}" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${name}</h5>
  </div>
</div>`

document.getElementById('fileinput').addEventListener('change', function () {
  const [file] = this.files
  UB.connection.addNew({ entity: 'calc_product', fieldList: ['ID'] })
    .then(res => {
      const [[ID]] = res.resultData.data
      UB.connection.setDocument(file, {
        entity: 'calc_product',
        ID,
        attribute: 'picture',
        origName: file.name
      }).then(picture => {
          const name = document.querySelector('#productName').value
          document.querySelector('#addProduct').addEventListener('click', () => {
            addProduct(ID, name, picture)
          })
        }
      )
    })
}, false)
addProduct = (ID, name, picture) => {
  UB.connection.insert({
    entity: 'calc_product',
    fieldList: ['ID', 'name', 'picture'],
    execParams: { ID, name, picture }
  }).then(() => {
    $('#toast').css('top', window.pageYOffset + 10);
    $('.toast').toast('show')
  })
}

getProducts = () => {
  const products = UB.Repository('calc_product').attrs(['ID', 'name', 'picture'])
    .selectAsObject().then(function (response) {
      response.forEach(prod => renderCardProduct(prod.name, JSON.parse(prod.picture).fName))
    })
}
renderCardProduct = (name, imgPath) => {
  const card = document.createElement('div')
  card.innerHTML = productCard(name, imgPath)
  document.querySelector('.products').appendChild(card)
}