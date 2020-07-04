import { createStubInstance, createSandbox, SinonSandbox } from 'sinon'
import * as typeorm from 'typeorm'
import * as assert from 'assert'
import * as sinon from 'sinon'
import * as necessityData from '../testData/necessityData.json'
import * as necessityDataWithError from '../testData/necessityDataWithError.json'
import { mockRequest, mockResponse } from 'mock-req-res'
import * as classValidator from "class-validator";

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
    aNecessity.location = { type: "marker", coordinates: [-31223213, 12352353], properties: {} }
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

  it('when all necessities by category are requested, the controller returns all the necessities by category from the database', async () => {

    const necessitiesArray: typeorm.BaseEntity[] = [aNecessity]

    sinon.stub(Category, 'findByName').resolves(category)
    
    sinon.stub(Necessity, 'find').resolves(necessitiesArray)
    const necessityController = new NecessityController()

    const getAllRequest = mockRequest()
    const getAllResponse = mockResponse()

    await necessityController.getAllByCategory(getAllRequest, getAllResponse)

    assert(getAllResponse.send.calledWith(necessitiesArray))
  })

  it('when all necessities by type are requested, the controller returns all the necessities by type from the database', async () => {

    const necessitiesArray: typeorm.BaseEntity[] = [aNecessity]

    sinon.stub(NecessityType, 'findByName').resolves(necessityType)
    
    sinon.stub(Necessity, 'find').resolves(necessitiesArray)
    const necessityController = new NecessityController()

    const getAllRequest = mockRequest()
    const getAllResponse = mockResponse()

    await necessityController.getAllByNecessityType(getAllRequest, getAllResponse)

    assert(getAllResponse.send.calledWith(necessitiesArray))
  })

  it('when all necessities are requested, an error is thrown and the controller returns an error', async () => {

    const anError = new Error('dummy error');
    const expectedErrorResponse = { message: 'Ha ocurrido un error al obtener todas las necesidades', error: anError.message }
    
    sinon.stub(Necessity, 'find').throws(anError)
    const necessityController = new NecessityController()

    const getAllRequest = mockRequest()
    const getAllResponse = mockResponse()

    await necessityController.getAll(getAllRequest, getAllResponse)

    assert(getAllResponse.status.calledWith(500))
    assert(getAllResponse.send.calledWith(expectedErrorResponse))
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

  it('when a new necessity is requested, an error is thrown and the controller returns an error', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)

    const thrownError = new Error('dummy error')
    const expectedErrorResponse = { message: 'Ha ocurrido un error al crear una necesidad', error: thrownError.message }

    sinon.stub(NecessityType, 'findByName').resolves(necessityType)
    sinon.stub(Category, 'findByName').resolves(category)

    sinon.stub(Necessity, 'save').throws(thrownError)

    const necessityController = new NecessityController()

    const createRequest = mockRequest({ body: necessityData })
    const createResponse = mockResponse()

    await necessityController.create(createRequest, createResponse)

    assert(createResponse.status.calledWith(500))
    assert(createResponse.send.calledWith(expectedErrorResponse))
  })

  it('when a new necessity is requested and the location object is empty, an error is thrown and the controller returns an error', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)

    const errors = [new classValidator.ValidationError()]

    sinon.stub(classValidator, 'validate').resolves(errors)

    sinon.stub(NecessityType, 'findByName').resolves(necessityType)
    sinon.stub(Category, 'findByName').resolves(category)

    sinon.stub(Necessity, 'save').resolves()

    const necessityController = new NecessityController()

    const createRequest = mockRequest({ body: necessityDataWithError })
    const createResponse = mockResponse()

    await necessityController.create(createRequest, createResponse)

    assert(createResponse.status.calledWith(400))
    assert(createResponse.send.calledWith(errors))
  })

  it('when a necessity is requested, the controller returns the necessity', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)

    const necessityController = new NecessityController()

    sinon.stub(Necessity, 'findOne').resolves(aNecessity)

    const getRequest = mockRequest()
    const getResponse = mockResponse({ body: necessityData })

    await necessityController.get(getRequest, getResponse)

    assert(getResponse.send.calledWith(aNecessity))
  })

  it('when a necessity is requested, a not found error is thrown and the controller returns an error', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)

    const expectedErrorResponse = { message: 'La necesidad solicitada no existe'}

    const necessityController = new NecessityController()

    sinon.stub(Necessity, 'findOne').resolves(undefined)

    const getRequest = mockRequest()
    const getResponse = mockResponse({ body: necessityData })

    await necessityController.get(getRequest, getResponse)

    assert(getResponse.status.calledWith(404))
    assert(getResponse.send.calledWith(expectedErrorResponse))
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

    sinon.stub(Necessity, 'save').resolves()

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

  it('when a necessity is requested to update its name and its category, and the category is not found, a not found error is thrown and the controller returns an error', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)

    sinon.stub(Necessity, 'findOne').resolves(aNecessity)

    const expectedErrorResponse = { message: 'La categoría solicitada no fue encontrada'}

    sinon.stub(Category, "findByName").resolves(undefined)

    const necessityController = new NecessityController()
    const newDataToUpdate = { name: 'NewName', category: "dummyCategory" }
    const updateRequest = mockRequest({ body: newDataToUpdate, params: { id: 1 } })
    const updateResponse = mockResponse()

    await necessityController.update(updateRequest, updateResponse)

    assert(updateResponse.status.calledWith(404))
    assert(updateResponse.send.calledWith(expectedErrorResponse))
  })

  it('when a necessity is requested to update its name and its category, and the necessity to return is not found, a not found error is thrown and the controller returns an error', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)
    
    const expectedErrorResponse = { message: 'No se encontró la necesidad'}

    sinon.stub(Necessity, 'findOne').resolves(undefined)

    sinon.stub(Category, "findByName").resolves(category)
    sinon.stub(NecessityController.prototype, 'handleCategoryUpdate').resolves()

    sinon.stub(Necessity, 'save').resolves()

    const updateStub = sinon.stub(Necessity, 'update')
    updateStub.resolves()

    const necessityController = new NecessityController()
    const newDataToUpdate = { name: 'NewName', category: "dummyCategory" }
    const updateRequest = mockRequest({ body: newDataToUpdate, params: { id: 1 } })
    const updateResponse = mockResponse()

    await necessityController.update(updateRequest, updateResponse)

    assert(updateResponse.status.calledWith(404))
    assert(updateResponse.send.calledWith(expectedErrorResponse))
  })

  it('when a delete of a necessity is requested, the controller deletes the necessity successfully', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)

    const necessityController = new NecessityController()

    const deleteStub = sinon.stub(Necessity, 'delete')
    deleteStub.resolves()

    const deleteRequest = mockRequest({ params: { id: 1 } })
    const deleteResponse = mockResponse({ body: { message: 'Necesidad borrada con éxito' } })

    await necessityController.delete(deleteRequest, deleteResponse)

    assert(deleteStub.calledWith(aNecessity.id))
    assert(deleteResponse.status.calledWith(200))
  })

  it('when a delete of a necessity is requested, an error is thrown and the controller returns an error', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)

    const thrownError = new Error('delete error')
    const expectedErrorResponse = { message: 'Ha ocurrido un error al intentar borrar la necesidad', error: thrownError.message }

    const necessityController = new NecessityController()

    const deleteStub = sinon.stub(Necessity, 'delete')
    deleteStub.throws(thrownError)

    const deleteRequest = mockRequest({ params: { id: 1 } })
    const deleteResponse = mockResponse({ body: expectedErrorResponse })

    await necessityController.delete(deleteRequest, deleteResponse)

    assert(deleteResponse.status.calledWith(500))
    assert(deleteResponse.send.calledWith(expectedErrorResponse))
  })
})