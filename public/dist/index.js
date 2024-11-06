const loginForm = document.querySelector(".login-form");

async function handleLoginSubmit(e) {
  e.preventDefault();

  const formFields = new FormData(e.target);

  const res = await fetch("http://localhost:3000/api/auth/authenticate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: formFields.get("username"),
      password: formFields.get("password"),
    }),
  });

  const responseData = await res.json();
  localStorage.setItem("user-token", responseData.token);

  const newElement = document.createElement("div");
  newElement.setAttribute("hx-get", "/some-endpoint");
  newElement.setAttribute("hx-trigger", "load");

  document.getElementById("container").appendChild(newElement);
  htmx.process(newElement);
}

loginForm.addEventListener("submit", handleLoginSubmit);
