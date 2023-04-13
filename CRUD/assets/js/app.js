cl = console.log;
const submitBtn = document.getElementById('submitBtn')
const updateBtn = document.getElementById('updateBtn')
const postForm = document.getElementById('postForm')
const titleControl = document.getElementById('title')
const contentControl = document.getElementById('content')
const postContainer = document.getElementById('postContainer')
let baseUrl = `https://jsonplaceholder.typicode.com/posts`

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
var userID = uuid();

dataArray = [];
const templating = (arr) => {
    let result = '';
    arr.forEach(ele => {
        result += `
            <div class="col-md-4 mb-4">
                <div class="card" id="${ele.id}">
                    <div class="card-header">
                        <h3>${ele.title}</h3>
                    </div>
                    <div class="card-body">
                        <p>${ele.body}</p>
                    </div>
                    <div class="card-footer text-right">
                        <button class="btn btn-primary" onclick="onPostEdit(this)">Edit</button>
                        <button class="btn btn-danger" onclick="onPostDelete(this)">Delete</button>
                        </div>
                </div>
            </div>

        `
    });

    postContainer.innerHTML = result;

}

const onPostEdit = (ele) => {
    //  cl(ele)  //>> will give u button on which we have bind event
    let getEditId = ele.closest(".card").id;
    localStorage.setItem("updateId", getEditId);
    let editedUrl = `${baseUrl}/${getEditId}`;

    updateBtn.classList.remove("d-none");
    submitBtn.classList.add("d-none");
    makeApicall("GET", editedUrl)
}

function makeApicall(methoName, apiUrl, body) {
    let xhr = new XMLHttpRequest();
    xhr.open(methoName, apiUrl);
    xhr.onload = function () {
        if (xhr.status === 200 || xhr.status == 201) {
            // cl(xhr.response)
            let data = JSON.parse(xhr.response)//json array converted in js array
            if (methoName === 'GET') {
                if (Array.isArray(data)) {
                    dataArray = data.reverse();// here we checkd given data is array or not if yes the template the data
                    templating(data)// we creat ui with the help of tempalating we pushed alll the data in the templating
                } else {
                    cl(data)// if given data is not an arrry so console it
                    titleControl.value = data.title;
                    contentControl.value = data.body;
                }
            }
        }
    }
    xhr.send(body)
}
makeApicall('GET', baseUrl)




const onPostSubmit = (eve) => {
    eve.preventDefault();
    let postObj = {
        title: titleControl.value,
        body: contentControl.value,
        id: Math.floor(Math.random() * 10) + 1,
        userId: uuid(),
    }
    cl(postObj);
    dataArray.unshift(postObj)
    templating(dataArray);
    postForm.reset();
    makeApicall('POST', baseUrl, JSON.stringify(postObj))
}

const onPostUpdate = () => {
    cl("updated")
    let getUpatedId = localStorage.getItem("updateId");
    let updatedUrl = `${baseUrl}/${getUpatedId}`;

    let obj = {
        title: titleControl.value,
        body: contentControl.value,
    }
    makeApicall('PATCH', updatedUrl, JSON.stringify(obj));
    postForm.reset();
    updateBtn.classList.add("d-none");
    submitBtn.classList.remove('d-none');

    let getCard = [...document.getElementById(getUpatedId).children];
    cl(getCard)
    getCard[0].innerHTML = `
                     <h3>${obj.title}</h3>
   `
    getCard[1].innerHTML = `
                    <p>${obj.body}</p>
   `
}

const onPostDelete = (ele) => {
    let deleteId = ele.closest(".card").id;
    deleteUrl = `${baseUrl}/${deleteId}`;//will work for backend>> remove a obj with deletdd ic
    cl(deleteUrl);
    // cl(ele)
    makeApicall("DELETE", deleteUrl)
    getCard=document.getElementById(deleteId);
    cl(getCard);
    getCard.remove()// frondtend changes>>. remove dom obj

}



postForm.addEventListener("submit", onPostSubmit)
updateBtn.addEventListener("click", onPostUpdate)