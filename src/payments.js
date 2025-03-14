document.getElementById("pay-button").addEventListener("click", async () => {
    const terminalSelect = document.getElementById("terminal");
    const selectedTerminal = terminalSelect.value;
    const paymentStatusDiv = document.getElementById("payment-status");

    if (!selectedTerminal || selectedTerminal === "Checking available terminals...") {
        paymentStatusDiv.innerHTML = `<p class="text-red-500">Error: No terminal selected.</p>`;
        return;
    }

    // Show processing message
    paymentStatusDiv.innerHTML = `<p class="text-blue-500">Processing payment...</p>`;

    try {
        const response = await fetch("/api/payments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: 180000, // Hardcoded for now
                currency: "JPY",
                terminalId: selectedTerminal
            })
        });

        const data = await response.json();
        console.log("Payment response:", data);

        if (data?.SaleToPOIResponse?.PaymentResponse) {
            const paymentResponse = data.SaleToPOIResponse.PaymentResponse;
            const result = paymentResponse.Response?.Result || "Unknown";

            if (result === "Success") {
                paymentStatusDiv.innerHTML = `<p class="text-green-500 font-bold">Payment Successful!</p>`;
            } else {
                paymentStatusDiv.innerHTML = `<p class="text-red-500 font-bold">Payment Failed.</p>`;
            }

            // レシート情報を表示
            if (paymentResponse.PaymentReceipt) {
                displayReceipts(paymentResponse.PaymentReceipt);
            }
        } else if (data?.SaleToPOIRequest?.EventNotification) {
            // POI エラー処理
            const eventNotification = data.SaleToPOIRequest.EventNotification;
            const eventToNotify = eventNotification.EventToNotify || "Unknown";
            const rawMessage = eventNotification.EventDetails || "No details provided";

            // + をスペースに変換し、デコード
            const decodedMessage = decodeURIComponent(rawMessage.replace(/\+/g, " "));

            paymentStatusDiv.innerHTML = `
                <p class="text-red-500 font-bold">Result: ${eventToNotify}</p>
                <p class="text-red-500">Message: ${decodedMessage}</p>
            `;
        } else {
            paymentStatusDiv.innerHTML = `<p class="text-red-500 font-bold">Error: Invalid response.</p>`;
        }
    } catch (error) {
        console.error("Payment processing error:", error);
        paymentStatusDiv.innerHTML = `<p class="text-red-500 font-bold">Payment Request Failed.</p>`;
    }
});


/**
 * Extracts and displays formatted receipts.
 */
function displayReceipts(receipts) {
    const paymentStatusDiv = document.getElementById("payment-status");
    paymentStatusDiv.innerHTML += `<h3 class="text-xl font-bold mt-4">Receipts</h3>`;

    receipts.forEach(receipt => {
        const receiptType = receipt.DocumentQualifier === "CashierReceipt" ? "Cashier Receipt" : "Customer Receipt";
        let formattedReceipt = `<div class="border-t border-gray-300 mt-2 pt-2">
            <h4 class="text-lg font-semibold">${receiptType}</h4>
            <pre class="bg-gray-100 p-2 text-sm">`;

        receipt.OutputContent.OutputText.forEach(line => {
            const text = decodeURIComponent(line.Text.replace(/name=.*?&value=/, ''));
            formattedReceipt += text + "\n";
        });

        formattedReceipt += `</pre></div>`;
        paymentStatusDiv.innerHTML += formattedReceipt;
    });
}

