import { createStubInstance, createSandbox, SinonSandbox } from 'sinon'
import { expect } from 'chai';
import * as typeorm from 'typeorm'
import * as assert from 'assert'
import * as sinon from 'sinon'
import { mockRequest, mockResponse } from 'mock-req-res'

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
      categories: [category]
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

  it('when a new necessity type is requested with categories, the controller saves the necessity type into the database', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)

    sinon.stub(NecessityTypeController.prototype, 'addCategoriesToNecessityType').resolves()

    sinon.stub(NecessityType, 'save').resolves()

    const necessityTypeController = new NecessityTypeController()

    const createRequest = mockRequest({ body: necessityTypeData })
    const createResponse = mockResponse()

    await necessityTypeController.create(createRequest, createResponse)

    assert(createResponse.status.calledWith(201))
  })

  it('when a necessity type is requested, the controller returns the necessity type', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)

    const necessityTypeController = new NecessityTypeController()

    sinon.stub(NecessityType, 'findOneOrFail').resolves(necessityType)

    const getRequest = mockRequest()
    const getResponse = mockResponse()

    await necessityTypeController.get(getRequest, getResponse)

    assert(getResponse.send.calledWith(necessityType))
  })

  it('when a necessity type is requested to update its name and its category, the controller updates the necessity type with the new name and the new category', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)

    sinon.stub(Category, "findByName").resolves(category)

    sinon.stub(NecessityTypeController.prototype, 'addCategoryToNecessityTypeCategories').resolves()

    const necessityTypeController = new NecessityTypeController()

    sinon.stub(NecessityType, 'findOneOrFail').resolves(necessityType)
    sinon.stub(necessityType, 'save').resolves()

    const newDataToUpdate = { name: 'NewName', category: "dummyCategory" }
    const updateRequest = mockRequest({ body: newDataToUpdate, params: { id: 1 } })
    const updateResponse = mockResponse()

    await necessityTypeController.update(updateRequest, updateResponse)

    assert(updateResponse.status.calledWith(204))
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
})