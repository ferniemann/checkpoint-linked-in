let users = [];
let pendingCount = 0;

function getUserData() {
    fetch("https://dummy-apis.netlify.app/api/contact-suggestions?count=1")
        .then((res) => res.json())
        .then((data) => {
            if (users.length < 8) {
                data[0].id = createId(data[0].name.first + data[0].name.last);
                users.push(data);
                renderUserData();
                deleteUserCard();
            } else {
                return;
            }
        });
}

function renderUserData() {
    for (let i = users.length - 1; i < users.length; i++) {
        createUserCard(users[i]);
        getUserData();
    }
}

function createUserCard(user) {
    const cards = document.querySelector("#cards");
    user = user[0];

    const card = document.createElement("div");
    card.classList.add("card");
    card.id = user.id;

    const coverImg = document.createElement("img");
    coverImg.classList.add("card__cover");
    if (user.backgroundImage) {
        coverImg.src = user.backgroundImage;
    } else {
        coverImg.src = "https://picsum.photos/300/300";
    }

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
    btnConnect.setAttribute("data-btn", "connect");
    btnConnect.innerText = "Connect";
    btnConnect.addEventListener("click", connect);

    const btnDelete = document.createElement("button");
    btnDelete.classList.add("card__delete");
    btnDelete.setAttribute("data-id", user.id);
    btnDelete.innerText = "X";
    btnDelete.addEventListener("click", deleteUserCard);

    card.append(coverImg, profileImg, name, title, mutuals, btnConnect, btnDelete);

    cards.append(card);
}

function createId(string) {
    return string.trim().replace(" ", "").toLowerCase();
}

function connect(e) {
    const button = e.target;

    if (button.getAttribute("data-btn") === "connect") {
        pendingCount++;
        button.innerText = "Pending";
        button.setAttribute("data-btn", "pending");
        renderPendingCount();
    } else if (button.getAttribute("data-btn") === "pending") {
        pendingCount--;
        button.innerText = "Connect";
        button.setAttribute("data-btn", "connect");
        renderPendingCount();
    }
}

function renderPendingCount() {
    const pendingCountElement = document.querySelector("#pending");

    if (pendingCount === 0) {
        pendingCountElement.innerText = "No pending invitations";
    } else if (pendingCount === 1) {
        pendingCountElement.innerText = "1 pending invitation";
    } else if (pendingCount > 1) {
        pendingCountElement.innerText = `${pendingCount} pending invitations`;
    }
}

function deleteUserCard(e) {
    const allCards = document.querySelector("#cards");

    if (e) {
        console.log("Test");
        const button = e.target;
        const parent = e.target.parentElement;
        allCards.removeChild(parent);
        users = users.filter((user) => user[0].id !== button.getAttribute("data-id"));
        getUserData();
    }
}

getUserData();
