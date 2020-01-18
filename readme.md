# Skunk Works Robotics Scouting App 2020
## Overview
The "scouting app" is a data input/collection tool used by FRC team 1983 for the 2020 Infinite Recharge season. 
## Features
This app is designed with these features in mind.
- Be installed as a local application for Google Nexus 7 tablets
- Collect match data input
- Send the data to a server
- Cache the data if the server is not available
- Function in an ergonomic manner
- Ease of scout management
- Rapid upload of data
- Low bandwidth and power use
## Languages
This app was programmed in HTML, CSS, JS. We used the jQuery.js library and Velocity.js. Intended for use in the Chrome browser. We refrained from the use of heavy JS libraries and view engines to improve performance on our 2012-era tablets. Another performance consideration was extensive use of web workers to thread heavy tasks.

Created by Iliyan Stoyanov and Perf Le