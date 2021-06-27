import * as chai from "chai";
import * as sinon from "sinon";
import * as faker from "faker";
import { Incident } from "../../src/entity/Incident";
import {
  createIncident,
  getIncidents,
  deleteIncident,
  closeIncident,
  acknowledgeIncident,
} from "../../src/controllers/incident";
import { fieldsToSelect } from "../../src/controllers/incident";
import { SelectQueryBuilder } from "typeorm";

const expect = chai.expect;
const incidents = [
  {
    id: "464cf54c-f9e9-4e38-8d81-6fd226ad6218",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "fdsff",
    type: "employee",
    description: "description test",
    assigneeId: "8badc5a4-28c5-42eb-a4d3-64f53fec972e",
    isResolved: true,
    closedAt: new Date(),
    isAcknowledged: true,
    acknowledgedAt: new Date(),
    createdById: "118e6203-c260-4208-8b71-0c6498e46ec6",
    updatedById: "118e6203-c260-4208-8b71-0c6498e46ec6",
    assignee: {
      id: "8badc5a4-28c5-42eb-a4d3-64f53fec972e",
      username: "test",
    },
    notes: [
      {
        id: 1,
        body: "sSas",
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          id: "8badc5a4-28c5-42eb-a4d3-64f53fec972e",
          username: "test",
        },
      },
    ],
    createdBy: {
      id: "118e6203-c260-4208-8b71-0c6498e46ec6",
      username: "test2",
    },
    updatedBy: null,
    closedBy: {
      id: "8badc5a4-28c5-42eb-a4d3-64f53fec972e",
      username: "test",
    },
    acknowledgedBy: {
      id: "8badc5a4-28c5-42eb-a4d3-64f53fec972e",
      username: "test",
    },
  },
];

enum Type {
  Employee = "employee",
  Environmental = "environmental",
  Property = "property",
  Vehicle = "vehicle",
  Fire = "fire",
}

