import { createStubInstance, createSandbox, SinonSandbox } from 'sinon'
import { expect } from 'chai';
import * as typeorm from 'typeorm'
import * as assert from 'assert'
import * as sinon from 'sinon'
import * as necessityData from '../testData/necessityData.json'
import { mockRequest, mockResponse } from 'mock-req-res'

import NecessityController  from '../../src/controller/NecessityController'
import { Necessity } from '../../src/entity/Necessity'

describe('NecessityController', () => {

  let sandbox: SinonSandbox

  beforeEach(() => {
    sandbox = createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('when all necessities are requested, the controller returns all the necessities from the database', async () => {
    const necessitiesArray: typeorm.BaseEntity[] = [new Necessity(necessityData.name, necessityData.mappingName, necessityData.type, necessityData.address, necessityData.addressNumber, necessityData.geolocationAddress, necessityData.phone, necessityData.website, necessityData.postalCode, undefined)]
    
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

    const newNecessity: Necessity = new Necessity(necessityData.name, necessityData.mappingName, necessityData.type, necessityData.address, necessityData.addressNumber, necessityData.geolocationAddress, necessityData.phone, necessityData.website, necessityData.postalCode, undefined)

    const necessityController = new NecessityController()

    sinon.stub(Necessity, 'save').resolves()

    const createRequest = mockRequest({ body: necessityData })
    const createResponse = mockResponse()

    await necessityController.create(createRequest, createResponse)

    assert(createResponse.send.calledWith(newNecessity))
  })

  it('when a necessity is requested, the controller returns the necessity', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)

    const aNecessity: Necessity = new Necessity(necessityData.name, necessityData.mappingName, necessityData.type, necessityData.address, necessityData.addressNumber, necessityData.geolocationAddress, necessityData.phone, necessityData.website, necessityData.postalCode, undefined)

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

    const aNecessity: Necessity = new Necessity(necessityData.name, necessityData.mappingName, necessityData.type, necessityData.address, necessityData.addressNumber, necessityData.geolocationAddress, necessityData.phone, necessityData.website, necessityData.postalCode, undefined)

    aNecessity.id = 1

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

  it('when a delete of a necessity is requested, the controller deletes the necessity successfully', async () => {
    const fakeConnection = createStubInstance(typeorm.Connection)

    sandbox.stub(typeorm, 'getConnection').returns(fakeConnection as any)

    const aNecessity: Necessity = new Necessity(necessityData.name, necessityData.mappingName, necessityData.type, necessityData.address, necessityData.addressNumber, necessityData.geolocationAddress, necessityData.phone, necessityData.website, necessityData.postalCode, undefined)

    aNecessity.id = 1

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