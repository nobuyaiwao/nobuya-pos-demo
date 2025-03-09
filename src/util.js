// src/util.js

/**
 * Fetch environment data and display Merchant Account and Store Reference
 */
async function fetchEnvData() {
    try {
        const response = await fetch("/api/getenv");
        const data = await response.json();
        document.getElementById("adyenEnv").textContent = data.environment;
        document.getElementById("merchantAccount").textContent = data.merchantAccount;
        document.getElementById("storeReference").textContent = data.storeReference;
    } catch (error) {
        console.error("Error fetching environment data:", error);
    }
}

/**
 * Fetch available terminals and populate the dropdown menu
 */
async function fetchTerminals() {
    try {
        const response = await fetch("/api/terminals");
        const terminals = await response.json();
        
        const terminalSelect = document.getElementById("terminal");
        terminalSelect.innerHTML = ""; // Clear existing options

        if (terminals.length === 0) {
            terminalSelect.innerHTML = "<option>No terminals available</option>";
            return;
        }

        terminals.forEach(terminal => {
            const option = document.createElement("option");
            //option.value = terminal.serialNumber;
            option.value = terminal.id;
            option.textContent = `${terminal.model} (${terminal.serialNumber})`;
            terminalSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching terminals:", error);
        document.getElementById("terminal").innerHTML = "<option>Error loading terminals</option>";
    }
}

// Execute functions when the page loads
fetchEnvData();
fetchTerminals();

