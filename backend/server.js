// Import necessary packages
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'hbul_db', 
    port:8889
});

// Connect to MySQL
db.connect();

// Define your secret key for JWT
const secretKey = 'testKey';

// API endpoint to generate a JWT token upon successful login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Validate the user's credentials (you should have a users table in your database)
    db.query('SELECT id FROM user_login WHERE username = ? AND password = ?', [username, password], (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        if (result.length > 0) {
            console.log(result[0].id)
            // User exists, generate a JWT token
            const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

            // Now, fetch user details
            db.query('SELECT * FROM user_info WHERE user_id = ?', [result[0].id], (err, userDetails) => {
                if (err) {
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                }

                if (userDetails.length > 0) {
                    res.json({ token, userDetails: userDetails[0] });
                } else {
                    res.status(401).json({ message: 'User details not found' });
                }
            });
        } else {
            res.status(401).json({ message: 'Authentication failed' });
        }
    });
});

app.get('/all', verifyToken, (req, res) => {
    // Now, fetch user details
    db.query('SELECT * FROM content', [], (err, content) => {
        if (err) {
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        if (content.length > 0) {
            res.json({ content });
        } else {
            res.status(401).json({ message: 'User details not found' });
        }
    });

});



// Protect other routes using middleware
function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    console.log({ token })
    if (!token) {
        return res.status(403).json({ message: 'Token not provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid token' + err });
        req.user = decoded;
        next();
    });
}

// Example protected route
app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'This is a protected route' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


// Example test route
app.get('/test', (req, res) => {
    res.json({ message: 'This is a test route' });
});