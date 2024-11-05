const apiUrl = "http://localhost:3000/interpret";

async function fetchPrompt(text) {
    const req = new Request(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({phrase: text}),
    })
    const res = await window.fetch(req);
    return res.json();
}

module.exports = {
    fetchPrompt
}