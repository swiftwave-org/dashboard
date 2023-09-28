# 🚀 Swiftwave Dashboard

![Dashboard Uptime](https://img.shields.io/endpoint?labelColor=394149&label=Dashboard+Uptime&url=https://raw.githubusercontent.com/swiftwave-org/upptime/master/api/swiftwave-dashboard/uptime.json) ![Dashboard Response Time](https://img.shields.io/endpoint?labelColor=394149&label=Dashboard+Response+Time&url=https://raw.githubusercontent.com/swiftwave-org/upptime/master/api/swiftwave-dashboard/response-time.json)

💁 SwiftWave is a self-hosted lightweight PaaS solution to deploy and manage your applications
🏄 SwiftWave dashboard is the GUI to connect to your self-hosted server be deploy and manage your applcation.

#### 👀 Let's Have a look of application deployment process from SwiftWave dashboard

[<img src="https://raw.githubusercontent.com/swiftwave-org/assets/main/swiftwave-dashboard-preview-video.png" width="500px" />](https://youtu.be/lojP-5SRDt0 "Swiftwave Dashboard")

### 🤔 How to Access?
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

#### Self-deployed
Steps -
1. Clone the repository
2. Run `npm install`
3. Run `npm run build`
4. Using nginx or web server, serve the `dist` folder

### 🫂 Local Installation for Contribution
1. Fork the repository
2. Clone the forked repository
3. Run `npm install`
4. Run `npm run dev`
5. Open `localhost:5173` in browser
6. Use the `Swiftwave staging environment` to work on the front end without installing the Swiftwave server locally.
   1. Server Url -> `staging.swiftwave.org`
   2. Server Port -> `3333`
   3. Username -> `admin`
   4. Password -> `admin`

### Some Important Note Regarding Staging Environment
1. For testing deployment of the app, use this project [https://github.com/tanmoysrt/minc](https://github.com/tanmoysrt/minc).
   Don't deploy any other application to keep it accessible to other contributors.
2. For Ingress Mapping, use any subdomain of `swiftwave.xyz` . Example - `test.swiftwave.xyz`, `test2.swiftwave.xyz`
3. Don't add a real GitHub username and password to the `Git Credentials` page, as the staging environment is accessible to various users
