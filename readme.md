# Skunk Works Robotics Scouting App 2020
## Overview
The "scouting app" is a data input/collection tool used by FRC team 1983 for the 2020 Infinite Recharge season. 
## Features
- Collect match data input in a semantic manner
- Send the data to a server
- Robust caching
- Function in an ergonomic manner
- Ease of scout management
- Rapid upload of data
- Low bandwidth and power use
## Languages
This app was programmed in HTML, CSS, and JS in order to be served over the file:// protocol.
## Deployment
#### Local Deployment
Simply `git pull https://github.com/Skunkworks1983/ScoutingApp2020` to your desired directory and open the file via file://
#### Web Server
To deploy over a web server run `npm install` and `node servelet.js`.
Note: You must have Node.js and NPM installed.

## Backend
For security reasons the backend cannot be disclosed. However, it simply requires an endpoint to listen for data and push it to a database.



Created by Iliyan Stoyanov