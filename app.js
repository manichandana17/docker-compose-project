require('dotenv').config(); // 1. Add this at the very top
const express = require('express');
const app = express();

// 2. Change this to use the environment variable
const PORT = process.env.PORT || 3000; 

app.get('/', (req, res) => {
    res.send('<h1>Hello from Kravix Internal App!</h1><p>Pipeline Build Successful.</p>');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
