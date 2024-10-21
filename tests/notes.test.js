'use strict';

let init = require('./steps/init');
let {an_authenticated_user} = require('./steps/given');
let {invoke_create_note, invoke_update_note, invoke_delete_note} = require('./steps/when');
let idToken;

describe('Given an authenticated user', () => {
    beforeAll(async () => {
        init();
        let user = await an_authenticated_user();
        idToken = user.authenticationResult.idToken;
        console.log(idToken);
    });

    describe('When we invoke the POST /notes endpoint', () => {
        it('should create a new note', async () => {
            body = {
                id: '1',
                title: 'Test note title',
                body: 'Test note body'
            }
            let response = await invoke_create_note({idToken, body});

            expect(response.statusCode).toEqual(201);
            expect(response.body).not.tobeNull();
        });
    });

    describe('When we invoke the PUT /notes:id endpoint', () => {
        it('should update the note', async () => {
            const noteId = "1";

            body = {
                title: 'updated title',
                body: 'udpated body'
            }
            let response = await invoke_update_note({idToken, body, noteId});

            expect(response.statusCode).toEqual(200);
            expect(response.body).not.tobeNull();
        });
    });

    describe('When we invoke the DELETE /notes:id endpoint', () => {
        it('should delete the note', async () => {
            const noteId = "1";
            let response = await invoke_delete_note({idToken, noteId});

            expect(response.statusCode).toEqual(200);
            expect(response.body).not.tobeNull();
        });
    });
});