import app from '../src/server.js';
import {expect} from 'chai';
import request from 'supertest';


describe("Auth validators", ()=>{
    it("should not login a user for invalid email", async()=>{
        const response = await request(app)
        .post("/auth/login/")
        .send({
             email: "testtest",
            password: process.env.TEST_USER_PASSWORD
        });

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("Invalid email");
    });

    it("should not login a user for invalid password length", async()=>{
        const response = await request(app)
        .post("/auth/login/")
        .send({
             email: process.env.TEST_USER_EMAIL,
            password: ""        });

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("Password should be 8 or more characters");
    });
    
    it("should not register a user for invalid username", async()=>{
        const response = await request(app)
        .post("/auth/register/")
        .send({
            username: "",
            email: process.env.TEST_USER_EMAIL,
            password: process.env.TEST_USER_PASSWORD
        });

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("Invalid username");
    });

    it("should not register a user for invalid email", async()=>{
        const response = await request(app)
        .post("/auth/register/")
        .send({
            username: process.env.TEST_USER_USERNAME,
            email: "testtest",
            password: process.env.TEST_USER_PASSWORD
            });

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("Invalid email");
    });

    it("should not register a user for invalid password length", async()=>{
        const response = await request(app)
        .post("/auth/register/")
        .send({
            username: process.env.TEST_USER_USERNAME,
            email: process.env.TEST_USER_EMAIL,
            password: ""
        });

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal("Password should be 8 or more characters");
    });
    
});

describe("Notes validators", ()=>{
    it("should not create a note for invalid title", async()=>{
        
        const loginResponse = await request(app)
        .post("/auth/login")
        .send({
             email: process.env.TEST_USER_EMAIL,
            password: process.env.TEST_USER_PASSWORD
        });

        expect(loginResponse.status).to.equal(200);

        const accessToken = loginResponse.body.accessToken;

        const createNoteResponse = await request(app)
        .post("/notes/")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
            title: "",
            description: "Testing"
        });

        expect(createNoteResponse.status).to.equal(400);
        expect(createNoteResponse.body.message).to.equal("Invalid title");
    });
    
    it("should not create a note for invalid description", async()=>{
        
        const loginResponse = await request(app)
        .post("/auth/login")
        .send({
             email: process.env.TEST_USER_EMAIL,
            password: process.env.TEST_USER_PASSWORD
        });

        expect(loginResponse.status).to.equal(200);

        const accessToken = loginResponse.body.accessToken;

        const createNoteResponse = await request(app)
        .post("/notes/")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
            title: "Testing validator",
            description: ""
        });

        expect(createNoteResponse.status).to.equal(400);
        expect(createNoteResponse.body.message).to.equal("Invalid description");
    });
    
    it("should not edit a note", async()=>{
        
        const loginResponse = await request(app)
        .post("/auth/login")
        .send({
             email: process.env.TEST_USER_EMAIL,
            password: process.env.TEST_USER_PASSWORD
        });

        expect(loginResponse.status).to.equal(200);

        const accessToken = loginResponse.body.accessToken;

        const editNoteResponse = await request(app)
        .patch("/notes/6a7af99c4123dc00675e66c7")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
            title: "",
            description: ""
        });

        expect(editNoteResponse.status).to.equal(400);
        expect(editNoteResponse.body.message).to.equal("Invalid request");
    });

    it("should not get a note for invalid ID", async()=>{
        
        const loginResponse = await request(app)
        .post("/auth/login")
        .send({
             email: process.env.TEST_USER_EMAIL,
            password: process.env.TEST_USER_PASSWORD
        });

        expect(loginResponse.status).to.equal(200);

        const accessToken = loginResponse.body.accessToken;

        const getNoteByIdResponse = await request(app)
        .get("/notes/asdajkdsad")
        .set("Authorization", `Bearer ${accessToken}`);

        expect(getNoteByIdResponse.status).to.equal(400);
        expect(getNoteByIdResponse.body.message).to.equal("Invalid ID");
    });


});