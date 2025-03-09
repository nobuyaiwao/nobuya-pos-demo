async function processPayment() {
    const terminalSelect = document.getElementById("terminal");
    const selectedTerminal = terminalSelect.value;
    if (!selectedTerminal) {
        alert("Please select a payment terminal.");
        return;
    }

    const paymentData = {
        amount: 180000,  // Set total price here
        currency: "JPY",
        terminalId: selectedTerminal
    };

    try {
        const response = await fetch("/api/payments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(paymentData) // Ensure the body is sent as JSON
        });

        const result = await response.json();
        console.log("Payment Response:", result);

        if (response.ok) {
            alert("Payment processed successfully!");
        } else {
            alert("Payment failed: " + result.error);
        }
    } catch (error) {
        console.error("Error processing payment:", error);
        alert("Error processing payment.");
    }
}

document.getElementById("pay-button").addEventListener("click", processPayment);