describe("Incident Controller", function () {
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
  describe("getIncidents", async () => {
    it("should get a incidents when requested", async function () {
      const expected = {
        data: incidents,
      };
      const fakeQueryBuilder = sinon.createStubInstance(SelectQueryBuilder);

      fakeQueryBuilder.where
        .withArgs(
          "incident.assigneeId = :userId or incident.createdById = :createdById",
          { userId: req.user, createdById: req.user }
        )
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("incident.assignee", "assignee")
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("incident.notes", "notes")
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("notes.author", "noteAuthor")
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("incident.createdBy", "createdBy")
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("incident.updatedBy", "updatedBy")
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("incident.closedBy", "closedBy")
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("incident.acknowledgedBy", "acknowledgedBy")
        .returnsThis();
      fakeQueryBuilder.select.withArgs(fieldsToSelect).returnsThis();
      fakeQueryBuilder.getMany.resolves(incidents);

      const createQueryBuilderStub = sinon
        .stub(Incident, "createQueryBuilder")
        .returns(fakeQueryBuilder as any);
      const response: any = await getIncidents(req, res);
      expect(response.data).to.equal(expected.data);
      createQueryBuilderStub.restore();
    });

    afterEach(() => {
      req.clean();
      res.clean();
    });
  });

  describe("createIncident", async () => {
    beforeEach(() => {
      req.body = {
        title: faker.address.streetAddress(),
        assigneeId: faker.datatype.uuid(),
        description: faker.address.streetName(),
        type: Type.Employee,
      };
    });

    it("should not create a incident when title is not in range of 3-60 characters length", async function () {
      const expected = {
        message: "Title must be in range of 3-60 characters length.",
        statusCode: 400,
      };
      req.body.title = "";
      const response: any = await createIncident(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.message).to.equal(expected.message);
    });

    it("should create a incident when input is valid", async function () {
      const expected = {
        data: incidents[0],
        statusCode: 201,
      };
      const addIncident = new Incident();
      addIncident.title = req.body.title = incidents[0].title;
      addIncident.assigneeId = req.body.assigneeId = incidents[0].assigneeId;
      addIncident.description = req.body.description = incidents[0].description;
      addIncident.type = req.body.type = Type.Employee;
      addIncident.save = sinon.stub().resolves();
      const createOneStub = sinon.stub(Incident, "create").returns(addIncident);
      const fakeQueryBuilder = sinon.createStubInstance(SelectQueryBuilder);

      fakeQueryBuilder.where
        .withArgs("incident.id = :incidentId", { incidentId: addIncident.id })
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("incident.assignee", "assignee")
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("incident.notes", "notes")
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("notes.author", "noteAuthor")
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("incident.createdBy", "createdBy")
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("incident.updatedBy", "updatedBy")
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("incident.closedBy", "closedBy")
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("incident.acknowledgedBy", "acknowledgedBy")
        .returnsThis();
      fakeQueryBuilder.select.withArgs(fieldsToSelect).returnsThis();
      fakeQueryBuilder.getOne.resolves(incidents[0]);

      const createQueryBuilderStub = sinon
        .stub(Incident, "createQueryBuilder")
        .returns(fakeQueryBuilder as any);

      const response: any = await createIncident(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data).to.equal(expected.data);
      createOneStub.restore();
      createQueryBuilderStub.restore();
    });

    afterEach(() => {
      req.clean();
      res.clean();
    });
  });

  describe("deleteIncident", async () => {
    let findOneStub: any;
    beforeEach(() => {
      req.params = {
        incidentId: faker.datatype.uuid(),
      };
      findOneStub = sinon.stub(Incident, "findOne");
    });

    it("should not delete a incident when incidentId is not valid", async function () {
      const expected = {
        message: "Invalid incident ID.",
        statusCode: 400,
      };
      findOneStub.resolves();
      const response: any = await deleteIncident(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.message).to.equal(expected.message);
    });

    it("should not delete a incident when incident is not created by same user", async function () {
      const expected = {
        message: "Access is denied.",
        statusCode: 401,
      };
      const removeIncident = new Incident();
      removeIncident.createdById = faker.datatype.uuid();
      findOneStub.resolves(removeIncident);
      const response: any = await deleteIncident(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.message).to.equal(expected.message);
    });

    it("should delete a incident when incidentId is valid", async function () {
      const expected = {
        statusCode: 204,
      };
      const removeIncident = new Incident();
      removeIncident.createdById = req.user;
      removeIncident.remove = sinon.stub().resolves();
      findOneStub.resolves(removeIncident);
      const response: any = await deleteIncident(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
    });

    afterEach(() => {
      findOneStub.restore();
      req.clean();
      res.clean();
    });
  });

  describe("closeIncident", async () => {
    let findOneStub: any;
    beforeEach(() => {
      req.params = {
        incidentId: faker.datatype.uuid(),
      };
      findOneStub = sinon.stub(Incident, "findOne");
    });

    it("should not close a incident when incidentId is not valid", async function () {
      const expected = {
        message: "Invalid incident ID.",
        statusCode: 400,
      };
      findOneStub.resolves();
      const response: any = await closeIncident(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.message).to.equal(expected.message);
    });

    it("should not close a incident when incident is not assigned to same user", async function () {
      const expected = {
        message: "Access is denied.",
        statusCode: 401,
      };
      const removeIncident = new Incident();
      removeIncident.assigneeId = faker.datatype.uuid();
      findOneStub.resolves(removeIncident);
      const response: any = await closeIncident(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.message).to.equal(expected.message);
    });

    it("should not close a incident when incident is already marked as closed", async function () {
      const expected = {
        message: "Incident is already marked as closed.",
        statusCode: 400,
      };
      const removeIncident = new Incident();
      removeIncident.assigneeId = req.user;
      removeIncident.isResolved = true;
      findOneStub.resolves(removeIncident);
      const response: any = await closeIncident(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.message).to.equal(expected.message);
    });

    it("should close a incident when incidentId is valid", async function () {
      const expected = {
        data: incidents[0],
        statusCode: 201,
      };
      const resolveIncident = new Incident();
      resolveIncident.assigneeId = req.user = incidents[0].assigneeId;
      resolveIncident.description = incidents[0].description;
      resolveIncident.isResolved = false;
      resolveIncident.save = sinon.stub().resolves();
      findOneStub.resolves(resolveIncident);
      const fakeQueryBuilder = sinon.createStubInstance(SelectQueryBuilder);

      fakeQueryBuilder.where
        .withArgs("incident.id = :incidentId", {
          incidentId: req.params.incidentId,
        })
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("incident.assignee", "assignee")
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("incident.notes", "notes")
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("notes.author", "noteAuthor")
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("incident.createdBy", "createdBy")
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("incident.updatedBy", "updatedBy")
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("incident.closedBy", "closedBy")
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("incident.acknowledgedBy", "acknowledgedBy")
        .returnsThis();
      fakeQueryBuilder.select.withArgs(fieldsToSelect).returnsThis();
      fakeQueryBuilder.getOne.resolves(incidents[0]);

      const createQueryBuilderStub = sinon
        .stub(Incident, "createQueryBuilder")
        .returns(fakeQueryBuilder as any);

      const response: any = await closeIncident(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data).to.equal(expected.data);
      createQueryBuilderStub.restore();
    });

    afterEach(() => {
      findOneStub.restore();
      req.clean();
      res.clean();
    });
  });

  describe("acknowledgeIncident", async () => {
    let findOneStub: any;
    beforeEach(() => {
      req.params = {
        incidentId: faker.datatype.uuid(),
      };
      findOneStub = sinon.stub(Incident, "findOne");
    });

    it("should not acknowledge a incident when incidentId is not valid", async function () {
      const expected = {
        message: "Invalid incident ID.",
        statusCode: 400,
      };
      findOneStub.resolves();
      const response: any = await acknowledgeIncident(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.message).to.equal(expected.message);
    });

    it("should not acknowledge a incident when incident is not assigned to same user", async function () {
      const expected = {
        message: "Access is denied.",
        statusCode: 401,
      };
      const ackIncident = new Incident();
      ackIncident.assigneeId = faker.datatype.uuid();
      findOneStub.resolves(ackIncident);
      const response: any = await acknowledgeIncident(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.message).to.equal(expected.message);
    });

    it("should not acknowledge a incident when incident is already marked as acknowledged", async function () {
      const expected = {
        message: "Incident is already marked as acknowledged.",
        statusCode: 400,
      };
      const ackIncident = new Incident();
      ackIncident.assigneeId = req.user;
      ackIncident.isAcknowledged = true;
      findOneStub.resolves(ackIncident);
      const response: any = await acknowledgeIncident(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.message).to.equal(expected.message);
    });

    it("should acknowledge a incident when incidentId is valid", async function () {
      const expected = {
        data: incidents[0],
        statusCode: 201,
      };
      const ackIncident = new Incident();
      ackIncident.assigneeId = req.user = incidents[0].assigneeId;
      ackIncident.description = incidents[0].description;
      ackIncident.isAcknowledged = false;
      ackIncident.save = sinon.stub().resolves();
      findOneStub.resolves(ackIncident);
      const fakeQueryBuilder = sinon.createStubInstance(SelectQueryBuilder);

      fakeQueryBuilder.where
        .withArgs("incident.id = :incidentId", {
          incidentId: req.params.incidentId,
        })
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("incident.assignee", "assignee")
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("incident.notes", "notes")
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("notes.author", "noteAuthor")
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("incident.createdBy", "createdBy")
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("incident.updatedBy", "updatedBy")
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("incident.closedBy", "closedBy")
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("incident.acknowledgedBy", "acknowledgedBy")
        .returnsThis();
      fakeQueryBuilder.select.withArgs(fieldsToSelect).returnsThis();
      fakeQueryBuilder.getOne.resolves(incidents[0]);

      const createQueryBuilderStub = sinon
        .stub(Incident, "createQueryBuilder")
        .returns(fakeQueryBuilder as any);

      const response: any = await acknowledgeIncident(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data).to.equal(expected.data);
      createQueryBuilderStub.restore();
    });

    afterEach(() => {
      findOneStub.restore();
      req.clean();
      res.clean();
    });
  });
});
