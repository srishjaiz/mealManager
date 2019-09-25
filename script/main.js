
var el=document.getElementById("mySidenav");
var closebtn=document.getElementById("closebtn");
var dropdown = document.getElementsByClassName("dropdown-btn");
var c = document.getElementsByClassName("hidden"); 
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