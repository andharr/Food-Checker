//test barcode = 011110038364

document.querySelector('button').addEventListener('click', getFetch)
let inputError = document.querySelector('.inputError')
let inputBarcode = document.querySelector('#barcode')
let tableRef = document.querySelector('#ingredients')


function clearHTML(item) {
  item.innerHTML = '';
}

function getFetch(){
  const inputVal = document.querySelector('input').value

  if (inputVal.length != 12) {
      inputError.innerHTML = 'Please enter 12-digit number'
      return
  }

  clearHTML(inputError)

  const url = `https://world.openfoodfacts.org/api/v0/product/${inputVal}.json`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)

        //If product found, build new product object
        if (data.status === 1) {
            clearHTML(tableRef)
            const item = new ProductInfo(data.product)
            item.showInfo()
            item.listIngredients()

        } else if (data.status === 0) {
          alert(`Product ${inputVal} not found.`)
        }

      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

class ProductInfo {
  constructor(productData) { //passing in data.product
    this.name = productData.product_name
    this.ingredients = productData.ingredients
    this.image = productData.image_url
  }

  showInfo() {
    document.querySelector('#productImg').src = this.image
    document.querySelector('#productName').innerText = this.name
  }


  ///////  Expanding and populating a table from an array ////////

  listIngredients() {
      for (let key in this.ingredients) {
        let newRow = tableRef.insertRow(-1)
        let newIngCell = newRow.insertCell(0)
        let newVegCell = newRow.insertCell(1)
        let newIText = document.createTextNode(
            this.ingredients[key].text
        )
        let vegStatus = this.ingredients[key].vegetarian
        let newVText = document.createTextNode(vegStatus)
        newIngCell.appendChild(newIText)
        newVegCell.appendChild(newVText)

      }

  }

}