//test barcode = 011110038364
//another = 041196910759

document.querySelector('button').addEventListener('click', getFetch)
let inputError = document.querySelector('.inputError')
let inputBarcode = document.querySelector('#barcode')
let tableRef = document.querySelector('#ingredients')
let tableRows = document.querySelectorAll('.tableRows')


//// Helper Functions //////
function clearHTML(item) {
  item.innerHTML = '';
}

function removeKids(item) {
  while (item.firstChild) {
    item.removeChild()
  }  
}

///// Fetch Function //////
function getFetch(){
  const inputVal = document.querySelector('input').value

  if (inputVal.length != 12) {
      inputError.innerHTML = 'Please enter 12-digit number'
      return
  }

  const url = `https://world.openfoodfacts.org/api/v0/product/${inputVal}.json`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data)

        //If product found, build new product object
        if (data.status === 1) {
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

////// Product Class ////////
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
      while (tableRef.rows.length > 1) {
        let i = 1;
        tableRef.deleteRow(i);
      }
      if (!(this.ingredients == null)) {
        for (let key in this.ingredients) {
          let newRow = tableRef.insertRow(-1)
          let newIngCell = newRow.insertCell(0)
          let newVegCell = newRow.insertCell(1)
          let newIText = document.createTextNode(
              this.ingredients[key].text
          )
          let vegStatus = this.ingredients[key].vegetarian ? this.ingredients[key].vegetarian : 'unknown'
          let newVText = document.createTextNode(vegStatus)
          newIngCell.appendChild(newIText)
          newVegCell.appendChild(newVText)
          if (vegStatus === 'no') {
            //turn box red
              newVegCell.classList.add('non-veg')
          } else if (vegStatus == 'unknown' || vegStatus == 'maybe') {
            //turn box yellow
              newVegCell.classList.add('maybe')
          }
      }
    }
  }
}