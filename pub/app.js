UB.connect({ host: window.location.origin }).then(
  conn => {
    fillRecipeSelector()
  }
)


const fillRecipeSelector = () => {
  UB.Repository('calc_recipe').attrs(['ID', 'name'])
    .selectAsObject().then(function (recipes) {
    document.querySelector('#recipe').setAttribute('href', `/recipe.html#${recipes[0].ID}`)
    const selector = document.querySelector('#recipeSelector')
    selector.innerHTML = recipes.map(({ ID, name }) => `<option value="${ID}">${name}</option>`)
      .join('')
    selector.addEventListener('change', e => {
      console.log(e)
      document.querySelector('#recipe').setAttribute('href', `/recipe.html#${e.target.value}`)
    })
  })
}