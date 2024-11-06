// document.body.addEventListener("htmx:afterRequest", (event) => {
//   const token = event.detail.xhr.getResponseHeader("X-Auth-Token");
//   if (token) {
//     localStorage.setItem("authToken", token);
//   }
// });

// document.body.addEventListener("htmx:configRequest", (event) => {
//   const token = localStorage.getItem("authToken");

//   if (token) {
//     event.detail.headers["Authorization"] = `Bearer ${token}`;
//   }
// });
