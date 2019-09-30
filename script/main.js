
var el=document.getElementById("mySidenav");
var closebtn=document.getElementById("closebtn");
var dropdown = document.getElementsByClassName("dropdown-btn");
var c = document.getElementsByClassName("hidden"); 
var visible = document.getElementsByClassName('visible')[0]; 

// setTimeout(() => {
//     for (i = 0; i < c.length; i++) {
//         c[i].style.display="block";
//     }
// }, 300);
el.style.left="-280px";
closebtn.style.marginLeft="0";
// var c = el.childNodes;
// console.log(c);            
function openNav() {
    
    if (!(el.style.left === "0" || el.style.left === "0px")) {
        // el.childNodes.style.display="none";                    
        // for (i = 0; i < c.length; i++) {
        //     c[i].style.display="none";
        // }
        el.style.left = "0";
        closebtn.style.marginLeft="280px";

    }
    else{
        el.style.left = "-280px";
        closebtn.style.marginLeft="0";
        // setTimeout(() => {
        //     for (i = 0; i < c.length; i++) {
        //         c[i].style.display="block";
        //     }
        // }, 300);
        
        // el.childNodes.style.display="block";
    }
}

    // function closeNav() {
    //     document.getElementById("mySidenav").style.width = "0";
    // }

// function for dropdown
var i;

for (i = 0; i < dropdown.length; i++) {
    dropdown[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var dropdownContent = this.nextElementSibling;
        if (dropdownContent.style.display === "block") {
            dropdownContent.style.display = "none";
        } 
        else {
            dropdownContent.style.display = "block";
        }
    });
}

// Ajax function to send and receive data from server
function sendRequest(method, url, cb, data) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            cb(JSON.parse(xhr.responseText));
        }
    };
    xhr.onerror = function(){
        //handle network error here
    }
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data ? JSON.stringify(data) : undefined);
}    
(function(){
    sendRequest('GET', '/profile/userprofile', (res) => {
        // console.log("in ajax call", res.userpic);
        document.getElementById('user-name').innerHTML = res.username;
        document.getElementById("user-image").src= res.userpic;
    })
})();