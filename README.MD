# USAGE
Clone this repo on your computer.
Run ```npm i``` to download all packages.
Create '.env' file where you will specify variable `DEV_PORT`. This port will be used to run the server.
Run ```npm run build``` to compile all typescript to vanilla javascript, bundle everything up with webpack, and start the server.

# Project description
In ```src``` folder, you'll find source code for server and for client, which need to compiled to vanilla JS from TS.
The compiled code will be located in ```out``` folder.
In the folder named ```static``` you'll find all files, that are requested from one of the pages on the front-end.
In ```views``` folder you'll find all necessary html files. 
