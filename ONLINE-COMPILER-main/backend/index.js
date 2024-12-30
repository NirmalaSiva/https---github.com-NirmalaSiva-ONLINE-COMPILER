const express = require('express');
const cors = require('cors');
const path = require('path');

const { generateFile } = require('./generateFile');
const { executeJava } = require('./executeJava');
const { executeCpp } = require('./executeCpp');
const { executePy } = require('./executePy');
const { executeC } = require('./outputs/executeC');
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve React build files
app.use(express.static(path.join(__dirname, 'build')));

// API Endpoint for root (for testing)
app.get('/', (req, res) => {
  return res.json({ hello: "world!" });
});

// API endpoint to run code
app.post("/run", async (req, res) => {
  const language = req.body.language;
  const code = req.body.code;
  console.log(language, code.length);

  if (code === undefined) {
    return res.status(400).json({ success: false, error: "empty code body!" });
  }
  try {
    // Generate a file with the code
    const filepath = await generateFile(language, code);
    let output;

    // Execute the code based on the language
    if (language === "cpp") {
      output = await executeCpp(filepath);
    } else if (language === "py") {
      output = await executePy(filepath);
    } else if (language === "java") {
      output = await executeJava(filepath);
    } else {
      output = await executeC(filepath);
    }

    return res.json({ filepath, output });
  } catch (err) {
    res.status(500).json({ err });
  }
});

// Handle all other requests (e.g., React Router URLs)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Use your device's local IP address here
const deviceIP = '192.168.80.191'; // Replace this with your actual device IP
const port = 5000;

app.listen(port, deviceIP, () => {
  console.log(`Server is running on http://${deviceIP}:${port}`);
});
//made changes