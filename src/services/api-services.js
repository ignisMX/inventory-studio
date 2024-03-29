import request from './api';
import itemServices from './item-api-services';
import inputServices from './input-api-service';
import reportServices from './report-api-service';
import outputServices from './output-api-service';
import warehouseServices from './warehouse-api-service';
import salesReturnServices from './sales-return-api-service';
import purchaseReturnServices from './purchase-return-api-service';
import { replaceParams, isInputDocument, isOutputDocument, isDispatchDocument } from '@utils';

const findDispatchDocumentById = async (type, id) => {
    const response = isOutputDocument(type)
        ? await outputServices.findDispatchOutputDocumentById(id)
        : await purchaseReturnServices.findDispatchPurchaseReturnDocumentById(id);

    return response;
};

const findAllDispatchDocumentByPage = async (type, page) => {
    const response = isOutputDocument(type)
        ? await outputServices.findAllDispatchOutputDocumentByPage(page)
        : await purchaseReturnServices.findAllDispatchPurchaseReturnDocumentByPage(page);

    return response;
};

const findAllDispatchDocumentAsPage = async (type) => {
    const response = isOutputDocument(type)
        ? await outputServices.findAllDispatchOutputDocumentAsPage()
        : await purchaseReturnServices.findAllDispatchPurchaseReturnDocumentAsPage();

    return response;
};

const findDispatchDetailReadingBarcode = async (warehouse, barcode) => {
    const endpoint = process.env.NEXT_PUBLIC_RECEPTIONS_READ_BARCODE;
    const params = {
        barcode,
        warehouse,
        format: 'CODE128',
    };
    const url = replaceParams(endpoint, params);
    const response = await request.apiGet(url);

    return response;
};

const findDispatchDocumentByFilter = async (type, filter) => {
    const response = isOutputDocument(type)
        ? await outputServices.findDispatchOutputDocumentByFilter(filter)
        : await purchaseReturnServices.findDispatchPurchaseReturnDocumentByFilter(filter);

    return response;
};

const postDispatchDocument = async (document) => {
    const response = isOutputDocument(document.type)
        ? await outputServices.postDispatchOutputDocument(document)
        : await purchaseReturnServices.postDispatchPurchaseReturnDocument(document);

    return response;
};

const putDispatchDocument = async (document) => {
    const response = isOutputDocument(document.type)
        ? await outputServices.putDispatchOutputDocument(document)
        : await purchaseReturnServices.putDispatchPurchaseReturnDocument(document);

    return response;
};

const releaseDispatchDocument = async (document) => {
    const response = isOutputDocument(document.type)
        ? await outputServices.releaseDispatchOutputDocument(document.id)
        : await purchaseReturnServices.releaseDispatchPurchaseReturnDocument(document.id);

    return response;
};

const deleteDispatchDocument = async (document) => {
    const response = isOutputDocument(document.type)
        ? await outputServices.deleteDispatchOutputDocument(document.id)
        : await purchaseReturnServices.deleteDispatchPurchaseReturnDocument(document.id);

    return response;
};

const findAllItemsAsOption = async (type, warehouse) => {
    const response = isDispatchDocument(type)
        ? await itemServices.findAllItemsAsOptionForDistpatchDocument(warehouse)
        : await itemServices.findAllItemsAsOptionForReceptionDocument();

    return response;
};

//Reception

const findReceptionDocumentById = async (type, id) => {
    const response = isInputDocument(type)
        ? await inputServices.findReceptionInputDocumentById(id)
        : await salesReturnServices.findReceptionSalesReturnDocumentById(id);

    return response;
};

const findAllReceptionDocumentByPage = async (type, page) => {
    const response = isInputDocument(type)
        ? await inputServices.findAllReceptionInputDocumentByPage(page)
        : await salesReturnServices.findAllReceptionSalesReturnDocumentByPage(page);

    return response;
};

const findAllReceptionDocumentAsPage = async (type) => {
    const response = isInputDocument(type)
        ? await inputServices.findAllReceptionInputDocumentAsPage()
        : await salesReturnServices.findAllReceptionSalesReturnDocumentAsPage();

    return response;
};

const findReceptionDocumentByFilter = async (type, filter) => {
    const response = isInputDocument(type)
        ? await inputServices.findReceptionInputDocumentByFilter(filter)
        : await salesReturnServices.findReceptionSalesReturnDocumentByFilter(filter);

    return response;
};

const postReceptionDocument = async (document) => {
    const response = isInputDocument(document.type)
        ? await inputServices.postReceptionInputDocument(document)
        : await salesReturnServices.postReceptionSalesReturnDocument(document);

    return response;
};

const putReceptionDocument = async (document) => {
    const response = isInputDocument(document.type)
        ? await inputServices.putReceptionInputDocument(document)
        : await salesReturnServices.putReceptionSalesReturnDocument(document);

    return response;
};

const releaseReceptionDocument = async (document) => {
    const response = isInputDocument(document.type)
        ? await inputServices.releaseReceptionInputDocument(document.id)
        : await salesReturnServices.releaseReceptionSalesReturnDocument(document.id);

    return response;
};

const deleteReceptionDocument = async (document) => {
    const response = isInputDocument(document.type)
        ? await inputServices.deleteReceptionInputDocument(document.id)
        : await salesReturnServices.deleteReceptionSalesReturnDocument(document.id);

    return response;
};

const services = {
    putDispatchDocument,
    postDispatchDocument,
    putReceptionDocument,
    findAllItemsAsOption,
    postReceptionDocument,
    deleteDispatchDocument,
    deleteReceptionDocument,
    releaseDispatchDocument,
    findDispatchDocumentById,
    releaseReceptionDocument,
    findReceptionDocumentById,
    findDispatchDocumentByFilter,
    putItem: itemServices.putItem,
    findReceptionDocumentByFilter,
    findAllDispatchDocumentAsPage,
    findAllDispatchDocumentByPage,
    findAllReceptionDocumentAsPage,
    findAllReceptionDocumentByPage,
    postItem: itemServices.postItem,
    findDispatchDetailReadingBarcode,
    deleteItem: itemServices.deleteItem,
    findItemById: itemServices.findItemById,
    putWarehouse: warehouseServices.putWarehouse,
    postWarehouse: warehouseServices.postWarehouse,
    findItemsByFilter: itemServices.findItemsByFilter,
    deleteWarehouse: warehouseServices.deleteWarehouse,
    postBarcodeReport: reportServices.postBarcodeReport,
    findAllItemsByPage: itemServices.findAllItemsByPage,
    findAllItemsAsPage: itemServices.findAllItemsAsPage,
    findWarehouseById: warehouseServices.findWarehouseById,
    findWarehousesByFilter: warehouseServices.findWarehousesByFilter,
    findAllWarehousesByPage: warehouseServices.findAllWarehousesByPage,
    findAllWarehousesAsPage: warehouseServices.findAllWarehousesAsPage,
    findAllWarehousesAsOption: warehouseServices.findAllWarehousesAsOption,
    findAllItemSummaryByIdAsPage: warehouseServices.findAllItemSummaryByIdAsPage,
    findAllItemSummaryByIdByPage: warehouseServices.findAllItemSummaryByIdByPage,
};

export default services;
