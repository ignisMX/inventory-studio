import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { isReleasedOrLocked } from '@utils/validations';
import { isObjectEmpty, transformFilter } from '@utils';

import { Dashboard } from '@components/dashboard';

import { Toast } from 'primereact/toast';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

export const List = (props) => {
    const [row, setRow] = useState();
    const [data, setData] = useState([]);
    const [first, setFirst] = useState(0);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const {
        header,
        remove,
        fields,
        filters,
        toolbar,
        redirect,
        headerValue,
        notification,
        getDataByPage,
        getDataAsPage,
        getDataByFilter,
    } = {
        ...props,
    };

    const fetchDataAsPage = async () => {
        const result = await getDataAsPage();
        setFirst(0);
        setData(result);
        setLoading(false);
    };

    const fetchDataByPage = async (event) => {
        const result = await getDataByPage(event.page);
        setData(result);
        setFirst(event.first);
        setLoading(false);
    };

    const fetchDataByFilter = async (filter) => {
        const result = await getDataByFilter(filter);
        setFirst(0);
        setData(result);
        setLoading(false);
    };

    useEffect(() => {
        fetchDataAsPage();
    }, []);

    const onPage = (event) => {
        if (event.first !== first) {
            fetchDataByPage(event);
        }
    };

    const onFilter = (event) => {
        const filter = transformFilter(event.filters);
        if (!isObjectEmpty(filter)) {
            fetchDataByFilter(filter);
        } else {
            fetchDataAsPage();
        }
    };

    const actionTemplate = (row) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success mr-2"
                    onClick={() => {
                        router.push(`${redirect}${row.id}`);
                    }}
                />
                <Button
                    icon="pi pi-trash"
                    onClick={() => {
                        onConfirmRemoval(row);
                    }}
                    disabled={isReleasedOrLocked(row)}
                    className="p-button-rounded p-button-warning"
                />
            </React.Fragment>
        );
    };

    const onConfirmRemoval = (row) => {
        const accept = async () => {
            await remove(row);
            fetchDataAsPage();
        };

        confirmDialog({
            accept,
            reject: () => {},
            acceptLabel: 'Si',
            header: `${header} ${row[headerValue]}`,
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            message: `¿Esta seguro que desea borrar este registro?`,
        });
    };

    return (
        <Dashboard>
            {toolbar}
            <DataTable
                lazy
                paginator
                stripedRows
                dataKey="id"
                first={first}
                selection={row}
                rows={data.size}
                loading={loading}
                filters={filters}
                onFilter={onFilter}
                filterDisplay="row"
                value={data.content}
                selectionMode="single"
                responsiveLayout="scroll"
                totalRecords={data.totalElements}
                onSelectionChange={(event) => {
                    setRow(event.value);
                }}
                onPage={onPage}
            >
                {fields.map((element) => {
                    if (element.template !== undefined) {
                        return <Column key="id" body={element.template} header={element.header} />;
                    } else if (element.filter) {
                        return (
                            <Column
                                key="id"
                                field={element.field}
                                header={element.header}
                                filterPlaceholder={`Buscar por ${element.header}`}
                                filter
                            />
                        );
                    }
                    return <Column key="id" field={element.field} header={element.header} />;
                })}
                <Column body={actionTemplate} />
            </DataTable>
            <ConfirmDialog />
            <Toast ref={notification} />
        </Dashboard>
    );
};
