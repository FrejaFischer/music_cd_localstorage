"use strict"

const form = document.querySelector("#form");
const table = document.querySelector("#table");

let musicArr = []; // Array for storing the cd's
handleLocalstorage(); // handle localstorage with the first load

// eventlistener submitting the form
form.addEventListener("submit", (e)=>{
    e.preventDefault();

    const generateRandomId = Math.random(); // Generating a random id
    const authorInput = e.target.author.value;
    const titleInput = e.target.title.value;
    const yearInput = e.target.year.value;

    // pushing the values from the form into an object and thereafter into the array
    musicArr.push({
        author : authorInput,
        title : titleInput,
        year : yearInput,
        id : generateRandomId
    });

    //form.reset(); // Resetting the form. Here I'm interacting with the page, which we should avoid doing a lot
    e.target.reset(); // Here I'm using the event instead

    createTable(); // create the table with all items from musicArr

    const string = JSON.stringify(musicArr); // Making the array to a string to prepare for sending to localstorage
    localStorage.setItem("cd_storage",string); // setting cd_storage to keep the cd-array (made to a string) in localstorage
});

function handleLocalstorage(){
    // check if there already is something in the localstorage, and if yes, getting the storage and creating the table
    if (localStorage.getItem("cd_storage")){
        const cd_storage = localStorage.getItem("cd_storage");
        musicArr = JSON.parse(cd_storage);
        createTable();
    }
}

function createTable() {
    const does_tbody_exist = document.querySelector("tbody"); // Checking if there already exists a tbody
    // this is done because we need to create a new table and loop through the array everytime the array changes 
    // - therefore we need to delete the existing tbody (if exists)
    if (does_tbody_exist){
        does_tbody_exist.remove();
    }

    const tbody = document.createElement("tbody"); // Creating the tbody element

    musicArr.forEach(cd => {
        const newRow = document.createElement("tr");
        const authorData = document.createElement("td");
        const titleData = document.createElement("td");
        const yearData = document.createElement("td");
        const deleteData = document.createElement("td");

        // taking the data from each cd object and giving it as value to the new elements
        authorData.innerText = cd.author;
        titleData.innerText = cd.title;
        yearData.innerText = cd.year;

        const deleteBtn = document.createElement("button");
        deleteBtn.setAttribute("class", "delete_btn");
        deleteBtn.setAttribute("id", `${cd.id}`); // set an id with the cd id, so we can delete the right cd later
        deleteBtn.innerHTML = '<img src="icon/trash.svg" alt="delete button" class="delete_icon">';
        deleteBtn.addEventListener("click", () => deleteCd(deleteBtn)); // eventListener for clicking the delete btn
        deleteData.append(deleteBtn);

        newRow.append(authorData, titleData, yearData, deleteData);
        tbody.append(newRow);
    });
    table.append(tbody); // appending the tbody to the table
};

function deleteCd(deleteBtn) {
    const findCd = (cd) => cd.id == deleteBtn.getAttribute("id"); // function for finding the right cd with the right id
    const findIndex = musicArr.findIndex(findCd); // finding the index of the right cd
    musicArr.splice(findIndex, 1); // removing the right cd
    createTable(); // create the table again

    // Updating localstorage to contain the newest music array
    const string = JSON.stringify(musicArr);
    localStorage.setItem("cd_storage",string);
};