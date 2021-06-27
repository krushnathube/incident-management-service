import * as chai from "chai";
import * as sinon from "sinon";
import * as faker from "faker";
import { User } from "../../src/entity/User";
import { getAllUsers } from "../../src/controllers/user";

const expect = chai.expect;
const users: any = [
  {
    id: "8badc5a4-28c5-42eb-a4d3-64f53fec972e",
    username: "test",
  },
  {
    id: "4d58b43e-fed8-4763-9f55-47133ce59998",
    username: "test1",
  },
];

describe("User Controller", function () {
  let req: any;
  let res: any;
  beforeEach(() => {
    req = {
      user: faker.datatype.uuid(),
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
      end(): any {
        return this;
      },
      clean() {
        this.data = null;
        this.statusCode = 500;
      },
    };
  });

  describe("getAllUsers", async () => {
    it("should get all users when requested", async function () {
      const expected = {
        data: users,
      };
      const findStub = sinon.stub(User, "find").resolves(users);
      const response: any = await getAllUsers(req, res);
      expect(response.data).to.equal(expected.data);
      findStub.restore();
    });

    afterEach(() => {
      req.clean();
      res.clean();
    });
  });
});
