# Quick API

This repository store NodeJS parser for exports from Insomnia or Postman.

## Usage
Depending on your export, you must first convert the data into an object that can be usable by the markdown generation script.

### Postman collection export

1. Create your collection and organize your requests by entities (database tables for example)
2. Right click on a collection > Get public link
3. Open the link in your browser and save it in a json file
4. Start the script `npm run postman-parser FILEPATH > data-parsed.json` after edit the path to your json file

### Insomnia export

1. Create you request in a specific Workspace
2. Export your current Workspace (the parser accept only one Workspace at the same time) in Insomnia v4 (JSON) format
3. Start the script with the filepath to your export `npm run insomnia-parser FILEPATH`.
   A new file `data-parsed.json` will be created.


Finally, to create the markdown from the parsed data, you just need to run the script `npm run markdown-generator`.
It will generate the documentation in markdown called `api-doc.md`.

That's t !
