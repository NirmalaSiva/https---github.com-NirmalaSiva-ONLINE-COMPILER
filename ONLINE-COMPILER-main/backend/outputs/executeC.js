const { exec } = require("child_process");
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeC = (filepath) => {
    console.log("Compiling and executing C code...");
    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputPath, `${jobId}.out`);

    return new Promise((resolve, reject) => {
        exec(
            `gcc ${filepath} -o ${outPath} && ${outPath}`,
            (error, stdout, stderr) => {
                if (error) {
                    reject({ error, stderr });
                } else if (stderr) {
                    reject(stderr);
                } else {
                    resolve(stdout);
                }
            }
        );
    });
};

module.exports = {
    executeC,
};
