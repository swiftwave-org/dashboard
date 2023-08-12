import config from "../config/route";
import axios from "axios";
import qs from "qs";

class AuthController {
    static isLoggedIn = false;

    static login(username, password) {
        var data = qs.stringify({
            'username': username,
            'password': password
        });
        var config = {
            method: 'post',
            url: 'http://15.206.147.214:3333/auth/logout',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });

    }

}