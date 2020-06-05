import { createStubInstance, createSandbox, SinonSandbox } from 'sinon'
import { expect } from 'chai';
import * as typeorm from 'typeorm'
import * as assert from 'assert'
import * as sinon from 'sinon'
import * as necessityData from '../testData/necessityData.json'
import { mockRequest, mockResponse } from 'mock-req-res'

import NecessityController  from '../../src/controller/NecessityController'
import { Necessity } from '../../src/entity/Necessity'
import { NecessityType } from '../../src/entity/NecessityType';
import { Category } from '../../src/entity/Category';

describe('NecessityController', () => {

  let sandbox: SinonSandbox
  let necessityType: NecessityType
  let category: Category
  let aNecessity: Necessity

  beforeEach(() => {
    sandbox = createSandbox()

    necessityType = new NecessityType();
    necessityType.name = "dummyType";
    necessityType.categories = [];
    
    category = new Category();
    category.name = "dummyCategory";

    aNecessity = new Necessity();
    aNecessity.id = necessityData.id;
    aNecessity.name = necessityData.name;
    aNecessity.type = necessityType;
    aNecessity.description = necessityData.description;
    aNecessity.category = category;
    aNecessity.location = { type: "marker", coordinates: [-31223213, 12352353] }
  })

  afterEach(() => {
    sandbox.restore()
    sinon.restore()
  })

  it('when all necessities are requested, the controller returns all the necessities from the database', async () => {

    const necessitiesArray: typeorm.BaseEntity[] = [aNecessity]
    
    sinon.stub(Necessity, 'find').resolves(necessitiesArray)
    const necessityController = new NecessityController()

    const getAllRequest = mockRequest()
    const getAllResponse = mockResponse()

    await necessityController.getAll(getAllRequest, getAllResponse)

    assert(getAllResponse.send.calledWith(necessitiesArray))
  })

  it('when a new necessity is requested, the controller saves the necessity into the database', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)

    sinon.stub(NecessityType, 'findByName').resolves(necessityType)
    sinon.stub(Category, 'findByName').resolves(category)

    sinon.stub(Necessity, 'save').resolves()

    const necessityController = new NecessityController()

    const createRequest = mockRequest({ body: necessityData })
    const createResponse = mockResponse()

    await necessityController.create(createRequest, createResponse)

    assert(createResponse.status.calledWith(201))
  })

  it('when a necessity is requested, the controller returns the necessity', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)

    const necessityController = new NecessityController()

    sinon.stub(Necessity, 'findOneOrFail').resolves(aNecessity)

    const getRequest = mockRequest()
    const getResponse = mockResponse({ body: necessityData })

    await necessityController.get(getRequest, getResponse)

    assert(getResponse.send.calledWith(aNecessity))
  })

  it('when a necessity is requested to update its name, the controller updates the necessity with the new name', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)

    sinon.stub(Category, 'findByName').resolves(undefined)

    const necessityController = new NecessityController()

    sinon.stub(Necessity, 'findOne').resolves(aNecessity)
    const updateStub = sinon.stub(Necessity, 'update')
    updateStub.resolves()

    const newDataToUpdate = { name: 'NewName' }
    const updateRequest = mockRequest({ body: newDataToUpdate, params: { id: 1 } })
    const updateResponse = mockResponse()

    await necessityController.update(updateRequest, updateResponse)

    assert(updateStub.calledWith(aNecessity.id, updateRequest.body))
  })

  it('when a necessity is requested to update its name and its category, the controller updates the necessity with the new name and the new category', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)

    sinon.stub(Category, "findByName").resolves(category)
    sinon.stub(NecessityController.prototype, 'handleCategoryUpdate').resolves()

    const necessityController = new NecessityController()

    sinon.stub(Necessity, 'findOne').resolves(aNecessity)
    const updateStub = sinon.stub(Necessity, 'update')
    updateStub.resolves()

    const newDataToUpdate = { name: 'NewName', category: "dummyCategory" }
    const updateRequest = mockRequest({ body: newDataToUpdate, params: { id: 1 } })
    const updateResponse = mockResponse()

    await necessityController.update(updateRequest, updateResponse)

    assert(updateStub.calledWith(aNecessity.id, updateRequest.body))
  })

  it('when a delete of a necessity is requested, the controller deletes the necessity successfully', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)

    const necessityController = new NecessityController()

    const deleteStub = sinon.stub(Necessity, 'delete')
    deleteStub.resolves()

    const deleteRequest = mockRequest({ params: { id: 1 } })
    const deleteResponse = mockResponse({ body: { message: 'Necessity deleted successfully!' } })

    await necessityController.delete(deleteRequest, deleteResponse)

    assert(deleteStub.calledWith(aNecessity.id))
    assert(deleteResponse.status.calledWith(200))
  })
})