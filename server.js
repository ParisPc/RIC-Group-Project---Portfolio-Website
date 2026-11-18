// INITIATE CONNECTIONS AND PATHS

const express = require("express");
const mysql = require("mysql2");
const session = require("express-session");

const bcrypt = require("bcrypt");

const path = require("path");

const app = express();
const PORT = 3000;

// FRONTEND FILES

app.use(express.static(path.join(__dirname, "public")));


// CONNECT DATABASE

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    database: "portfolio_website",
    password: "MyActualPassword"

});

db.connect((error) => {
    if (error) {
	console.error("Database connection failed:");
	console.error(error);
	return;
    }

    console.log("Connected to Database");

});

// AQUIRE JSON

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(
    session({
	secret: "secret-key",
	saveUninitialized: false,
	resave: false,
	cookie: {
	    maxAge: 1000 * 60 * 60
	}
    })
);

// REGISTER PAGE

app.post("/register", async (req, res) => {

    const {
	firstName,
	lastName,
	username,
	email,
	password
    } = req.body;

    try {

	const hashedPassword = 
	    await bcrypt.hash(password, 10);

	db.query(
	    "INSERT INTO 'User' (first_name, last_name, username, email, password_hash) VALUES (?, ?, ?, ?, ?)",

	    [
		firstName,
		lastName,
		username,
		email,
		hashedPassword
	    ],
	    (error, result) => {

		if (error) {
		    console.error(error);

		    return res.status(500).json({
			success: false,
			message: "Registration failed"
		    });
		}
		
		res.json({
		    success: true, 
		    message: "Account created successfully"
		});

	    }
	);

    } catch (err) {

	console.error(err);

        res.status(500).json({
            success: false,
            message: "Server error"
        });

    }

});

// LOGIN PAGE 

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    // LOCATE EMAIL FROM USER TABLE
    db.query(
	"SELECT * FROM 'User' WHERE email = ?",
	[email],
	async (err, results) => {
	    if (err) {
		console.error(err);
		return res.status(500).json({
		    success: false,
		    message: "Error"
		});
	    }

	    // CHECK FOR ENTERED EMAIL
	    if (results.length === 0) {
		return res.json({
		    success:false,
		    message: "Incorrect email or password"
		});
	    }

	    const user = results[0];

	    // MATCH PASSWORD WITH HASH

	    try {

		const matchPassword = await bcrypt.compare(
		    password,
		    user.password_hash
		);

		if (!matchPassword) {
		    return res.json({
			success: false,
			message: "Email or password incorrect"
		    });
		}

		// CREATE SESSION 
		req.session.username = user.username;
		req.session.userId = user.user_id;

		res.json({
		    success: true,
		    message: "Welcome back!"
		});

	    } catch (error) {
		console.error(error);
		res.status(500).json({
		    success: false,
		    message: "Error"
		});
	    }
	}
    );
});

// LOGOUT SECTION 

app.post("/logout", (req, res) => {

    req.session.destroy((err) => {

        if (err) {

            return res.status(500).json({
                success: false
            });

        }

        res.json({
            success: true,
            message: "Logged out"
        });

    });

});

// STARTING THE SERVER

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});
