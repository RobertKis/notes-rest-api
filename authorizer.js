const { CognitoJwtVerifier } = require('aws-jwt-verify');

const jwtVerifier = new CognitoJwtVerifier.Create({
    userPoolId: 'eu-north-1_f2JWrLtGd',
    tokenUse: 'id',
    clientId: '3chv8oi2nl8ikmfv1d7l4qk2n9' 
});

generatePolicy = (principleId, effect, resource) => {
    const authResponse = {};
    authResponse.principalId = principleId;

    if(effect && resource) {
        const policyDocument = {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource
            }]
        }
        authResponse.policyDocument = policyDocument;
    }

    authResponse.context = {
        "foo": "bar"
    }

    console.log(JSON.stringify(authResponse));

    return authResponse;
}

exports.handler = async (event, context, cb) => {
    let token = event.authorizationToken;
    console.log(token);
    // validate the token
    try {
        const payload = await jwtVerifier.verify(token);
        console.log(JSON.stringify(payload));
        cb(null, generatePolicy('user', 'Allow', event.methodArn));
    } catch (error) {
        cb("Error: Invalid token");
    }
}