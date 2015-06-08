var aws_access_key_id = 'AKIAJZZ25PCBSAKCIICQ';
var aws_secret_access_key = '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';

var AWS = require('aws-sdk');
AWS.config.update({accessKeyId: aws_access_key_id, secretAccessKey: aws_secret_access_key, region: 'us-east-1'});
var ec2 = new AWS.EC2();

module.exports = function (app) {

    var loggedIn = false;

    // api ---------------------------------------------------------------------
    app.get('/api/all/instances', function (req, res) {
            if (loggedIn === false) {
                res.send(401);
                return;
            }

            var params = {
                Filters: [
                    {
                        Name: 'instance-state-name',
                        Values: [
                            'running'
                        ]
                    }
                ],
                MaxResults: req.query.limit,
                NextToken: req.query.token
            };

            if (typeof req.query.limit !== 'undefined' && req.query.limit) {
                params.MaxResults = req.query.limit;
            }

            if (typeof req.query.token !== 'undefined' && req.query.token) {
                params.NextToken = req.query.token;
            }

            //get all running instances
            ec2.describeInstances(params, function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                } // an error occurred
                else {
                    console.log(data);
                    res.send(200, data);
                    // successful response
                }
            });
        }
    )
    ;


//Login Call.
    app.post('/login', function (req, res) {
        if (req.body.username === 'test' && req.body.password === 'test') {
            console.log('Login Succeeded');
            res.send(200);
            loggedIn = true;
        }

        else {
            res.send(401);
            console.log('Login Failed');
        }

    });


//Logout Call.
    app.post('/logout', function (req, res) {
        loggedIn = false;
        res.send(200);
    });

// application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
}
;