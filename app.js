// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");
// edit option
let editElement;
let editFlag = false;
let editID = "";
// ****** EVENT LISTENERS **********

// subit form
form.addEventListener("submit", addItem);

// cleae items
clearBtn.addEventListener("click", clearItems);

// load items
window.addEventListener("DOMContentLoaded", setUpItems);

// ******----------- FUNCTIONS ---------------**********

function addItem(e) {
  e.preventDefault();
  //access input value
  const value = grocery.value;
  const id = new Date().getTime().toString();

  // condtn
  // value not empt and not editing
  if (value && !editFlag) {
    createListItems(id, value);
    //DISPLAY alert
    displayAlert("item added to list", "success");
    //SHOW container
    container.classList.add("show-container");
    // add to LOCAL STORAGE
    addToLocalStorage(id, value);
    // set back to default
    setBackToDefault();
  }
  // value not empt and  editing
  else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("value changed", "success");
    // edit local storage
    editLocalStorage(editID, value);
    setBackToDefault();
  }
  // value  empt and  non-editing
  else {
    displayAlert("please enter a value", "danger");
  }
}
// display alert function text = display text and action = color

function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  // set timeout for remove alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// cleart the whole items
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");

  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }

  // remove show -contaienr btn
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackToDefault();

  localStorage.removeItem("list");
}

// delete item
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  //   console.log(e);
  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");
  setBackToDefault();
  // remove from local storage
  removeFromLocalStorage(id);
}

// edit item
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  //set form value
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "edit";
}

// set back to default
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}
// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
  const grocery = { id: id, value: value };

  let items = getLocalStorage();

  console.log(items);

  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));

  //   console.log("add to local storage");
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

// function to get items  form localstorage
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

// localStorage
//setItem
// getItem
// removeItem
// save as string using JSON.stringify()
// get from ls as JSON.pasrse()

// ****** SETUP ITEMS **********

function setUpItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItems(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}

function createListItems(id, value) {
  // create article element
  const element = document.createElement("article");
  // add class to article
  element.classList.add("grocery-item");
  // add-id to article
  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `<p class="title">${value}</p>
                        <div class="btn-container">
                       <button type="button" class="edit-btn">
                            <i class="fas fa-edit"></i>
                       </button>
                      <button type="button" class="delete-btn">
                           <i class="fas fa-trash"></i>
                        </button>
                    </div>`;

  const deleteBtn = element.querySelector(".delete-btn");
  const editBtn = element.querySelector(".edit-btn");

  // add event listener to delete and edit btn
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);

  // APPEND child

  list.appendChild(element);
}
