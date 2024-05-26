const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 4000;

// Ensure the data.json file exists
const dataFilePath = path.join(__dirname, 'data.json');
if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, '[]', 'utf8');
}

app.use(express.json());

app.post('/submit', (req, res) => {
    const { score, email, name, number } = req.body;

    if (!score || !email || !name || !number) {
        return res.status(400).json({ error: 'All fields (score, email, name, number) are required' });
    }

    const newEntry = { score, email, name, number };

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            return res.status(500).json({ error: 'Failed to read data' });
        }

        let jsonData = [];
        try {
            jsonData = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing JSON data:', parseErr);
            return res.status(500).json({ error: 'Failed to parse data' });
        }

        jsonData.push(newEntry);

        fs.writeFile(dataFilePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error('Error writing data file:', err);
                return res.status(500).json({ error: 'Failed to write data' });
            }

            res.status(201).json({ message: 'Data saved successfully' });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
