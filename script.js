let users = [];
let pendingCounter = localStorage.getItem("counter") || 0;

function getUserData() {
    const count = 8 - users.length;
    const start = users.length;

    fetch(`https://dummy-apis.netlify.app/api/contact-suggestions?count=${count}`)
        .then((res) => res.json())
        .then((userData) => {
            userData.forEach((user) => {
                user.id = createId(user.name.first + user.name.last);
                users.push(user);
            });
            renderUserData(start);
        });
}

function renderUserData(start) {
    console.log("runs");
    const cards = document.querySelector("#cards");

    for (let i = start; i < 8; i++) {
        createUserCard(users[i], cards);
    }
}

function createUserCard(user, destination) {
    const container = document.createElement("div");
    container.classList.add("card");

    const coverImg = document.createElement("img");
    coverImg.classList.add("card__cover");
    coverImg.src = user.backgroundImage || "https://picsum.photos/300/300";

    const profileImg = document.createElement("img");
    profileImg.classList.add("card__profile-photo");
    profileImg.src = user.picture;

    const name = document.createElement("p");
    name.classList.add("card__name");
    name.innerText = `${user.name.first} ${user.name.last}`;

    const title = document.createElement("p");
    title.classList.add("card__job");
    title.innerText = user.title;

    const mutuals = document.createElement("small");
    mutuals.classList.add("card__mutuals");
    mutuals.innerText = `${user.mutualConnections} mutual connections`;

    const btnConnect = document.createElement("button");
    btnConnect.classList.add("card__connect");
    btnConnect.innerText = "Connect";
    btnConnect.addEventListener("click", pendingCount);

    const btnDelete = document.createElement("button");
    btnDelete.classList.add("card__delete");
    btnDelete.id = user.id;
    btnDelete.innerText = "X";
    btnDelete.addEventListener("click", deleteUser);

    container.append(coverImg, profileImg, name, title, mutuals, btnConnect, btnDelete);
    destination.append(container);
}

function pendingCount(e) {
    const button = e.target;

    if (button.innerText === "Connect") {
        pendingCounter++;
        localStorage.setItem("counter", pendingCounter);
        renderPendingCount();
        button.innerText = "Pending";
    } else {
        pendingCounter--;
        localStorage.setItem("counter", pendingCounter);
        renderPendingCount();
        button.innerText = "Connect";
    }
}

function renderPendingCount() {
    const pendingText = document.querySelector("#pending");

    if (pendingCounter === 0) {
        pendingText.innerText = "No pending invitations";
    } else if (pendingCounter === 1) {
        pendingText.innerText = "1 pending invitation";
    } else if (pendingCounter > 1) {
        pendingText.innerText = `${pendingCounter} pending invitations`;
    }
}

function deleteUser(e) {
    const button = e.target;
    const parent = button.parentElement;
    parent.remove();

    users = users.filter((user) => user.id !== button.id);
    getUserData();
}

function createId(string) {
    return string.trim().replaceAll(" ", "").toLowerCase();
}

getUserData();
renderPendingCount();
