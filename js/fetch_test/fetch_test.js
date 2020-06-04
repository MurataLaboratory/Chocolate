const url = "https://92b58f8cddfb.ngrok.io/";

console.log("started");
fetch("http://127.0.0.1:5000/")
    .then(response => {
        console.log(response.ok);
    });