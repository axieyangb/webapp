"use strict";
var User = (function () {
    function User() {
        this.username = localStorage["username"];
        this.grant_type = "password";
        this.token = localStorage["token"];
    }
    return User;
}());
exports.User = User;
//# sourceMappingURL=user.js.map