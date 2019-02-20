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
