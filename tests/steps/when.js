'use strict';
const _ = require('lodash');
var Promise = this.Promise || require('promise');
var agent = require('superagent-promise')(require('superagent'), Promise);
 

const makeHttpRequest = async (path, method, options) => {
    let root = process.env.TEST_ROOT;
    let url = options.noteId ? `${root}/${path}/${options.noteId}` : `${root}/${path}`;
    let httpReq = agent(method, url);
    let body = _.get(options, "body");
    let idToken = _.get(options, "idToken");
    console.log(`invoking HTTP ${method} ${url}`);

    try {
        // set authorization header
        httpReq.set('Authorization', idToken);
        console.log('body')
        console.log(body)
        if(body) {
            httpReq.send(body);
        }

        let res = await httpReq;
        return {
            statusCode: res.status,
            body: res.body
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: err.status,
            body: err
        };
    }
}

exports.invoke_create_note = (options) => {
    let response = makeHttpRequest("notes", "POST", options);
    return response;
}

exports.invoke_update_note = (options) => {
    let response = makeHttpRequest("notes", "PUT", options);
    return response;
}

exports.invoke_delete_note = (options) => {
    let response = makeHttpRequest("notes", "DELETE", options);
    return response;
}