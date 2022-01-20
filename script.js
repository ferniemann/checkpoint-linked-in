let users = [];

function getUserData() {
    fetch("https://dummy-apis.netlify.app/api/contact-suggestions?count=1")
        .then((res) => res.json())
        .then((data) => {
            if (users.length < 8) {
                data[0].id = createId(data[0].name.first + data[0].name.last);
                users.push(data);
                renderUserData();
            } else {
                connect();
                deleteUserCard();
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

    const btnDelete = document.createElement("button");
    btnDelete.classList.add("card__delete");
    btnDelete.setAttribute("data-id", user.id);
    btnDelete.innerText = "X";

    card.append(coverImg, profileImg, name, title, mutuals, btnConnect, btnDelete);

    cards.append(card);
}

function createId(string) {
    return string.trim().replace(" ", "").toLowerCase();
}

function connect() {
    const connectButtons = document.querySelectorAll(".card__connect");
    const pendingArea = document.querySelector("#pending");
    let pendingCount = 0;

    connectButtons.forEach((button) => {
        button.addEventListener("click", function () {
            if (button.getAttribute("data-btn") === "connect") {
                pendingCount++;
                renderPendingCount(pendingCount, pendingArea);
                button.setAttribute("data-btn", pending);
                button.innerText = "Pending";
            } else {
                pendingCount--;
                renderPendingCount(pendingCount, pendingArea);
                button.setAttribute("data-btn", "connect");
                button.innerText = "Connect";
            }
        });
    });
}

function renderPendingCount(count, area) {
    if (!count) {
        area.innerText = "No pending invitations";
    } else if (count > 1) {
        area.innerText = `${count} pending invitations`;
    } else {
        area.innerText = `${count} pending invitation`;
    }
}

function deleteUserCard() {
    const deleteButtons = document.querySelectorAll(".card__delete");

    deleteButtons.forEach((button) => {
        button.addEventListener("click", function (e) {
            const allCards = document.querySelector("#cards");
            const parent = e.target.parentElement;
            allCards.removeChild(parent);
            users = users.filter((user) => user[0].id !== button.getAttribute("data-id"));
            getUserData();
        });
    });
}

getUserData();
