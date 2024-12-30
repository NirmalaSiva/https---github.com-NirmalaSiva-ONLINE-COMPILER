const fs = require('fs');
const path = require('path');
const {v4 : uuid } = require('uuid');

const dirCodes = path.join(__dirname, "codes");

if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes, {recursive: true});
}

const generateFile = async (format, content)=>{
  const jobId = "A"+uuid().replaceAll('-',"");
  const filename = `${jobId}.${format}`
  if (format == 'java'){

    content = content.replace("class Main",`class ${jobId}`)
  }
  const filepath = path.join(dirCodes, filename);
  await fs.writeFileSync(filepath, content);
  return filepath;
};



module.exports = {
    generateFile,
};