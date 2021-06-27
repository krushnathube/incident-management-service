import * as chai from "chai";
import * as sinon from "sinon";
import * as faker from "faker";
import { Note } from "../../src/entity/Note";
import { deleteNote, postNote, updateNote } from "../../src/controllers/note";
import { Incident } from "../../src/entity/Incident";
import { SelectQueryBuilder } from "typeorm";

const expect = chai.expect;
const note: any = {
  id: 7,
  body: "dasdsd",
  incidentId: "9b81dc25-8bd4-414b-82f4-0592ffe5b901",
  createdAt: "2021-06-26T22:28:23.756Z",
  updatedAt: "2021-06-26T22:28:23.756Z",
  author: {
    id: "8badc5a4-28c5-42eb-a4d3-64f53fec972e",
    username: "test",
  },
};

describe("Note Controller", function () {
  let req: any;
  let res: any;
  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: faker.datatype.uuid(),
      clean() {
        this.body = {};
        this.params = {};
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

  describe("postNote", async () => {
    const createNote: Note = new Note();
    let findOneIncidentStub: any;
    beforeEach(() => {
      req.params.incidentId = faker.datatype.uuid();
      createNote.body = faker.address.streetAddress();
      createNote.save = sinon.stub().resolves();
      findOneIncidentStub = sinon.stub(Incident, "findOne");
    });

    it("should not post a note when body is not be empty", async function () {
      const expected = {
        message: "Note body field must not be empty.",
        statusCode: 400,
      };

      const response: any = await postNote(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.message).to.equal(expected.message);
    });

    it("should not post a note when access denied", async function () {
      const expected = {
        message: "Access is denied. Not a assignee of the incident.",
        statusCode: 401,
      };
      req.body.body = createNote.body;
      findOneIncidentStub.resolves();

      const response: any = await postNote(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.message).to.equal(expected.message);
    });

    it("should post a note when input is valid", async function () {
      const expected = {
        data: note,
        statusCode: 201,
      };
      req.body.body = createNote.body;
      const findIncident = new Incident();
      findIncident.assigneeId = req.user;
      findOneIncidentStub.resolves(findIncident);
      const createNoteStub = sinon.stub(Note, "create").returns(createNote);
      const fakeQueryBuilder = sinon.createStubInstance(SelectQueryBuilder);

      fakeQueryBuilder.where
        .withArgs("note.id = :noteId", { noteId: createNote.id })
        .returnsThis();
      fakeQueryBuilder.leftJoinAndSelect
        .withArgs("note.author", "author")
        .returnsThis();
      fakeQueryBuilder.select
        .withArgs([
          "note.id",
          "note.incidentId",
          "note.body",
          "note.createdAt",
          "note.updatedAt",
          "author.id",
          "author.username",
        ])
        .returnsThis();
      fakeQueryBuilder.getOne.resolves(note);

      const createQueryBuilderStub = sinon
        .stub(Note, "createQueryBuilder")
        .returns(fakeQueryBuilder as any);

      const response: any = await postNote(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data).to.equal(expected.data);
      createNoteStub.restore();
      createQueryBuilderStub.restore();
    });

    afterEach(() => {
      req.clean();
      res.clean();
      findOneIncidentStub.restore();
    });
  });

  describe("deleteNote", async () => {
    const createNote: Note = new Note();
    let findOneIncidentStub: any;
    beforeEach(() => {
      req.params.incidentId = faker.datatype.uuid();
      createNote.body = faker.address.streetAddress();
      createNote.save = sinon.stub().resolves();
      findOneIncidentStub = sinon.stub(Incident, "findOne");
    });

    it("should not delete a note when incidentId is not valid", async function () {
      const expected = {
        message: "Invalid incident ID.",
        statusCode: 400,
      };
      findOneIncidentStub.resolves();

      const response: any = await deleteNote(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.message).to.equal(expected.message);
    });

    it("should not delete a note when noteId is invalid", async function () {
      const expected = {
        message: "Invalid note ID.",
        statusCode: 400,
      };
      const findIncident = new Incident();
      findIncident.assigneeId = req.user;
      findOneIncidentStub.resolves(findIncident);
      const findOneNoteStub = sinon.stub(Note, "findOne").resolves();

      const response: any = await deleteNote(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.message).to.equal(expected.message);
      findOneNoteStub.restore();
    });

    it("should not delete a note when note is not created by same user", async function () {
      const expected = {
        message: "Access is denied.",
        statusCode: 401,
      };
      const findIncident = new Incident();
      findIncident.assigneeId = req.user;
      findOneIncidentStub.resolves(findIncident);
      const findNote = new Note();
      const findOneNoteStub = sinon.stub(Note, "findOne").resolves(findNote);

      const response: any = await deleteNote(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.message).to.equal(expected.message);
      findOneNoteStub.restore();
    });

    it("should delete a note when input is valid", async function () {
      const expected = {
        statusCode: 204,
      };
      const findIncident = new Incident();
      findIncident.assigneeId = req.user;
      findIncident.createdById = req.user;
      findOneIncidentStub.resolves(findIncident);
      const findNote = new Note();
      findNote.authorId = req.user;
      findNote.remove = sinon.stub().resolves();
      const findOneNoteStub = sinon.stub(Note, "findOne").resolves(findNote);

      const response: any = await deleteNote(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      findOneNoteStub.restore();
    });

    afterEach(() => {
      req.clean();
      res.clean();
      findOneIncidentStub.restore();
    });
  });

  describe("updateNote", async () => {
    const editNote: Note = new Note();
    let findOneIncidentStub: any;
    beforeEach(() => {
      req.params.incidentId = faker.datatype.uuid();
      req.params.noteId = faker.datatype.uuid();
      editNote.body = faker.address.streetAddress();
      editNote.save = sinon.stub().resolves();
      findOneIncidentStub = sinon.stub(Incident, "findOne");
    });

    it("should not update a note when body is not be empty", async function () {
      const expected = {
        message: "Note body field must not be empty.",
        statusCode: 400,
      };

      const response: any = await updateNote(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.message).to.equal(expected.message);
    });

    it("should not update a note when noteId is invalid", async function () {
      const expected = {
        message: "Invalid note ID.",
        statusCode: 400,
      };
      req.body.body = editNote.body;
      const findIncident = new Incident();
      findIncident.assigneeId = req.user;
      findOneIncidentStub.resolves(findIncident);
      const findOneNoteStub = sinon.stub(Note, "findOne").resolves();

      const response: any = await updateNote(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.message).to.equal(expected.message);
      findOneNoteStub.restore();
    });

    it("should not update a note when note is not created by same user", async function () {
      const expected = {
        message: "Access is denied.",
        statusCode: 401,
      };
      req.body.body = editNote.body;
      const findIncident = new Incident();
      findIncident.assigneeId = req.user;
      findOneIncidentStub.resolves(findIncident);
      const findNote = new Note();
      const findOneNoteStub = sinon.stub(Note, "findOne").resolves(findNote);

      const response: any = await updateNote(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      expect(response.data.message).to.equal(expected.message);
      findOneNoteStub.restore();
    });

    it("should update a note when input is valid", async function () {
      const expected = {
        data: note,
        statusCode: 201,
      };
      req.body.body = editNote.body;
      const findIncident = new Incident();
      findIncident.assigneeId = req.user;
      findOneIncidentStub.resolves(findIncident);
      editNote.authorId = req.user;
      const findOneNoteStub = sinon.stub(Note, "findOne").resolves(editNote);

      const response: any = await updateNote(req, res);
      expect(response.statusCode).to.equal(expected.statusCode);
      findOneNoteStub.restore();
    });

    afterEach(() => {
      req.clean();
      res.clean();
      findOneIncidentStub.restore();
    });
  });
});
