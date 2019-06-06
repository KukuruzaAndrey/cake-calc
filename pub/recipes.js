UB.connect({ host: window.location.origin }).then(
  conn => {
    getRecipes()
    fillProductSelector()
    fillTypeSelector()
  }
)

const fillProductSelector = () => {
  UB.Repository('calc_product')
    .attrs(['ID', 'name', 'picture'])
    .selectAsObject().then(response => {
    const selector = document.querySelector('.addRecipe .productSelector')
    selector.innerHTML = response.map(({ ID, name }) => `<option value="${ID}">${name}</option>`)
      .join('')
  })
}

const fillTypeSelector = () => {
  UB.Repository('ubm_enum')
    .attrs(['ID', 'eGroup', 'code', 'name'])
    .where('eGroup', '=', 'CAKE_FORM_TYPE')
    .selectAsObject().then(response => {
    const selector = document.querySelector('#typeSelector')
    selector.innerHTML = response.map(({ code, name }) => `<option value="${code}">${name}</option>`)
      .join('')
  })
}


document.getElementById('fileinput').addEventListener('change', function () {
  const [file] = this.files
  UB.connection.addNew({ entity: 'calc_recipe', fieldList: ['ID'] })
    .then(res => {
      const [[ID]] = res.resultData.data
      console.log(ID)
      UB.connection.setDocument(file, {
        entity: 'calc_recipe',
        ID,
        attribute: 'picture',
        origName: file.name
      }).then(picture => {
          document.querySelector('#addRecipe').addEventListener('click', (e) => {
            const recipeName = document.querySelector('#recipeName').value
            const recipeSize = document.querySelector('#sizeSelector').value
            const recipeType = document.querySelector('#typeSelector').value
            const recipeDescription = document.querySelector('#recipeDescription').value

            const recipeRecords = document.querySelectorAll('.recipeRecord')
            addRecipe(ID, recipeName, picture, recipeType, recipeSize, recipeDescription)
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
        }
      )
    })
}, false)

document.querySelector('#addRecipeRecord').addEventListener('click', (e) => {
  const recipeRecord = document.querySelector('.addRecipe .form-row:nth-child(4)')
  const clone = recipeRecord.cloneNode(true)
  clone.querySelector('.removeRecipeRecord').addEventListener('click', removeRecipeRecord)
  recipeRecord.parentNode.insertBefore(clone, document.querySelector('.addRecipe .form-row.col-md-6'))
})

removeRecipeRecord = (e) => {
  if (document.querySelector('.addRecipe').querySelectorAll('.removeRecipeRecord').length > 1) e.target.parentNode.remove()
}
document.querySelector('.removeRecipeRecord').addEventListener('click', removeRecipeRecord)


addRecipe = (ID, name, picture, formType, size, description) =>
  UB.connection.insert({
    entity: 'calc_recipe',
    fieldList: ['ID'],
    execParams: { ID, name, picture, formType, size, description }
  })

addRecipeRecord = (recipe, product, weight) =>
  UB.connection.insert({
    entity: 'calc_recipe_record',
    fieldList: ['ID', 'recipe', 'product', 'weight'],
    execParams: { recipe, product, weight }
  })


const recipeCard = (ID, name, recipeRecords) =>
  `<div class="recipe text-center">
    <a class="btn btn-outline-primary my-2"  aria-expanded="false" href="#h${ID}" role="button" data-toggle="collapse">${name}</a>
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
    <a class="btn btn-light"  href="/recipe.html#${ID}">Переглянути повністю</a>        
    </div>
</div>`


getRecipes = () => {
  UB.Repository('calc_recipe').attrs(['ID', 'name'])
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
    })
  })
}
renderRecipeCard = (ID, name, recipeRecords) => {
  const card = document.createElement('div')
  card.innerHTML = recipeCard(ID, name, recipeRecords)
  document.querySelector('.recipes').appendChild(card)
}