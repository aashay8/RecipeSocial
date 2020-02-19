const vulnRegexDetector = require('vuln-regex-detector');

const cacheConfig = {
    type: vulnRegexDetector.cacheTypes.persistent
};
const config = {
    cache: cacheConfig
};


module.exports = function (req, res, next) {
    console.log('Entered regex check')
    vulnRegexDetector.test(req.params.code, config)
        .then((result) => {
            if (result === vulnRegexDetector.responses.vulnerable) {
                console.log('Exiting regex check')
                return res.status(429).json({
                    message: 'Regex is vulnerable'
                });
            }
            return next();
        })
        .catch((e) => {
            console.log(e); 
            return next()})

}