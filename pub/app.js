UB.connect({ host: window.location.origin }).then(
  conn => {
    getRecipes()
  }
)

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

const fillRecipeSelector = () => {
  UB.Repository('calc_recipe').attrs(['ID', 'name'])
    .selectAsObject().then(function (recipes) {
    const selector = document.querySelector('.addRecipe .productSelector')
    selector.innerHTML = response.map(({ ID, name }) => `<option value="${ID}">${name}</option>`)
      .join('')
  })
}