const { exec } = require("child_process");
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeJava = (filepath) => {
    console.log("Compiling and executing Java file...");
    const jobId = path.basename(filepath, '.java');
    const classFilePath = path.join(outputPath, `${jobId}.class`);

    return new Promise((resolve, reject) => {
        exec(`javac ${filepath} -d ${outputPath} && java -cp ${outputPath} ${jobId}`, (error, stdout, stderr) => {
            if (error) {
                reject({ error, stderr });
            } else {
                resolve(stdout);
            }
        });
    });
};

module.exports = {
    executeJava,
};
