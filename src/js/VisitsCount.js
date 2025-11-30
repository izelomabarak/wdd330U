if (!localStorage.getItem("alreadyVisit")) {
    let div = document.querySelector('#login');
    let p = document.createElement('p')
    p.textContent = 'Hello, this is your firts time here, if you want to acces to more unic fetures create a account, for create a account are two ways, the firts way is cliking the Join Us link and follow the instructions and the secon one is calling to the number +52 1111 111 111 number and fulfinig the questionary.'
    div.appendChild(p);
    localStorage.setItem("alreadyVisit", "true");
}