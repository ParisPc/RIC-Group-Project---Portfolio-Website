 <script>
        const form = document.getElementById("register-form");
        const password = document.getElementById("password");
        const confirmation = document.getElementById("confirm-password");
        const message = document.getElementById("register-message");

        function checkPasswords() {
            confirmation.setCustomValidity(
                confirmation.value !== password.value
                    ? "Passwords must match."
                    : ""
            );
        }

        password.addEventListener("input", checkPasswords);
        confirmation.addEventListener("input", checkPasswords);

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            // PROMPT SCRIPT TO AQUIRE DATA 
            const response = await fetch("/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstName: document.getElementById("first-name").value,
                    lastName: document.getElementById("last-name").value,
                    username: document.getElementById("username").value,
                    email: document.getElementById("email").value,
                    password: document.getElementById("password").value
                })
            });

            const data = await response.json();
            message.textContent = data.message;
        });
        
    </script>
