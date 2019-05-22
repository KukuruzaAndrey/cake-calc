const productCard = (name, imgPath) =>
  `<div class="card" style="width: 18rem;">
  <img src="/img/${imgPath}" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${name}</h5>
  </div>
</div>`

document.getElementById('fileinput').addEventListener('change', function () {
  const [file] = this.files;
  const reader = new FileReader();

  // Closure to capture the file information.
  // reader.onload = e => {
  //   // console.log(e.target.result)
  //   UB.connection.setDocument(e.target.result, { entity: 'calc_product', attribute: 'picture', origName: file.name })
  //     .then(() =>
  //       UB.connection.insert({
  //         entity: 'calc_product',
  //         fieldList: ['ID', 'name'],
  //         execParams: { name: 'newName' }
  //       })
  //     ).then(UB.logDebug)
  // }
  // reader.readAsDataURL(file);

  UB.connection.setDocument(file, { entity: 'calc_product', attribute: 'picture', origName: file.name })
    .then((res) =>{
      console.log(res)
      UB.connection.insert({
        entity: 'calc_product',
        fieldList: ['ID', 'name'],
        execParams: { name: 'newName', picture: res }
      })}
    ).then(UB.logDebug)


  //
  //   (function (theFile) {
  //   return function (e) {
  //     // Render thumbnail.
  //     var span = document.createElement('span');
  //     span.innerHTML = ['<img class="thumb" src="', e.target.result,
  //       '" title="', escape(theFile.name), '"/>'].join('');
  //     document.getElementById('list').insertBefore(span, null);
  //   };
  // })(f);

  // Read in the image file as a data URL.


  // console.log(file)
  // This code is only for demo ...
  console.log('name : ' + file.name);
  console.log('size : ' + file.size);
  console.log('type : ' + file.type);
  console.log('date : ' + file.lastModified);
}, false);


UB.connect({ host: window.location.origin }).then(
  conn => {
    getProducts()
  }
)

getProducts = () => {
  const products = UB.Repository('calc_product').attrs(['ID', 'name', 'picture'])
    .selectAsObject().then(function (response) {
      // here response is in [{ID: 10, code: 'value1'}, .... {}] format
      console.log(response)
      response.forEach(prod => createCardProduct(prod.name, JSON.parse(prod.picture).fName))
    })
}
createCardProduct = (name, imgPath) => {
  const card = document.createElement('div')
  card.innerHTML = productCard(name, imgPath)
  document.body.appendChild(card);
}


// function hexToBase64(str) {
//   return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
// }
//
// UB.connection.getDocument({
//   entity:'calc_product',
//   attribute: 'picture',
//   ID: 332536452120577
// }).then(response => {
//   var img = document.createElement('img');
//   img.src = 'data:image/jpeg;base64,' + hexToBase64(response);
//   document.body.appendChild(img);
// })