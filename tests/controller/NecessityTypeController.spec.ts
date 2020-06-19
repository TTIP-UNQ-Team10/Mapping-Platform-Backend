import { createStubInstance, createSandbox, SinonSandbox } from 'sinon'
import { expect } from 'chai';
import * as typeorm from 'typeorm'
import * as assert from 'assert'
import * as sinon from 'sinon'
import { mockRequest, mockResponse } from 'mock-req-res'
import * as classValidator from "class-validator";

import NecessityTypeController  from '../../src/controller/NecessityTypeController'
import { Necessity } from '../../src/entity/Necessity'
import { NecessityType } from '../../src/entity/NecessityType';
import { Category } from '../../src/entity/Category';

describe('NecessityTypeController', () => {

  let sandbox: SinonSandbox
  let necessityType: NecessityType
  let category: Category
  let necessityTypeData;

  beforeEach(() => {
    sandbox = createSandbox()
    
    category = new Category();
    category.name = "dummyCategory";

    necessityType = new NecessityType();
    necessityType.id = 1;
    necessityType.name = "dummyType";
    necessityType.categories = [category];

    necessityTypeData = {
      name: "dummyType",
      categories: [category.name]
    }
  })

  afterEach(() => {
    sandbox.restore()
    sinon.restore()
  })

  it('when all necessity types are requested, the controller returns all the necessity types from the database', async () => {

    const necessityTypesArray: typeorm.BaseEntity[] = [necessityType]
    
    sinon.stub(NecessityType, 'find').resolves(necessityTypesArray)
    const necessityTypeController = new NecessityTypeController()

    const getAllRequest = mockRequest()
    const getAllResponse = mockResponse()

    await necessityTypeController.getAll(getAllRequest, getAllResponse)

    assert(getAllResponse.send.calledWith(necessityTypesArray))
  })

  it('when all necessity types are requested, an error is thrown and the controller returns an HTTP 500 error', async () => {

    const error = new Error('getAll error')
    const expectedErrorMessage = { message: 'An error occurred when trying to retrieve all the necessity types', error: error.message }
    
    sinon.stub(NecessityType, 'find').throws(error)
    const necessityTypeController = new NecessityTypeController()

    const getAllRequest = mockRequest()
    const getAllResponse = mockResponse()

    await necessityTypeController.getAll(getAllRequest, getAllResponse)

    assert(getAllResponse.status.calledWith(500))
    assert(getAllResponse.send.calledWith(expectedErrorMessage))
  })

  it('when a new necessity type is requested with categories, the controller saves the necessity type into the database', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)

    sinon.stub(Category, "findByName").resolves(category)

    sinon.stub(NecessityType, 'save').resolves()

    const necessityTypeController = new NecessityTypeController()

    const createRequest = mockRequest({ body: necessityTypeData })
    const createResponse = mockResponse()

    await necessityTypeController.create(createRequest, createResponse)

    assert(createResponse.status.calledWith(201))
  })

  it('when a new necessity type is requested with categories, an error is thrown and the controller throws an HTTP 500 error', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)

    sinon.stub(Category, "findByName").resolves(category)

    sinon.stub(NecessityType, 'save').throws(new Error('save error'))

    const necessityTypeController = new NecessityTypeController()

    const createRequest = mockRequest({ body: necessityTypeData })
    const createResponse = mockResponse()

    await necessityTypeController.create(createRequest, createResponse)

    assert(createResponse.status.calledWith(500))
  })

  it('when a necessity type is requested, the controller returns the necessity type', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)

    const necessityTypeController = new NecessityTypeController()

    sinon.stub(NecessityType, 'findOne').resolves(necessityType)

    const getRequest = mockRequest()
    const getResponse = mockResponse()

    await necessityTypeController.get(getRequest, getResponse)

    assert(getResponse.send.calledWith(necessityType))
  })

  it('when a necessity type is requested, the necessity type is not found and the controller returns an HTTP 404 not found error', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)

    const necessityTypeController = new NecessityTypeController()

    const expectedResponse = { message: 'Requested necessity type does not exist'}

    sinon.stub(NecessityType, 'findOne').resolves(undefined)

    const getRequest = mockRequest()
    const getResponse = mockResponse()

    await necessityTypeController.get(getRequest, getResponse)

    assert(getResponse.status.calledWith(404))
    assert(getResponse.send.calledWith(expectedResponse))
  })

  it('when a necessity type is requested to update its name and its category, the controller updates the necessity type with the new name and the new category', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)

    sinon.stub(Category, "findByName").resolves(category)

    const necessityTypeController = new NecessityTypeController()

    sinon.stub(NecessityType, 'findOneOrFail').resolves(necessityType)
    sinon.stub(necessityType, 'save').resolves()

    const newDataToUpdate = { name: 'NewName', category: "dummyCategory" }
    const updateRequest = mockRequest({ body: newDataToUpdate, params: { id: 1 } })
    const updateResponse = mockResponse()

    await necessityTypeController.update(updateRequest, updateResponse)

    assert(updateResponse.status.calledWith(204))
  })

  it('when a necessity type is requested to update its name and its category, the necessity type to update is not found and the controller returns an HTTP 404 not found error', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)

    const necessityTypeController = new NecessityTypeController()

    const error = new Error('necessity type not found')
    const expectedResponse = { message: "Necessity type not found" }

    sinon.stub(NecessityType, 'findOneOrFail').throws(error)

    const newDataToUpdate = { name: 'NewName', category: "dummyCategory" }
    const updateRequest = mockRequest({ body: newDataToUpdate, params: { id: 1 } })
    const updateResponse = mockResponse()

    await necessityTypeController.update(updateRequest, updateResponse)

    assert(updateResponse.status.calledWith(404))
    assert(updateResponse.send.calledWith(expectedResponse))
  })

  it('when a necessity type is requested to update its name and its category, a bad request was sent and the controller returns an HTTP 400 bad request error', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)

    sinon.stub(Category, "findByName").resolves(category)

    const necessityTypeController = new NecessityTypeController()

    sinon.stub(NecessityType, 'findOneOrFail').resolves(necessityType)

    const errors = [new classValidator.ValidationError()]

    sinon.stub(classValidator, 'validate').resolves(errors)

    const newDataToUpdate = { name: 'NewName', category: "dummyCategory" }
    const updateRequest = mockRequest({ body: newDataToUpdate, params: { id: 1 } })
    const updateResponse = mockResponse()

    await necessityTypeController.update(updateRequest, updateResponse)

    assert(updateResponse.status.calledWith(400))
    assert(updateResponse.send.calledWith(errors))
  })

  it('when a delete of a necessity type is requested, the controller deletes the necessity type successfully', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)

    const necessityTypeController = new NecessityTypeController()

    const deleteStub = sinon.stub(NecessityType, 'delete')
    deleteStub.resolves()

    const deleteRequest = mockRequest({ params: { id: 1 } })
    const deleteResponse = mockResponse({ body: { message: 'Necessity type deleted successfully!' } })

    await necessityTypeController.delete(deleteRequest, deleteResponse)

    assert(deleteStub.calledWith(necessityType.id))
    assert(deleteResponse.status.calledWith(200))
  })

  it('when a delete of a necessity type is requested, an error is thrown and the controller returns an HTTP 500 error', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)

    const necessityTypeController = new NecessityTypeController()

    const error = new Error('delete error')
    const expectedResponse = { message: "An error occurred while trying to delete the necessity type", error: error.message }

    sinon.stub(NecessityType, 'delete').throws(error)

    const deleteRequest = mockRequest({ params: { id: 1 } })
    const deleteResponse = mockResponse({ body: expectedResponse })

    await necessityTypeController.delete(deleteRequest, deleteResponse)

    assert(deleteResponse.status.calledWith(500))
    assert(deleteResponse.send.calledWith(expectedResponse))
  })
})