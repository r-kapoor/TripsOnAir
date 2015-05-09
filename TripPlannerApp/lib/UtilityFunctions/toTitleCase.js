/**
 * Created by rkapoor on 09/05/15.
 */
function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

module.exports.toTitleCase = toTitleCase;
