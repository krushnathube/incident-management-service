import * as chai from "chai";
import * as sinon from "sinon";
import * as faker from "faker";
import bcrypt from "bcryptjs";
import { User } from "../../src/entity/User";
import { loginUser, signupUser } from "../../src/controllers/auth";

const expect = chai.expect;

describe("Auth Controller", function () {
  let req: any;
  let res: any;
  beforeEach(() => {
    req = {
      body: {},
      clean() {
        this.body = {};
      },
    };
    res = {
      data: null,
      statusCode: 500,
      status(code: number) {
        this.statusCode = code;
        return this;
      },
      send(payload: any): any {
        this.data = payload;
        return this;
      },
      json(payload: any): any {
        this.data = payload;
        return this;
      },
      clean() {
        this.data = null;
        this.statusCode = 500;
      },
    };
  });
  describe("Signup User", async () => {
    const createUser: User = new User();
    let findOneStub: any;
    beforeEach(() => {
      createUser.id = faker.datatype.uuid();
      createUser.username = "username";
      createUser.passwordHash = "password";
      createUser.save = sinon.stub().resolves();
      findOneStub = sinon.stub(User, "findOne");
    });

    it("should not signup a user when username is not in range of 3-20 characters length", async function () {
      const expected = {
        message: "Username must be in range of 3-20 characters length.",
        statusCode: 400,
      };
      req.body = {
        username: "",
        password: createUser.passwordHash,
      };

      const response: any = await signupUser(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.message).to.equal(expected.message);
    });

    it("should not signup a user when username not having alphanumeric characters", async function () {
      const expected = {
        message: "Username must have alphanumeric characters only.",
        statusCode: 400,
      };
      req.body = {
        username: `${createUser.username} `, // space in username
        password: createUser.passwordHash,
      };

      const response: any = await signupUser(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.message).to.equal(expected.message);
    });

    it("should not signup a user when password is not valid", async function () {
      const expected = {
        message: "Password must be atleast 6 characters long.",
        statusCode: 400,
      };
      req.body = {
        username: createUser.username,
        password: "",
      };
      const response: any = await signupUser(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.message).to.equal(expected.message);
    });

    it("should not signup a user when username is already taken", async function () {
      const expected = {
        message: `Username '${createUser.username}' is already taken.`,
        statusCode: 401,
      };
      req.body = {
        username: createUser.username,
        password: createUser.passwordHash,
      };
      findOneStub.resolves(createUser);
      const response: any = await signupUser(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.message).to.equal(expected.message);
    });

    it("should signup a user when username and password is valid", async function () {
      const expected = {
        data: {
          id: createUser.id,
          username: createUser.username,
        },
        statusCode: 201,
      };
      req.body = {
        username: createUser.username,
        password: createUser.passwordHash,
      };
      findOneStub.resolves();
      const createOneStub = sinon.stub(User, "create").returns(createUser);

      const response: any = await signupUser(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.id).to.equal(expected.data.id);
      expect(response.data.username).to.equal(expected.data.username);
      createOneStub.restore();
    });

    afterEach(() => {
      req.clean();
      res.clean();
      findOneStub.restore();
    });
  });

  describe("Login User", async () => {
    const signinUser: User = new User();
    let findOneStub: any;
    beforeEach(() => {
      signinUser.id = faker.datatype.uuid();
      signinUser.username = "username";
      signinUser.passwordHash = "password";
      findOneStub = sinon.stub(User, "findOne");
    });

    it("should not login a user when username is not be empty", async function () {
      const expected = {
        message: "Username field must not be empty.",
        statusCode: 400,
      };
      req.body = {
        username: "",
        password: signinUser.passwordHash,
      };

      const response: any = await loginUser(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.message).to.equal(expected.message);
    });

    it("should not login a user when password is not be empty", async function () {
      const expected = {
        message: "Password field must not be empty.",
        statusCode: 400,
      };
      req.body = {
        username: signinUser.username,
        password: "",
      };
      const response: any = await loginUser(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.message).to.equal(expected.message);
    });

    it("should not login a user when username is not found.", async function () {
      const expected = {
        message: `User: '${signinUser.username}' not found.`,
        statusCode: 401,
      };
      req.body = {
        username: signinUser.username,
        password: signinUser.passwordHash,
      };
      findOneStub.resolves();
      const response: any = await loginUser(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.message).to.equal(expected.message);
    });

    it("should not login a user when Invalid credentials.", async function () {
      const expected = {
        message: "Invalid credentials.",
        statusCode: 401,
      };
      req.body = {
        username: signinUser.username,
        password: signinUser.passwordHash,
      };
      findOneStub.resolves(signinUser);
      const response: any = await loginUser(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.message).to.equal(expected.message);
    });

    it("should login a user when username and password is valid", async function () {
      const expected = {
        data: {
          id: signinUser.id,
          username: signinUser.username,
        },
        statusCode: 201,
      };
      req.body = {
        username: signinUser.username,
        password: signinUser.passwordHash,
      };
      const passwordHash = await bcrypt.hash(req.body.password, 10);
      signinUser.passwordHash = passwordHash;
      findOneStub.resolves(signinUser);
      const response: any = await loginUser(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.id).to.equal(expected.data.id);
      expect(response.data.username).to.equal(expected.data.username);
    });

    afterEach(() => {
      req.clean();
      res.clean();
      findOneStub.restore();
    });
  });
});
