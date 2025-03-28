document.getElementById("donateMpesa").addEventListener("click", function() {
    alert("Donate via M-Pesa clicked! API integration coming soon...");
});
const consumerKey = " kk3GiK5NvvZCDiSjA4mq8fAuQsDekp1RD7AQADJOeF7ni6zH";  // Replace with your Daraja API Key
const consumerSecret = "juZQi45BIfPvZjeT38jQ4NVMakrDVzxd2wTG5sOghvsOEDKQKKqnbVKXozDqAJAF";  // Replace with your Daraja API Secret

async function getAccessToken() {
    const auth = btoa(`${consumerKey}:${consumerSecret}`);
    const response = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
        method: "GET",
        headers: {
            "Authorization": `Basic ${auth}`
        }
    });
    const data = await response.json();
    console.log("Access Token:", data.access_token);
    return data.access_token;
}

// Test API Connection
document.querySelector(".mpesa").addEventListener("click", async function() {
    const token = await getAccessToken();
    alert(`Access Token: ${token}`);
});
const shortcode = "174379"; // Test Paybill Number
const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2b93df12c848f52651f21c4e7a99c2d1"; // Test Passkey
const callbackURL = "https://arapcheruiyot.github.io/donation/"; // Replace with your callback URL

async function initiateSTKPush(phoneNumber, amount) {
    const accessToken = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[-T:]/g, "").split(".")[0];
    const password = btoa(shortcode + passkey + timestamp);

    const payload = {
        "BusinessShortCode": shortcode,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phoneNumber,
        "PartyB": shortcode,
        "PhoneNumber": phoneNumber,
        "CallBackURL": callbackURL,
        "AccountReference": "Donation",
        "TransactionDesc": "Support the cause"
    };

    const response = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("STK Push Response:", data);
    alert("Check your phone for an M-Pesa prompt.");
}

// Event Listener for Donate Button
document.querySelector(".mpesa").addEventListener("click", function() {
    const phoneNumber = prompt("Enter your M-Pesa number:");
    const amount = prompt("Enter amount to donate:");
    if (phoneNumber && amount) {
        initiateSTKPush(phoneNumber, amount);
    } else {
        alert("Please enter valid details.");
    }
});
