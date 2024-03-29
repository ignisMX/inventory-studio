import _ from 'lodash';
import { stringToDate } from '@utils';
import { renderHook, act } from '@testing-library/react';
import { useRowData, useDetail, useDocumentForm } from '@hooks/useFormState';
import {
    DOCUMENT_TYPES,
    inputDocumentState,
    outputDocumentState,
    purchaseReturnDocumentState,
} from '@constants';

describe('useFormState', () => {
    describe('useDocumentForm', () => {
        describe('dispatch document', () => {
            const warehouse = {
                id: 1,
                warehouseName: 'warehouse one',
                itemSummary: [],
                locked: false,
                deleted: false,
            };

            const detailOne = {
                id: 1,
                lineNumber: 1,
                item: {
                    id: 1,
                    itemName: 'item one',
                    description: 'item description one',
                    valuationType: 'AVERAGE',
                    locked: false,
                },
                description: 'detail item one',
                quantity: 5,
                unitPrice: 10,
                totalPrice: 50,
                deleted: false,
            };

            const detailTwo = {
                id: 2,
                lineNumber: 2,
                item: {
                    id: 2,
                    itemName: 'item two',
                    description: 'item description two',
                    valuationType: 'AVERAGE',
                    locked: false,
                },
                description: 'detail item two',
                quantity: 2,
                unitPrice: 25,
                totalPrice: 50,
                deleted: false,
            };

            const initialDocument = {
                id: 'OU0000000001',
                type: 'OUTPUT',
                date: new Date(),
                status: 'OPEN',
                warehouse: warehouse,
                description: 'output document one',
                totalQuantity: 10,
                totalAmount: 100,
                counter: 2,
                deleted: false,
                details: [detailOne, detailTwo],
            };

            it('should be able to init the hook with default initial state value for output document', () => {
                const { result } = renderHook(useDocumentForm, {
                    initialProps: {
                        initialState: undefined,
                        defaultInitialState: outputDocumentState,
                    },
                });

                expect(result.current.documentEdited).toBe(false);
                expect(result.current.addButtonDisabled).toBe(true);
                expect(result.current.deleteButtonDisabled).toBe(true);
                expect(result.current.releaseButtonDisabled).toBe(true);
                expect(result.current.document).toEqual(outputDocumentState);
                expect(result.current.documentCopy).toEqual(outputDocumentState);
                expect(result.current.initialDocument).toEqual(outputDocumentState);
            });

            it('should be able to init the hook with initial state value for output document', () => {
                const { result } = renderHook(useDocumentForm, {
                    initialProps: {
                        initialState: _.cloneDeep(initialDocument),
                        defaultInitialState: outputDocumentState,
                    },
                });

                expect(result.current.documentEdited).toBe(false);
                expect(result.current.addButtonDisabled).toBe(false);
                expect(result.current.deleteButtonDisabled).toBe(false);
                expect(result.current.releaseButtonDisabled).toBe(false);
                expect(result.current.document).toEqual(initialDocument);
                expect(result.current.documentCopy).toEqual(initialDocument);
                expect(result.current.initialDocument).toEqual(outputDocumentState);
            });

            it('should be able to update document fields', () => {
                const warehouseUpdated = {
                    id: 10,
                    warehouseName: 'warehouse ten',
                    itemSummary: [],
                    locked: false,
                    deleted: false,
                };

                const { result } = renderHook(useDocumentForm, {
                    initialProps: {
                        initialState: _.cloneDeep(initialDocument),
                        defaultInitialState: outputDocumentState,
                    },
                });

                act(() => {
                    result.current.updateDocumentField('status', 'RELEASED');
                });

                act(() => {
                    result.current.updateDocumentField('description', 'output description changed');
                });

                act(() => {
                    result.current.updateDocumentField('totalQuantity', 20);
                });

                act(() => {
                    result.current.updateDocumentField('totalAmount', 200);
                });

                act(() => {
                    result.current.updateDocumentField('warehouse', warehouseUpdated);
                });

                expect(result.current.document.status).toBe('RELEASED');
                expect(result.current.document.description).toBe('output description changed');
                expect(result.current.document.totalQuantity).toBe(20);
                expect(result.current.document.totalAmount).toBe(200);
                expect(result.current.document.warehouse).toBe(warehouseUpdated);
            });

            it('should be able to add document detail element', () => {
                const detailThree = {
                    id: 3,
                    lineNumber: 3,
                    item: {
                        id: 3,
                        itemName: 'item three',
                        description: 'item description three',
                        valuationType: 'AVERAGE',
                        locked: false,
                    },
                    description: 'detail item three',
                    quantity: 5,
                    unitPrice: 8,
                    totalPrice: 40,
                    deleted: false,
                };

                const { result } = renderHook(useDocumentForm, {
                    initialProps: {
                        initialState: _.cloneDeep(initialDocument),
                        defaultInitialState: outputDocumentState,
                    },
                });

                const details = [...result.current.document.details, detailThree];

                act(() => {
                    result.current.updateDocumentField('details', details);
                });

                expect(result.current.document.details).toEqual(details);
                expect(result.current.document.details.length).toBe(3);
            });

            it('should be able to remove document detail element', () => {
                const { result } = renderHook(useDocumentForm, {
                    initialProps: {
                        initialState: _.cloneDeep(initialDocument),
                        defaultInitialState: outputDocumentState,
                    },
                });

                const details = result.current.document.details.pop();
                act(() => {
                    result.current.updateDocumentField('details', [details]);
                });

                expect(result.current.document.details).toEqual([detailTwo]);
                expect(result.current.document.details.length).toBe(1);
            });

            it('should be able to update document detail element', () => {
                const detailOneUpdated = {
                    ..._.cloneDeep(detailOne),
                    item: {
                        id: 3,
                        itemName: 'item three',
                        description: 'item description three',
                        valuationType: 'AVERAGE',
                        locked: false,
                    },
                    description: 'detail item one updated',
                    quantity: 3,
                    unitPrice: 8,
                    totalPrice: 24,
                };

                const { result } = renderHook(useDocumentForm, {
                    initialProps: {
                        initialState: _.cloneDeep(initialDocument),
                        defaultInitialState: outputDocumentState,
                    },
                });

                const details = [...result.current.document.details];

                details[0] = detailOneUpdated;
                act(() => {
                    result.current.updateDocumentField('details', details);
                });

                expect(result.current.document.details).toEqual([detailOneUpdated, detailTwo]);
                expect(result.current.document.details.length).toBe(2);
            });

            it('should be able to update the document', () => {
                const document = {
                    ..._.cloneDeep(initialDocument),
                    status: 'RELEASED',
                    description: 'output document description one',
                    totalQuantity: 10,
                    totalAmount: 1000,
                    counter: 6,
                    details: [detailOne],
                };

                const { result } = renderHook(useDocumentForm, {
                    initialProps: {
                        initialState: _.cloneDeep(initialDocument),
                        defaultInitialState: outputDocumentState,
                    },
                });

                act(() => {
                    result.current.updateDocument(document);
                });

                expect(result.current.document).toBe(document);
            });

            it('should be able to update document copy', () => {
                const { result } = renderHook(useDocumentForm, {
                    initialProps: {
                        initialState: _.cloneDeep(initialDocument),
                        defaultInitialState: outputDocumentState,
                    },
                });

                act(() => {
                    result.current.updateDocumentCopy(purchaseReturnDocumentState);
                });

                expect(result.current.documentCopy).toBe(purchaseReturnDocumentState);
            });

            it('should be able to clear document', () => {
                const { result } = renderHook(useDocumentForm, {
                    initialProps: {
                        initialState: _.cloneDeep(initialDocument),
                        defaultInitialState: outputDocumentState,
                    },
                });

                act(() => {
                    result.current.updateDocumentField('description', 'output description changed');
                });

                act(() => {
                    result.current.clearDocument();
                });

                expect(result.current.document).toEqual(_.cloneDeep(outputDocumentState));
                expect(result.current.documentCopy).toEqual(_.cloneDeep(outputDocumentState));
            });

            it('should be able to update document when get an updating from service', () => {
                const documentFromService = _.cloneDeep(initialDocument);
                documentFromService.date = '03-07-2023 23:41:50.000';
                const { result } = renderHook(useDocumentForm, {
                    initialProps: {
                        initialState: _.cloneDeep(initialDocument),
                        defaultInitialState: outputDocumentState,
                    },
                });

                act(() => {
                    result.current.updateDocumentFromService(documentFromService);
                });

                const documentResult = stringToDate(_.cloneDeep(documentFromService));
                expect(result.current.document).toEqual(_.cloneDeep(documentResult));
            });

            it('should be able to update initial document', () => {
                const { result } = renderHook(useDocumentForm, {
                    initialProps: {
                        initialState: _.cloneDeep(initialDocument),
                        defaultInitialState: outputDocumentState,
                    },
                });

                let changedType;

                act(() => {
                    changedType = result.current.updateInitialDocument(
                        DOCUMENT_TYPES.PURCHASE_RETURN
                    );
                });

                const expected = _.cloneDeep(purchaseReturnDocumentState);

                expect(changedType).toBe(true);
                expect(result.current.document).toEqual(expected);
                expect(result.current.documentCopy).toEqual(expected);
                expect(result.current.initialDocument).toEqual(expected);
            });

            it('should be able to keep the previous state when the new type is the same than previous than', () => {
                const { result } = renderHook(useDocumentForm, {
                    initialProps: {
                        initialState: _.cloneDeep(initialDocument),
                        defaultInitialState: outputDocumentState,
                    },
                });

                let changedType;

                act(() => {
                    changedType = result.current.updateInitialDocument(DOCUMENT_TYPES.OUTPUT);
                });

                const expected = _.cloneDeep(outputDocumentState);

                expect(changedType).toBe(false);
                expect(result.current.document).toEqual(_.cloneDeep(initialDocument));
                expect(result.current.documentCopy).toEqual(_.cloneDeep(initialDocument));
                expect(result.current.initialDocument).toEqual(expected);
            });

            it('should enable add button', () => {
                const { result } = renderHook(useDocumentForm, {
                    initialProps: {
                        initialState: undefined,
                        defaultInitialState: outputDocumentState,
                    },
                });

                act(() => {
                    result.current.updateDocumentField('warehouse', warehouse);
                });

                expect(result.current.addButtonDisabled).toBe(false);
                expect(result.current.document.warehouse).toEqual(warehouse);
            });

            it('should enable save button', () => {
                const { result } = renderHook(useDocumentForm, {
                    initialProps: {
                        initialState: _.cloneDeep(initialDocument),
                        defaultInitialState: outputDocumentState,
                    },
                });

                act(() => {
                    result.current.updateDocumentField('description', 'output description changed');
                });

                expect(result.current.documentEdited).toBe(true);
            });

            it('should enable delete button', () => {
                const { result } = renderHook(useDocumentForm, {
                    initialProps: {
                        initialState: _.cloneDeep(initialDocument),
                        defaultInitialState: outputDocumentState,
                    },
                });

                expect(result.current.deleteButtonDisabled).toBe(false);
            });

            it('should disable delete button when any field of document is updated', () => {
                const { result } = renderHook(useDocumentForm, {
                    initialProps: {
                        initialState: _.cloneDeep(initialDocument),
                        defaultInitialState: outputDocumentState,
                    },
                });

                act(() => {
                    result.current.updateDocumentField('description', 'output description changed');
                });

                expect(result.current.deleteButtonDisabled).toBe(true);
            });

            it('should disable delete button when document type is changed', () => {
                const { result } = renderHook(useDocumentForm, {
                    initialProps: {
                        initialState: _.cloneDeep(initialDocument),
                        defaultInitialState: outputDocumentState,
                    },
                });

                act(() => {
                    result.current.updateInitialDocument(DOCUMENT_TYPES.PURCHASE_RETURN);
                });

                expect(result.current.deleteButtonDisabled).toBe(true);
            });

            it('should enable release button', () => {
                const { result } = renderHook(useDocumentForm, {
                    initialProps: {
                        initialState: _.cloneDeep(initialDocument),
                        defaultInitialState: outputDocumentState,
                    },
                });

                expect(result.current.releaseButtonDisabled).toBe(false);
            });

            it('should disable release button when any field of document is updated', () => {
                const { result } = renderHook(useDocumentForm, {
                    initialProps: {
                        initialState: _.cloneDeep(initialDocument),
                        defaultInitialState: outputDocumentState,
                    },
                });

                act(() => {
                    result.current.updateDocumentField('description', 'output description changed');
                });

                expect(result.current.releaseButtonDisabled).toBe(true);
            });

            it('should disable release button when document type is changed', () => {
                const { result } = renderHook(useDocumentForm, {
                    initialProps: {
                        initialState: _.cloneDeep(initialDocument),
                        defaultInitialState: outputDocumentState,
                    },
                });

                act(() => {
                    result.current.updateInitialDocument(DOCUMENT_TYPES.PURCHASE_RETURN);
                });

                expect(result.current.releaseButtonDisabled).toBe(true);
            });

            it('should disable release button whe document has zero on totalAmount', () => {
                const document = _.cloneDeep(initialDocument);
                document.totalAmount = 0;
                const { result } = renderHook(useDocumentForm, {
                    initialProps: {
                        initialState: _.cloneDeep(document),
                        defaultInitialState: outputDocumentState,
                    },
                });

                expect(result.current.document.totalAmount).toBe(0);
                expect(result.current.document.totalQuantity).toBe(10);
                expect(result.current.releaseButtonDisabled).toBe(true);
            });

            it('should disable release button whe document has zero on totalQuantity', () => {
                const document = _.cloneDeep(initialDocument);
                document.totalQuantity = 0;
                const { result } = renderHook(useDocumentForm, {
                    initialProps: {
                        initialState: _.cloneDeep(document),
                        defaultInitialState: outputDocumentState,
                    },
                });

                expect(result.current.document.totalAmount).toBe(100);
                expect(result.current.document.totalQuantity).toBe(0);
                expect(result.current.releaseButtonDisabled).toBe(true);
            });
        });
    });

    describe('useDetail', () => {
        const detailOne = {
            id: null,
            lineNumber: 0,
            item: {
                id: 1,
                itemName: 'item one',
                description: 'item description one',
                valuationType: 'AVERAGE',
                locked: false,
            },
            description: 'detail item one',
            quantity: 5,
            unitPrice: 10,
            totalPrice: 50,
            deleted: false,
        };

        const detailTwo = {
            id: null,
            lineNumber: 0,
            item: {
                id: 2,
                itemName: 'item two',
                description: 'item description two',
                valuationType: 'AVERAGE',
                locked: false,
            },
            description: 'detail item two',
            quantity: 3,
            unitPrice: 8,
            totalPrice: 24,
            deleted: false,
        };

        const detailThree = {
            id: null,
            lineNumber: 0,
            item: {
                id: 3,
                itemName: 'item three',
                description: 'item description three',
                valuationType: 'AVERAGE',
                locked: false,
            },
            description: 'detail item three',
            quantity: 5,
            unitPrice: 8,
            totalPrice: 40,
            deleted: false,
        };

        const storedDetailOne = _.cloneDeep(detailOne);
        const storedDetailTwo = _.cloneDeep(detailTwo);
        const storedDetailThree = _.cloneDeep(detailThree);

        storedDetailOne.id = 1;
        storedDetailOne.lineNumber = 1;

        storedDetailTwo.id = 2;
        storedDetailTwo.lineNumber = 2;

        storedDetailThree.id = 3;
        storedDetailThree.lineNumber = 3;

        it('should initialize line counter by default with one', () => {
            const { result } = renderHook(useDetail, {
                initialProps: {
                    initialAmount: undefined,
                    initialCounter: undefined,
                    initialDetails: undefined,
                    initialQuantity: undefined,
                },
            });

            expect(result.current.rows).toEqual([]);
            expect(result.current.lineCounter).toBe(0);
            expect(result.current.totalAmount).toBe(0);
            expect(result.current.totalQuantity).toBe(0);
        });

        it('should initialize line counter with a value', () => {
            const { result } = renderHook(useDetail, {
                initialProps: {
                    initialCounter: 10,
                    initialDetails: undefined,
                },
            });

            expect(result.current.lineCounter).toBe(10);
        });

        it('should initialize rows with a value', () => {
            const { result } = renderHook(useDetail, {
                initialProps: {
                    initialAmount: 0,
                    initialQuantity: 0,
                    initialCounter: 3,
                    initialDetails: [
                        _.cloneDeep(detailOne),
                        _.cloneDeep(detailTwo),
                        _.cloneDeep(detailThree),
                    ],
                },
            });

            expect(result.current.lineCounter).toBe(3);
            expect(result.current.totalAmount).toBe(114);
            expect(result.current.totalQuantity).toBe(13);
            expect(result.current.rows).toEqual([detailOne, detailTwo, detailThree]);
        });

        it('should increment line counter by one', () => {
            const { result } = renderHook(useDetail, {
                initialProps: {
                    initialAmount: undefined,
                    initialCounter: undefined,
                    initialDetails: undefined,
                    initialQuantity: undefined,
                },
            });

            act(() => {
                result.current.incrementLineCounter();
            });

            expect(result.current.lineCounter).toBe(1);
        });

        it('should create a new row start with one', () => {
            let row = null;

            const { result } = renderHook(useDetail, {
                initialProps: {
                    initialAmount: undefined,
                    initialCounter: undefined,
                    initialDetails: undefined,
                    initialQuantity: undefined,
                },
            });

            act(() => {
                row = result.current.createDetail(detailOne);
            });

            expect(row).toEqual(row);
            expect(result.current.lineCounter).toBe(0);
        });

        it('should add new detail', () => {
            let detail = null;

            const { result } = renderHook(useDetail, {
                initialProps: {
                    initialAmount: undefined,
                    initialCounter: undefined,
                    initialDetails: undefined,
                    initialQuantity: undefined,
                },
            });

            act(() => {
                detail = result.current.createDetail(detailOne);
            });

            act(() => {
                result.current.addDetail(detail);
            });

            expect(result.current.lineCounter).toBe(1);
            expect(result.current.rows).toEqual([detail]);
        });

        it('should add new details when has initial values', () => {
            const detailFour = {
                id: null,
                lineNumber: 0,
                item: {
                    id: 4,
                    itemName: 'item four',
                    description: 'item description four',
                    valuationType: 'AVERAGE',
                    locked: false,
                },
                description: 'detail item four',
                quantity: 1,
                unitPrice: 10,
                totalPrice: 10,
                deleted: false,
            };

            const { result } = renderHook(useDetail, {
                initialProps: {
                    initialCounter: 3,
                    initialAmount: 114,
                    initialQuantity: 13,
                    initialDetails: [
                        _.cloneDeep(storedDetailThree),
                        _.cloneDeep(storedDetailTwo),
                        _.cloneDeep(storedDetailOne),
                    ],
                },
            });

            act(() => {
                const detail = result.current.createDetail(detailFour);
                result.current.addDetail(detail);
            });

            expect(result.current.rows.length).toBe(4);
            expect(result.current.lineCounter).toBe(4);
            expect(result.current.totalAmount).toBe(124);
            expect(result.current.totalQuantity).toBe(14);
            expect(result.current.rows[0].lineNumber).toBe(4);
            expect(result.current.rows[1].lineNumber).toBe(3);
            expect(result.current.rows[2].lineNumber).toBe(2);
            expect(result.current.rows[3].lineNumber).toBe(1);
        });

        it('should update details', () => {
            const detailFour = {
                id: 2,
                lineNumber: 2,
                item: {
                    id: 2,
                    itemName: 'item two',
                    description: 'item description two',
                    valuationType: 'AVERAGE',
                    locked: false,
                },
                description: 'detail item two updated',
                quantity: 10,
                unitPrice: 10,
                totalPrice: 100,
                deleted: false,
            };

            const details = [
                _.cloneDeep(storedDetailOne),
                detailFour,
                _.cloneDeep(storedDetailThree),
            ];

            const { result } = renderHook(useDetail, {
                initialProps: {
                    initialCounter: 3,
                    initialAmount: 114,
                    initialQuantity: 13,
                    initialDetails: [
                        _.cloneDeep(storedDetailOne),
                        _.cloneDeep(storedDetailTwo),
                        _.cloneDeep(storedDetailThree),
                    ],
                },
            });

            act(() => {
                result.current.updateDetails(detailFour);
            });

            expect(result.current.lineCounter).toBe(3);
            expect(result.current.totalAmount).toBe(190);
            expect(result.current.totalQuantity).toBe(20);

            expect(result.current.rows).toEqual(details);
            expect(result.current.rows[1]).toEqual(detailFour);
        });

        it('should mark two elements as deleted', () => {
            const selection = [storedDetailOne, storedDetailThree];

            const { result } = renderHook(useDetail, {
                initialProps: {
                    initialCounter: 3,
                    initialAmount: 114,
                    initialQuantity: 13,
                    initialDetails: [
                        _.cloneDeep(storedDetailOne),
                        _.cloneDeep(storedDetailTwo),
                        _.cloneDeep(storedDetailThree),
                    ],
                },
            });

            act(() => {
                result.current.removeDetails(selection);
            });

            expect(result.current.rows.length).toBe(3);
            expect(result.current.lineCounter).toBe(3);
            expect(result.current.totalAmount).toBe(24);
            expect(result.current.totalQuantity).toBe(3);
            expect(result.current.rows[0].deleted).toBe(true);
            expect(result.current.rows[1].deleted).toBe(false);
            expect(result.current.rows[2].deleted).toBe(true);
        });

        it('should mark nonone element as deleted', () => {
            const { result } = renderHook(useDetail, {
                initialProps: {
                    initialCounter: 3,
                    initialAmount: 114,
                    initialQuantity: 13,
                    initialDetails: [
                        _.cloneDeep(storedDetailOne),
                        _.cloneDeep(storedDetailTwo),
                        _.cloneDeep(storedDetailThree),
                    ],
                },
            });

            act(() => {
                result.current.removeDetails([]);
            });

            expect(result.current.rows.length).toBe(3);
            expect(result.current.lineCounter).toBe(3);
            expect(result.current.totalAmount).toBe(114);
            expect(result.current.totalQuantity).toBe(13);

            expect(result.current.rows[0].deleted).toBe(false);
            expect(result.current.rows[1].deleted).toBe(false);
            expect(result.current.rows[2].deleted).toBe(false);
            expect(result.current.rows).toEqual([
                storedDetailThree,
                storedDetailTwo,
                storedDetailOne,
            ]);
        });

        it('should sort desc all details by line number', () => {
            const details = [storedDetailOne, storedDetailTwo, storedDetailThree];

            let rows = null;

            const { result } = renderHook(useDetail, {
                initialProps: {
                    initialCounter: 3,
                    initialAmount: 114,
                    initialQuantity: 13,
                    initialDetails: details,
                },
            });

            act(() => {
                rows = result.current.sortRow(details);
            });

            expect(rows.length).toBe(3);
            expect(result.current.totalAmount).toBe(114);
            expect(result.current.totalQuantity).toBe(13);
            expect(rows).toEqual([storedDetailThree, storedDetailTwo, storedDetailOne]);
        });

        it('should reset all values to the initial values', () => {
            const detailFour = {
                id: 2,
                lineNumber: 2,
                item: {
                    id: 2,
                    itemName: 'item two',
                    description: 'item description two',
                    valuationType: 'AVERAGE',
                    locked: false,
                },
                description: 'detail item two updated',
                quantity: 10,
                unitPrice: 10,
                totalPrice: 100,
                deleted: false,
            };

            const { result } = renderHook(useDetail, {
                initialProps: {
                    initialCounter: 3,
                    initialAmount: 114,
                    initialQuantity: 13,
                    initialDetails: [
                        _.cloneDeep(storedDetailThree),
                        _.cloneDeep(storedDetailTwo),
                        _.cloneDeep(storedDetailOne),
                    ],
                },
            });

            act(() => {
                result.current.updateDetails(detailFour);
            });

            expect(result.current.lineCounter).toBe(3);
            expect(result.current.totalAmount).toBe(190);
            expect(result.current.totalQuantity).toBe(20);

            act(() => {
                result.current.resetDetails();
            });

            expect(result.current.totalAmount).toBe(114);
            expect(result.current.totalQuantity).toBe(13);
            expect(result.current.rows).toEqual([
                _.cloneDeep(storedDetailThree),
                _.cloneDeep(storedDetailTwo),
                _.cloneDeep(storedDetailOne),
            ]);
            expect(result.current.rowsEdited).toBe(false);
        });

        it('should clear all values to empty array and zeros', () => {
            const { result } = renderHook(useDetail, {
                initialProps: {
                    initialCounter: 3,
                    initialAmount: 114,
                    initialQuantity: 13,
                    initialDetails: [
                        _.cloneDeep(storedDetailThree),
                        _.cloneDeep(storedDetailTwo),
                        _.cloneDeep(storedDetailOne),
                    ],
                },
            });

            expect(result.current.lineCounter).toBe(3);
            expect(result.current.totalAmount).toBe(114);
            expect(result.current.totalQuantity).toBe(13);
            expect(result.current.rows).toEqual([
                _.cloneDeep(storedDetailThree),
                _.cloneDeep(storedDetailTwo),
                _.cloneDeep(storedDetailOne),
            ]);

            act(() => {
                result.current.clearDetails();
            });

            expect(result.current.rows).toEqual([]);
            expect(result.current.lineCounter).toBe(0);
            expect(result.current.totalAmount).toBe(0);
            expect(result.current.totalQuantity).toBe(0);
        });

        it('should be able to add new detail from barcode reader', () => {
            const { result } = renderHook(useDetail, {
                initialProps: {
                    initialCounter: 3,
                    initialAmount: 114,
                    initialQuantity: 13,
                    initialDetails: [
                        _.cloneDeep(storedDetailThree),
                        _.cloneDeep(storedDetailTwo),
                        _.cloneDeep(storedDetailOne),
                    ],
                },
            });

            const detailFour = {
                id: null,
                lineNumber: 0,
                item: {
                    id: 4,
                    itemName: 'item four',
                    description: 'item description four',
                    valuationType: 'AVERAGE',
                    locked: false,
                },
                description: 'detail item four',
                quantity: 3,
                unitPrice: 5,
                totalPrice: 15,
                deleted: false,
            };

            const storedDetailFour = _.cloneDeep(detailFour);
            storedDetailFour.lineNumber = 4;
            storedDetailFour.quantity = 1;
            storedDetailFour.unitPrice = 0;
            storedDetailFour.totalPrice = 0;

            act(() => {
                result.current.readDetailFromBarcode(detailFour);
            });

            expect(result.current.rows).toHaveLength(4);
            expect(result.current.lineCounter).toBe(4);
            expect(result.current.rows[0]).toEqual(storedDetailFour);
            expect(result.current.rows[1]).toEqual(storedDetailThree);
            expect(result.current.rows[2]).toEqual(storedDetailTwo);
            expect(result.current.rows[3]).toEqual(storedDetailOne);
        });

        it('should be able to update detail when it is read by barcode', () => {
            const { result } = renderHook(useDetail, {
                initialProps: {
                    initialCounter: 3,
                    initialAmount: 114,
                    initialQuantity: 13,
                    initialDetails: [
                        _.cloneDeep(storedDetailThree),
                        _.cloneDeep(storedDetailTwo),
                        _.cloneDeep(storedDetailOne),
                    ],
                },
            });

            const detailFour = {
                id: null,
                lineNumber: 0,
                item: {
                    id: 2,
                    itemName: 'item two',
                    description: 'item description two',
                    valuationType: 'AVERAGE',
                    locked: false,
                },
                description: 'detail item two',
                quantity: 3,
                unitPrice: 8,
                totalPrice: 24,
                deleted: false,
            };

            const storedDetailFour = _.cloneDeep(detailFour);
            storedDetailFour.id = 2;
            storedDetailFour.lineNumber = 2;
            storedDetailFour.quantity = 4;
            storedDetailFour.totalPrice = 32;

            act(() => {
                result.current.readDetailFromBarcode(detailFour);
            });

            expect(result.current.rows).toHaveLength(3);
            expect(result.current.lineCounter).toBe(3);
            expect(result.current.rows[0]).toEqual(storedDetailThree);
            expect(result.current.rows[1]).toEqual(storedDetailFour);
            expect(result.current.rows[2]).toEqual(storedDetailOne);
        });

        it('should add new detail whe it is read from barcode with non previus details', () => {
            const { result } = renderHook(useDetail, {
                initialProps: {
                    initialCounter: 0,
                    initialAmount: 0,
                    initialQuantity: 0,
                    initialDetails: [],
                },
            });

            const detailFour = {
                id: null,
                lineNumber: 1,
                item: {
                    id: 1,
                    itemName: 'item one',
                    description: 'item description one',
                    valuationType: 'AVERAGE',
                    locked: false,
                },
                description: 'detail item one',
                quantity: 2,
                unitPrice: 0,
                totalPrice: 0,
                deleted: false,
            };

            act(() => {
                result.current.readDetailFromBarcode(_.cloneDeep(storedDetailOne));
            });

            act(() => {
                result.current.readDetailFromBarcode(_.cloneDeep(storedDetailOne));
            });

            expect(result.current.lineCounter).toBe(1);
            expect(result.current.rows).toHaveLength(1);
            expect(result.current.rows[0]).toEqual(detailFour);
        });
    });

    describe('dispatch and reception forms', () => {
        const warehouse = {
            id: 1,
            warehouseName: 'warehouse one',
            itemSummary: [],
            locked: false,
            deleted: false,
        };

        it('should be able to initialize an empty document', () => {
            const { result: document } = renderHook(useDocumentForm, {
                initialProps: {
                    initialState: undefined,
                    defaultInitialState: inputDocumentState,
                },
            });

            const { result: details } = renderHook(useDetail, {
                initialProps: {
                    initialAmount: undefined,
                    initialCounter: undefined,
                    initialDetails: undefined,
                    initialQuantity: undefined,
                },
            });

            expect(details.current.rows).toEqual([]);
            expect(details.current.lineCounter).toBe(0);
            expect(details.current.totalAmount).toBe(0);
            expect(details.current.totalQuantity).toBe(0);

            expect(document.current.document.details).toEqual([]);
            expect(document.current.document).toEqual(inputDocumentState);
            expect(document.current.documentCopy).toEqual(inputDocumentState);
            expect(document.current.initialDocument).toEqual(inputDocumentState);
        });

        it('should be able to change any field except details', () => {
            const { result: document } = renderHook(useDocumentForm, {
                initialProps: {
                    initialState: undefined,
                    defaultInitialState: inputDocumentState,
                },
            });

            const { result: details } = renderHook(useDetail, {
                initialProps: {
                    initialAmount: undefined,
                    initialCounter: undefined,
                    initialDetails: undefined,
                    initialQuantity: undefined,
                },
            });

            act(() => {
                document.current.updateDocumentField(
                    'description',
                    'input document one description'
                );
            });

            act(() => {
                const today = new Date(2023, 7, 18, 23, 41, 50, 0);
                document.current.updateDocumentField('date', today);
            });

            act(() => {
                document.current.updateDocumentField('warehouse', warehouse);
            });

            expect(document.current.documentEdited).toBe(true);
            expect(document.current.addButtonDisabled).toBe(false);
            expect(document.current.deleteButtonDisabled).toBe(true);
            expect(document.current.releaseButtonDisabled).toBe(true);

            expect(document.current.document.counter).toBe(0);
            expect(document.current.documentCopy).toEqual(inputDocumentState);
            expect(document.current.initialDocument).toEqual(inputDocumentState);

            expect(details.current.rows).toEqual([]);
            expect(details.current.lineCounter).toBe(0);
            expect(details.current.totalAmount).toBe(0);
            expect(details.current.totalQuantity).toBe(0);
        });

        it('should be able to change details', () => {
            const detailOne = {
                id: null,
                lineNumber: 0,
                item: {
                    id: 1,
                    itemName: 'item one',
                    description: 'item description one',
                    valuationType: 'AVERAGE',
                    locked: false,
                },
                description: 'detail item one',
                quantity: 5,
                unitPrice: 10,
                totalPrice: 50,
                deleted: false,
            };

            const detailTwo = {
                id: null,
                lineNumber: 0,
                item: {
                    id: 2,
                    itemName: 'item two',
                    description: 'item description two',
                    valuationType: 'AVERAGE',
                    locked: false,
                },
                description: 'detail item two',
                quantity: 3,
                unitPrice: 8,
                totalPrice: 24,
                deleted: false,
            };

            const { result: document } = renderHook(useDocumentForm, {
                initialProps: {
                    initialState: undefined,
                    defaultInitialState: inputDocumentState,
                },
            });

            const { result: details } = renderHook(useDetail, {
                initialProps: {
                    initialAmount: undefined,
                    initialCounter: undefined,
                    initialDetails: undefined,
                    initialQuantity: undefined,
                },
            });

            act(() => {
                document.current.updateDocumentField(
                    'description',
                    'input document one description'
                );
            });

            act(() => {
                const today = new Date(2023, 7, 18, 23, 41, 50, 0);
                document.current.updateDocumentField('date', today);
            });

            act(() => {
                document.current.updateDocumentField('warehouse', warehouse);
            });

            act(() => {
                const detail = details.current.createDetail(detailOne);
                details.current.addDetail(detail);
            });

            act(() => {
                const detail = details.current.createDetail(detailTwo);
                details.current.addDetail(detail);
            });

            expect(document.current.documentEdited).toBe(true);
            expect(document.current.addButtonDisabled).toBe(false);
            expect(document.current.deleteButtonDisabled).toBe(true);
            expect(document.current.releaseButtonDisabled).toBe(true);

            expect(document.current.document.counter).toBe(0);
            expect(document.current.documentCopy).toEqual(inputDocumentState);
            expect(document.current.initialDocument).toEqual(inputDocumentState);

            expect(document.current.document.warehouse).toEqual(warehouse);
            expect(document.current.document.type).toBe(DOCUMENT_TYPES.INPUT);
            expect(document.current.document.description).toBe('input document one description');

            expect(details.current.rows[1].id).toBeNull();
            expect(details.current.rows[1].lineNumber).toBe(1);
            expect(details.current.rows[1].item).toEqual(detailOne.item);
            expect(details.current.rows[1].deleted).toEqual(detailOne.deleted);
            expect(details.current.rows[1].quantity).toEqual(detailOne.quantity);
            expect(details.current.rows[1].unitPrice).toEqual(detailOne.unitPrice);
            expect(details.current.rows[1].totalPrice).toEqual(detailOne.totalPrice);
            expect(details.current.rows[1].description).toEqual(detailOne.description);

            expect(details.current.rows[0].id).toBeNull();
            expect(details.current.rows[0].lineNumber).toBe(2);
            expect(details.current.rows[0].item).toEqual(detailTwo.item);
            expect(details.current.rows[0].deleted).toEqual(detailTwo.deleted);
            expect(details.current.rows[0].quantity).toEqual(detailTwo.quantity);
            expect(details.current.rows[0].unitPrice).toEqual(detailTwo.unitPrice);
            expect(details.current.rows[0].totalPrice).toEqual(detailTwo.totalPrice);
            expect(details.current.rows[0].description).toEqual(detailTwo.description);

            expect(details.current.lineCounter).toBe(2);
            expect(details.current.rows.length).toBe(2);
            expect(details.current.totalAmount).toBe(74);
            expect(details.current.totalQuantity).toBe(8);
        });

        it('should be able to enable save button after modifying details', () => {
            const detailOne = {
                id: 1,
                lineNumber: 1,
                item: {
                    id: 1,
                    itemName: 'item one',
                    description: 'item description one',
                    valuationType: 'AVERAGE',
                    locked: false,
                },
                description: 'detail item one',
                quantity: 5,
                unitPrice: 10,
                totalPrice: 50,
                deleted: false,
            };

            const detailTwo = {
                id: 2,
                lineNumber: 2,
                item: {
                    id: 2,
                    itemName: 'item two',
                    description: 'item description two',
                    valuationType: 'AVERAGE',
                    locked: false,
                },
                description: 'detail item two',
                quantity: 2,
                unitPrice: 25,
                totalPrice: 50,
                deleted: false,
            };

            const detailThree = {
                id: null,
                lineNumber: 0,
                item: {
                    id: 3,
                    itemName: 'item three',
                    description: 'item description three',
                    valuationType: 'AVERAGE',
                    locked: false,
                },
                description: 'detail item three',
                quantity: 4,
                unitPrice: 4,
                totalPrice: 16,
                deleted: false,
            };

            const initialDocument = {
                id: 'OU0000000001',
                type: 'INPUT',
                date: new Date(),
                status: 'OPEN',
                warehouse: warehouse,
                description: 'input document one',
                totalQuantity: 10,
                totalAmount: 100,
                counter: 2,
                deleted: false,
                details: [detailTwo, detailOne],
            };

            const { result: document } = renderHook(useDocumentForm, {
                initialProps: {
                    initialState: _.cloneDeep(initialDocument),
                    defaultInitialState: _.cloneDeep(initialDocument),
                },
            });

            const { result: details } = renderHook(useDetail, {
                initialProps: {
                    initialDetails: document.details,
                    initialCounter: document.counter,
                    initialAmount: document.totalAmount,
                    initialQuantity: document.totalQuantity,
                },
            });

            act(() => {
                const detail = details.current.createDetail(detailThree);
                details.current.addDetail(detail);
            });

            const saveFormButtonDisabled = !(
                document.current.documentEdited || details.current.rowsEdited
            );
            expect(saveFormButtonDisabled).toBe(false);
            expect(details.current.rowsEdited).toBe(true);
            expect(document.current.documentEdited).toBe(false);
        });

        it('should be able to update from service', () => {
            const detailOne = {
                id: 1,
                lineNumber: 1,
                item: {
                    id: 1,
                    itemName: 'item one',
                    description: 'item description one',
                    valuationType: 'AVERAGE',
                    locked: false,
                },
                description: 'detail item one',
                quantity: 5,
                unitPrice: 10,
                totalPrice: 50,
                deleted: false,
            };

            const detailTwo = {
                id: 2,
                lineNumber: 2,
                item: {
                    id: 2,
                    itemName: 'item two',
                    description: 'item description two',
                    valuationType: 'AVERAGE',
                    locked: false,
                },
                description: 'detail item two',
                quantity: 2,
                unitPrice: 25,
                totalPrice: 50,
                deleted: false,
            };

            const detailThree = {
                id: 3,
                lineNumber: 3,
                item: {
                    id: 3,
                    itemName: 'item three',
                    description: 'item description three',
                    valuationType: 'AVERAGE',
                    locked: false,
                },
                description: 'detail item three',
                quantity: 4,
                unitPrice: 4,
                totalPrice: 16,
                deleted: false,
            };

            const initialDocument = {
                id: 'OU0000000001',
                type: 'INPUT',
                date: '03-07-2023 23:41:50.000',
                status: 'OPEN',
                warehouse: warehouse,
                description: 'input document one',
                totalQuantity: 10,
                totalAmount: 100,
                counter: 2,
                deleted: false,
                details: [_.cloneDeep(detailThree), _.cloneDeep(detailTwo), _.cloneDeep(detailOne)],
            };

            const documentResponse = _.cloneDeep(initialDocument);
            documentResponse.date = new Date(2023, 6, 3, 23, 41, 50, 0);

            const { result: document } = renderHook(useDocumentForm, {
                initialProps: {
                    initialState: undefined,
                    defaultInitialState: _.cloneDeep(inputDocumentState),
                },
            });

            const { result: details } = renderHook(useDetail, {
                initialProps: {
                    initialAmount: undefined,
                    initialCounter: undefined,
                    initialDetails: undefined,
                    initialQuantity: undefined,
                },
            });

            const { details: data, counter, totalAmount, totalQuantity } = { ...initialDocument };

            act(() => {
                document.current.updateDocumentFromService(initialDocument);
            });

            act(() => {
                details.current.updateDetailFromService(data, counter, totalAmount, totalQuantity);
            });

            expect(details.current.rows).toEqual(data);
            expect(document.current.document).toEqual(documentResponse);
        });
    });

    describe('useRowData', () => {
        it('should initialize an empty hook', () => {
            const { result } = renderHook(useRowData);

            const detail = {
                id: null,
                lineNumber: 0,
                item: {},
                description: '',
                quantity: 0,
                unitPrice: 0,
                totalPrice: 0,
                deleted: false,
            };

            expect(result.current.rowData).toEqual(detail);
        });

        it('should update rowData', () => {
            const { result } = renderHook(useRowData);

            const detail = {
                id: null,
                lineNumber: 0,
                item: {
                    id: 1,
                    itemName: 'item one',
                    description: 'item description one',
                    valuationType: 'AVERAGE',
                    locked: false,
                },
                description: 'detail item one',
                quantity: 5,
                unitPrice: 10,
                totalPrice: 50,
                deleted: false,
            };

            act(() => {
                result.current.updateRowData(detail);
            });

            expect(result.current.rowData).toEqual(detail);
        });

        it('should update a field of row data', () => {
            const { result } = renderHook(useRowData);

            const item = {
                id: 1,
                itemName: 'item one',
                description: 'item description one',
                valuationType: 'AVERAGE',
                locked: false,
            };

            const detail = {
                id: null,
                lineNumber: 0,
                item: _.cloneDeep(item),
                description: '',
                quantity: 0,
                unitPrice: 0,
                totalPrice: 0,
                deleted: false,
            };

            act(() => {
                result.current.updateRowDataField('item', item);
            });

            expect(result.current.rowData).toEqual(detail);
        });

        it('should restore the row data', () => {
            const { result } = renderHook(useRowData);

            const detail = {
                id: null,
                lineNumber: 0,
                item: {},
                description: '',
                quantity: 0,
                unitPrice: 0,
                totalPrice: 0,
                deleted: false,
            };

            act(() => {
                const detailOne = {
                    id: null,
                    lineNumber: 0,
                    item: {
                        id: 1,
                        itemName: 'item one',
                        description: 'item description one',
                        valuationType: 'AVERAGE',
                        locked: false,
                    },
                    description: 'detail item one',
                    quantity: 5,
                    unitPrice: 10,
                    totalPrice: 50,
                    deleted: false,
                };

                result.current.updateRowData(detailOne);
            });

            act(() => {
                result.current.clearRowData();
            });

            expect(result.current.rowData).toEqual(detail);
        });

        it('should calc the result of total price', () => {
            const { result } = renderHook(useRowData);

            const detail = {
                id: null,
                lineNumber: 0,
                item: {
                    id: 1,
                    itemName: 'item one',
                    description: 'item description one',
                    valuationType: 'AVERAGE',
                    locked: false,
                },
                description: '',
                quantity: 0,
                unitPrice: 0,
                totalPrice: 0,
                deleted: false,
            };

            act(() => {
                result.current.updateRowData(detail);
            });

            act(() => {
                result.current.updateRowDataField('quantity', 5);
            });

            act(() => {
                result.current.updateRowDataField('unitPrice', 5.25);
            });

            const { totalPrice } = { ...result.current.rowData };
            expect(totalPrice).toBe(26.25);
        });

        it('should be able to handle when quantity value is empty', () => {
            const { result } = renderHook(useRowData);

            const detail = {
                id: null,
                lineNumber: 0,
                item: {
                    id: 1,
                    itemName: 'item one',
                    description: 'item description one',
                    valuationType: 'AVERAGE',
                    locked: false,
                },
                description: '',
                quantity: 0,
                unitPrice: 0,
                totalPrice: 0,
                deleted: false,
            };

            act(() => {
                result.current.updateRowData(detail);
            });

            act(() => {
                result.current.updateRowDataField('quantity', ' ');
            });

            const { totalPrice, quantity, unitPrice } = { ...result.current.rowData };
            expect(quantity).toBe(0);
            expect(unitPrice).toBe(0);
            expect(totalPrice).toBe(0);
        });

        it('should be able to handle when quantity value is empty', () => {
            const { result } = renderHook(useRowData);

            const detail = {
                id: null,
                lineNumber: 0,
                item: {
                    id: 1,
                    itemName: 'item one',
                    description: 'item description one',
                    valuationType: 'AVERAGE',
                    locked: false,
                },
                description: '',
                quantity: 0,
                unitPrice: 3,
                totalPrice: 0,
                deleted: false,
            };

            act(() => {
                result.current.updateRowData(detail);
            });

            act(() => {
                result.current.updateRowDataField('quantity', ' ');
            });

            const { totalPrice, quantity, unitPrice } = { ...result.current.rowData };
            expect(quantity).toBe(0);
            expect(unitPrice).toBe(3);
            expect(totalPrice).toBe(0);
        });

        it('should be able to handle when unitPrice value is empty', () => {
            const { result } = renderHook(useRowData);

            const detail = {
                id: null,
                lineNumber: 0,
                item: {
                    id: 1,
                    itemName: 'item one',
                    description: 'item description one',
                    valuationType: 'AVERAGE',
                    locked: false,
                },
                description: '',
                quantity: 0,
                unitPrice: 0,
                totalPrice: 0,
                deleted: false,
            };

            act(() => {
                result.current.updateRowData(detail);
            });

            act(() => {
                result.current.updateRowDataField('quantity', 5);
            });

            act(() => {
                result.current.updateRowDataField('unitPrice', ' ');
            });

            const { totalPrice, quantity, unitPrice } = { ...result.current.rowData };
            expect(quantity).toBe(5);
            expect(unitPrice).toBe(0);
            expect(totalPrice).toBe(0);
        });

        it('should be able to disable add button when total price is 0 or item is empty by default', () => {
            const { result } = renderHook(useRowData);

            const detail = {
                id: null,
                lineNumber: 0,
                item: {},
                description: '',
                quantity: 0,
                unitPrice: 0,
                totalPrice: 0,
                deleted: false,
            };

            expect(result.current.rowData).toEqual(detail);
            expect(result.current.addButtonDisabled).toBe(true);
        });

        it('should disable add button when quantity is zero and makes total price zero', () => {
            const { result } = renderHook(useRowData);

            const detail = {
                id: null,
                lineNumber: 0,
                item: {
                    id: 1,
                    itemName: 'item one',
                    description: 'item description one',
                    valuationType: 'AVERAGE',
                    locked: false,
                },
                description: 'detail item one',
                quantity: 5,
                unitPrice: 10,
                totalPrice: 50,
                deleted: false,
            };

            act(() => {
                result.current.updateRowData(detail);
            });

            expect(result.current.rowData.quantity).toBe(5);
            expect(result.current.addButtonDisabled).toBe(false);

            act(() => {
                result.current.updateRowDataField('quantity', 0);
            });

            expect(result.current.rowData.quantity).toBe(0);
            expect(result.current.addButtonDisabled).toBe(true);
        });

        it('should disable add button when unit price is zero and makes total price zero', () => {
            const { result } = renderHook(useRowData);

            const detail = {
                id: null,
                lineNumber: 0,
                item: {
                    id: 1,
                    itemName: 'item one',
                    description: 'item description one',
                    valuationType: 'AVERAGE',
                    locked: false,
                },
                description: 'detail item one',
                quantity: 5,
                unitPrice: 10,
                totalPrice: 50,
                deleted: false,
            };

            act(() => {
                result.current.updateRowData(detail);
            });

            expect(result.current.rowData.unitPrice).toBe(10);
            expect(result.current.addButtonDisabled).toBe(false);

            act(() => {
                result.current.updateRowDataField('unitPrice', 0);
            });

            expect(result.current.rowData.unitPrice).toBe(0);
            expect(result.current.addButtonDisabled).toBe(true);
        });

        it('should enable add button when total price is greater than zero', () => {
            const { result } = renderHook(useRowData);

            const detail = {
                id: null,
                lineNumber: 0,
                item: {
                    id: 1,
                    itemName: 'item one',
                    description: 'item description one',
                    valuationType: 'AVERAGE',
                    locked: false,
                },
                description: '',
                quantity: 0,
                unitPrice: 0,
                totalPrice: 0,
                deleted: false,
            };

            act(() => {
                result.current.updateRowData(detail);
            });

            act(() => {
                result.current.updateRowDataField('quantity', 3);
            });

            act(() => {
                result.current.updateRowDataField('unitPrice', 5);
            });

            expect(result.current.rowData.totalPrice).toBe(15);
            expect(result.current.addButtonDisabled).toBe(false);
        });
    });
});
