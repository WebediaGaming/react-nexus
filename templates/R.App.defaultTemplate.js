module.exports = function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {
        __p += '<!doctype html lang="' +
        __e( lang ) +
        '">\r\n<html>\r\n    <head>\r\n        <meta charset=\'utf-8\'>\r\n        <meta http-equiv="X-UA-Compatible" content="IE=edge">\r\n        <meta name="description" content="' +
        __e( description ) +
        '">\r\n        <meta name="viewport" content="width=device-width, initial-scale=1">\r\n        ';
        styleChunks.forEach(function(chunk, name) { ;
            __p += '\r\n            <style type="text/css" data-stylesheet="' +
            __e( name ) +
            '">\r\n                ' +
            ((__t = ( chunk )) == null ? '' : __t) +
            '\r\n            </style>\r\n        ';
        }); ;
        __p += '\r\n    </head>\r\n    <body>\r\n        <div id="ReactOnRails-App-Root">\r\n            ' +
        ((__t = ( rootHtml )) == null ? '' : __t) +
        '\r\n        </div>\r\n        <script type="text/javascript">\r\n            window.__ReactOnRails = {};\r\n            window.__ReactOnRails.serializedFlux = JSON.parse(' +
            ((__t = ( JSON.stringify(serializedFlux) )) == null ? '' : __t) +
            ');\r\n            window.__ReactOnRails.headers = JSON.parse(' +
            ((__t = ( JSON.stringify(headers) )) == null ? '' : __t) +
            ');\r\n            window.__ReactOnRails.guid = "' +
((__t = ( guid )) == null ? '' : __t) +
'";\r\n        </script>\r\n        <script type="text/javascript" src="' +
__e( client ) +
'"></script>\r\n    </body>\r\n</html>\r\n';

}
return __p
};
