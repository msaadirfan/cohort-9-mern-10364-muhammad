import app from "../src/server.js";
import {expect} from 'chai';
import request from 'supertest';

describe("Create Note API", ()=>{
    it("should create a note", async()=>{
        const loginResponse = await request(app)
        .post("/auth/login")
        .send({
            email: "msaadirfan04@gmail.com",
            password: "Saadpmc9."
        });

        expect(loginResponse.status).to.equal(200);

        const accessToken = loginResponse.body.accessToken;
        const createNoteResponse = await request(app)
        .post("/notes/")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
            title: "Unit test",
            description: "Checking unit test for create note api"
        });

        expect(createNoteResponse.status).to.equal(201);
        expect(createNoteResponse.body.message).to.equal("Note created");

    });
});

describe("Update Note API", ()=>{

    it("should update a note", async()=>{
        const loginResponse = await request(app)
        .post("/auth/login")
        .send({
            email: "msaadirfan04@gmail.com",
            password: "Saadpmc9."
        });

        expect(loginResponse.status).to.equal(200);

        const accessToken = loginResponse.body.accessToken;

        const UpdateNoteResponse = await request(app)
        .patch("/notes/6a7af99c4123dc00675e66c7")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
            title: "Updated notes update"
        });

        expect(UpdateNoteResponse.status).to.equal(200);
        expect(UpdateNoteResponse.body.message).to.equal("Note updated successfully");
    });
});

describe("Get Notes API", ()=>{
    it("should get all notes", async()=>{
        const loginResponse = await request(app)
        .post("/auth/login")
        .send({
            email: "msaadirfan04@gmail.com",
            password: "Saadpmc9."
        });

        expect(loginResponse.status).to.equal(200);

        const accessToken = loginResponse.body.accessToken;

        const getNotesReponse = await request(app)
        .get("/notes/")
        .set("Authorization", `Bearer ${accessToken}`);

        expect(getNotesReponse.status).to.equal(200);
    });
});


describe("Get Note by ID API", ()=>{
    it("should return a note", async()=>{
        
        const loginResponse = await request(app)
        .post("/auth/login")
        .send({
            email: "msaadirfan04@gmail.com",
            password: "Saadpmc9."
        });

        expect(loginResponse.status).to.equal(200);

        const accessToken = loginResponse.body.accessToken;

        const getNoteByIdResponse = await request(app)
        .get("/notes/6a7af99c4123dc00675e66c7")
        .set("Authorization", `Bearer ${accessToken}`);

        expect(getNoteByIdResponse.status).to.equal(200);
        expect(getNoteByIdResponse.body).to.have.property("note");
        
    });
});

describe("Delete a Note", ()=>{
    it("should delete a note", async()=>{
        
        const loginResponse = await request(app)
        .post("/auth/login")
        .send({
            email: "msaadirfan04@gmail.com",
            password: "Saadpmc9."
        });

        expect(loginResponse.status).to.equal(200);

        const accessToken = loginResponse.body.accessToken;

        const getNoteByIdResponse = await request(app)
        .delete("/notes/6a7af99c4123dc00675e66c7")
        .set("Authorization", `Bearer ${accessToken}`);

        expect(getNoteByIdResponse.status).to.equal(200);
        expect(getNoteByIdResponse.body.message).to.equal("Note deleted successfully");
        
    });
});