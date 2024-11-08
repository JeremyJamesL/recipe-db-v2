const loginForm = document.querySelector(".login-form");

// document.body.addEventListener("htmx:configRequest", function (evt) {
//   const token = localStorage.getItem("user-token");

//   if (token) {
//     evt.detail.headers["Authorization"] = token;
//   }
// });

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

  if (!res.ok) {
    console.log("something went wrong");
  }

  window.location = "/home";
}
if (loginForm) loginForm.addEventListener("submit", handleLoginSubmit);
