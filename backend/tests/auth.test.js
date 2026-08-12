import request from 'supertest';
import {expect} from 'chai';
import app from '../src/server.js';

describe("Login API", ()=>{
    it("should login a user", async()=>{
        const response = await request(app)
        .post("/auth/login")
        .send({
            email: "msaadirfan04@gmail.com",
            password: "Saadpmc9."
        });
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property("accessToken");
        expect(response.body.accessToken).to.be.a("string");
    });

    it("should not login a user", async()=>{
        const response = await request(app)
        .post("/auth/login")
        .send({
            email: "msaadirfan04@gmail.com",
            password: "Saadpmc9"
        });

        expect(response.status).to.equal(401);
        expect(response.body.message).to.equal("Invalid credentials");
    });
    
});


describe("Register API", ()=>{
    it("should register a user", async()=>{
        const response = await request(app)
        .post("/auth/register")
        .send({
            username: "mochamocha",
            email: "mocha@gmail.com",
            password: "mochamocha"
        });
        expect(response.status).to.equal(201);
        expect(response.body.message).to.equal("User created successfully");
        expect(response.body).to.have.property("token");
    });

    it("should not register a user", async()=>{
        const response = await request(app)
        .post("/auth/register")
        .send({
            username: "msaadirfan",
            email: "msaadirfan04@gmail.com",
            password: "Saadpmc9."
        });
        expect(response.status).to.equal(409);
        expect(response.body.message).to.equal("Username or Email already exists");
    });

});

describe("Logout API", ()=>{
    it("should logout a user", async()=>{

        const loginResponse = await request(app)
        .post("/auth/login")
        .send({
            email: "msaadirfan04@gmail.com",
            password: "Saadpmc9."
        });

        expect(loginResponse.status).to.equal(200);

        const logoutResponse = await request(app)
        .post("/auth/logout")
        .set("Cookie", loginResponse.headers["set-cookie"]);

        expect(logoutResponse.status).to.equal(200);
    });
});

describe("LogoutAll API", ()=>{
    it("should logout a user from all devices", async()=>{

        const loginResponse = await request(app)
        .post("/auth/login")
        .send({
            email: "msaadirfan04@gmail.com",
            password: "Saadpmc9."
        });

        expect(loginResponse.status).to.equal(200);

        const logoutResponse = await request(app)
        .post("/auth/logout-all")
        .set("Cookie", loginResponse.headers["set-cookie"]);

        expect(logoutResponse.status).to.equal(200);
    });
});


