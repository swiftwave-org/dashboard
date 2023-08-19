# 🚀 Swiftwave Dashboard

![Dashboard Uptime](https://img.shields.io/endpoint?labelColor=394149&label=Dashboard+Uptime&url=https://raw.githubusercontent.com/swiftwave-org/upptime/master/api/swiftwave-dashboard/uptime.json) ![Dashboard Response Time](https://img.shields.io/endpoint?labelColor=394149&label=Dashboard+Response+Time&url=https://raw.githubusercontent.com/swiftwave-org/upptime/master/api/swiftwave-dashboard/response-time.json)

💁 SwiftWave is a self-hosted lightweight PaaS solution to deploy and manage your applications
🏄 SwiftWave dashboard is the GUI to connect to your self-hosted server be deploy and manage your applcation.

#### 👀 Let's Have a look of application deployment process from SwiftWave dashboard

[![Solargraph Dashboard preview](https://github.com/swiftwave-org/swiftwave-dashboard/assets/57363826/68546452-644d-4fc2-8de0-55faf2e61383)](https://youtu.be/lojP-5SRDt0)

### 🤔 How to Access ?
#### Hosted Version
> It's a deployed dashboard with pre-configured HTTPS proxy to keep connection encrypted.

Steps -
1. Go to [dashboard.swiftwave.org](https://dashboard.swiftwave.org)
2. At the bottom of page, Click on `Update` button
 1. Enter the IP of the server
 2. Enter the port of the service [**default PORT for swiftwave -> 3333**]
3. Enter the username and password [this credentials has been set while installing swiftwave in server]
4. Login
5. 🍻 That's all. Now explore the dashboard

#### Self deployed
Steps -
1. Clone the repository
2. Run `npm install`
3. Run `npm run build`
4. Using nginx or web server, serve the `dist` folder

### 🫂 Setup for Contribution
1. Fork the repository
2. Clone the forked repository
3. Run `npm install`
4. Run `npm run start`
5. Open the url displayed on terminal
