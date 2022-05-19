/* Example javascript code to be executed as InternalJSFaaS behavior in VCD.
This example creates an organization in VCD using the behavior invocation arguments 
and then deletes the organization after creating it.*/

const https = require('https');

//the data to be used when creating the organization is taken from the behavior invocation arguments in the vcdContext object
const data = {
    'name': vcdContext.arguments.orgName,
    'displayName': vcdContext.arguments.orgDisplayName,
    'description': vcdContext.arguments.orgDescription,
    'isEnabled': vcdContext.arguments.orgIsEnabled,
    'canPublish': vcdContext.arguments.orgCanPublish
};

//base function for executing HTTP requests
function httpRequest(params, postData) {
    return new Promise(function(resolve, reject) {
        req = https.request(params, function(res) {
            body = [];
            res.on('data', function(chunk) {
                body.push(chunk);
            });
            res.on('end', function() {
                var bodyString = Buffer.concat(body).toString();
                try {
                    if (bodyString != '') {
                        bodyJSON = JSON.parse(bodyString);
                    } else {
                        bodyJSON = {};
                    }
                } catch (e) {
                    reject(e);
                }
                resolve({
                    statusCode: res.statusCode,
                    body: bodyJSON
                });
            });
        });
        req.on('error', function(err) {
            reject(err);
        });
        if (postData) {
            req.write(postData);
        }
        req.end();
    });
};

//function creating an organization
createOrganization = function(data) {
    const options = {
        uri: `https://${vcdContext.hostname}:${vcdContext.port}/cloudapi/1.0.0/orgs`,
        protocol: 'https:',
        method: 'POST',
        hostname: vcdContext.hostname,
        port: vcdContext.port,
        path: '/cloudapi/1.0.0/orgs',
        rejectUnauthorized: false,
        requestCert: true,
        headers: {
            'Accept': 'application/json; version=36.1',
            'Authorization': vcdContext.actAsToken
        },
        json: true
    };
    return httpRequest(options, JSON.stringify(data));
};

//function deleting an organization with the supplied id
deleteOrganization = function(id) {
    const options = {
        uri: `https://${vcdContext.hostname}:${vcdContext.port}/cloudapi/1.0.0/orgs/${id}`,
        protocol: 'https:',
        method: 'DELETE',
        hostname: vcdContext.hostname,
        port: vcdContext.port,
        path: `/cloudapi/1.0.0/orgs/${id}`,
        rejectUnauthorized: false,
        requestCert: true,
        headers: {
            'Accept': 'application/json; version=36.1',
            'Authorization': vcdContext.actAsToken
        }
    };
    return httpRequest(options, null);
};

//create an organization, delete organization and then if deleted successfully return okay
createOrganization(data).then(function(res) {
    return deleteOrganization(res.body['id']);
}).then(function(res) {
    if(res.statusCode == 202) {
        return 'okay';
    } else {
        return 'error';
    }
});