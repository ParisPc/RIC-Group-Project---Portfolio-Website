<script>
        // PROMPT FORM REQUEST
        
        document.getElementById("login-form").addEventListener("submit", async (event) => {
            event.preventDefault();

            // POINT OF FORM RECOGNITION

            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: document.getElementById("email").value,
                    password: document.getElementById("password").value
                })
            });

            // PROMT CONNECTION TO JSON

            const data = await response.json();

            if(data.success) {
                window.location.href = "/editor.html"
            }

            document.getElementById("login-message").textContent = data.message;
        });
    </script>
