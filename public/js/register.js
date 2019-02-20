function loadEvents(){
  var toggle = document.getElementById("togglePass");
  toggle.addEventListener("click", switchType);
}

function switchType(toggle) {
    var passInput = document.getElementById("password");
    if (passInput.type === "password") {
        passInput.type = "text";
    } else {
        passInput.type = "password";
    }
}

function closeForm(){
  var elem = document.getElementById("registration");
  elem.classList.add("scale-out");
}
