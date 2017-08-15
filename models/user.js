var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var apikey = require("apikeygen").apikey;

var user = new Schema(
    {
        api_key: String,
        name: String,
        email_verified: Boolean,
        email: String,timezone: {type: String, default: 'America/Los_Angeles'},
        syst_admin: {type: Boolean, default: false}
    },
    {
        timestamps: true,
        versionKey: false
    }
);
user.methods.setUserAdmin = function (admin) {
    return this.update({syst_admin: admin});
};

user.methods.updateBasic = function (name,email) {
    this.set({name: name});
    this.set({email: email});
    return this.save();
};


user.static({

    /**
     * Get the user details by Auth0 Id
     *
     * @param  {Object} id from the slash command
     * @return {Promise}
     */
    getToApi: function (id, api_key) {
        var User = this.model('User');
        return User.findOne({_id: id, api_key:api_key}).exec();
    },

    newUser: function (name, email) {
        var User = this.model('User');
        var user = new User();

        user.set({
            name: name,
            email: email,
            api_key: apikey()
        });
        return user.save();
    }
});

module.exports = mongoose.model('User', user);