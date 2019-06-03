UB.connect({ host: window.location.origin }).then(
  conn => {
    getRecipes()
    fillProductSelector()
  }
)

const fillProductSelector = () => {
  UB.Repository('calc_product').attrs(['ID', 'name', 'picture'])
    .selectAsObject().then(function (response) {
    const selector = document.querySelector('.addRecipe .productSelector')
    selector.innerHTML = response.map(({ ID, name }) => `<option value="${ID}">${name}</option>`)
      .join('')
  })
}

document.querySelector('#addRecipeRecord').addEventListener('click', (e) => {
  const recipeRecord = document.querySelector('.addRecipe .form-row:nth-child(2)')
  const clone = recipeRecord.cloneNode(true)
  clone.querySelector('.removeRecipeRecord').addEventListener('click', removeRecipeRecord)
  recipeRecord.parentNode.insertBefore(clone, document.querySelector('.addRecipe .form-row.col-md-6'))
})

removeRecipeRecord = (e) => {
  if (document.querySelector('.addRecipe').querySelectorAll('.removeRecipeRecord').length > 1) e.target.parentNode.remove()
}
document.querySelector('.removeRecipeRecord').addEventListener('click', removeRecipeRecord)


addRecipe = (name) =>
  UB.connection.insert({
    entity: 'calc_recipe',
    fieldList: ['ID'],
    execParams: { name }
  })

addRecipeRecord = (recipe, product, weight) =>
  UB.connection.insert({
    entity: 'calc_recipe_record',
    fieldList: ['ID', 'recipe', 'product', 'weight'],
    execParams: { recipe, product, weight }
  })

document.querySelector('#addRecipe').addEventListener('click', (e) => {
  const recipeName = document.querySelector('#recipeName').value
  const recipeRecords = (document.querySelectorAll('.recipeRecord'))
  addRecipe(recipeName)
    .then(res => res.resultData.data[0][0])
    .then(recipeID => {
      recipeRecords.forEach(recipeRecord => addRecipeRecord(
        recipeID,
        recipeRecord.querySelector('.productSelector').value,
        recipeRecord.querySelector('.productWeight').value,
      ))
    })
    .then(() => {
      $('#toast').css('top', window.pageYOffset + 10);
      $('.toast').toast('show')
    })
})

const recipeCard = (ID, name, recipeRecords) =>
  `<div class="recipe">
    <a class="btn btn-primary"  aria-expanded="false" href="#h${ID}" role="button" data-toggle="collapse">${name}</a>
    <div id="h${ID}" class="collapse">
        <ul class="list-group">
            ${recipeRecords.map(({ 'product.picture': imgPath, 'product.name': name, weight }) =>
    `<li class="list-group-item d-flex align-items-center">
            <div class="col-2">
                <img class="img-thumbnail" src="/img/${imgPath}" alt="">
            </div>
            <div class="col">
                <input type="text" readonly class="form-control-plaintext productName" value="${name}">
            </div>
            <div class="col">
                <input type="text" readonly class="form-control-plaintext productWeight" value="${weight}">
            </div>
        </li>
       `).join('')}
        </ul>
    </div>
</div>`

// document.getElementById('fileinput').addEventListener('change', function () {
//   const [file] = this.files
//   UB.connection.addNew({ entity: 'calc_product', fieldList: ['ID'] })
//     .then(res => {
//       const [[ID]] = res.resultData.data
//       UB.connection.setDocument(file, {
//         entity: 'calc_product',
//         ID,
//         attribute: 'picture',
//         origName: file.name
//       }).then(res => {
//           const name = document.querySelector('#productName').value
//           document.querySelector('#addProduct').addEventListener('click', () => {
//             UB.connection.insert({
//               entity: 'calc_product',
//               fieldList: ['ID', 'name', 'picture'],
//               execParams: { ID, name, picture: res }
//             }).then(() => {
//               $('#toast').css('top', window.pageYOffset + 10);
//               $('.toast').toast('show')
//             })
//           })
//         }
//       )
//     })
// }, false)


getRecipes = () => {
  const recipes = UB.Repository('calc_recipe').attrs(['ID', 'name'])
    .selectAsObject().then(function (recipes) {
      recipes.forEach(({ ID, name }) => {
        UB.Repository('calc_recipe_record').attrs(['ID', 'recipe', 'product.name', 'product.picture', 'weight'])
          .where('recipe', '=', ID)
          .selectAsObject()
          .then(function (recipeRecords) {
            for (const recipeRecord of recipeRecords) {
              recipeRecord['product.picture'] = JSON.parse(recipeRecord['product.picture']).fName
            }
            renderRecipeCard(ID, name, recipeRecords)
          })
        // renderRecipeCard()
      })
      // renderCardProduct(prod.name, JSON.parse(prod.picture).fName)})
    })
}
renderRecipeCard = (ID, name, recipeRecords) => {
  const card = document.createElement('div')
  card.innerHTML = recipeCard(ID, name, recipeRecords)
  document.querySelector('.recipes').appendChild(card)
}