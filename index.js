
var ig = require('instagram-node').instagram();


ig.use({
    access_token: '217217182.1677ed0.7cad815cb833450a9511ec055838a970'
});

ig.user_self_media_recent( function(err, medias, pagination, remaining, limit) {

    console.log(err, medias)

});


// https://api.instagram.com/oembed/?url=http://instagram.com/p/BaL_uqIBz3Q/