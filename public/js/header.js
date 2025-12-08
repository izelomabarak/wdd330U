let header = document.querySelector('#tools');
if (localStorage.getItem("accountName") !== null) {
    const name = localStorage.getItem("accountName");
    let root = '<a title="Click to view account" href="/account/">Welcome ' + name + '</a>';
    root += '<a title="Click to log in" href="/account/logout">Logout</a>';
    header.innerHTML = root;
} else {
    let root = '<a title="Click to log in" href="/account/login">Log In</a>';
    header.innerHTML = root;
}