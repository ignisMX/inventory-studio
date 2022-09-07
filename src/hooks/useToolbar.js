import { useState } from 'react';
//hooks
import { usePut } from '@hooks/usePut';
import { useGet } from '@hooks/useGet';
import { usePost } from '@hooks/usePost';
//utils
import { isEmpty, buildUrl, dateToString, stringToDate, isArrayEmpty } from '@utils';

export const useNew = (updateState, updateCopy, initialState) => {
    const onNew = () => {
        updateState(initialState);
        updateCopy(initialState);
    };

    return { onNew };
};

export const useSave = (field, endpoint, showNotification) => {
    const [params, setParams] = useState({});

    const updateParams = (_params) => {
        setParams(_params);
    };

    const onSave = (state, updateState, updateCopy) => {
        if (isEmpty(state[field])) {
            usePost(buildUrl(endpoint.save, params), dateToString({ ...state })).then((data) => {
                updateState(stringToDate(data));
                updateCopy(stringToDate(data));
                showNotification('success');
            });
        } else {
            usePut(buildUrl(endpoint.update, params), dateToString({ ...state })).then((data) => {
                updateState(stringToDate(data));
                updateCopy(stringToDate(data));
                showNotification('success');
            });
        }
    };

    return { onSave, updateParams };
};

export const useSaveWithDetails = (fields, updateDetails, endpoint, showNotification) => {
    let params = {};

    const onSave = (state, updateState, updateCopy) => {
        params = {
            type: state[fields.TYPE],
        };

        if (isEmpty(state[fields.ID])) {
            usePost(buildUrl(endpoint.save, params), dateToString({ ...state })).then((data) => {
                fetchDetails(data, updateDetails);
                updateState(stringToDate(data));
                updateCopy(stringToDate(data));
                showNotification('success');
            });
        } else {
            params = {
                type: state[fields.TYPE],
                id: state[fields.ID],
            };

            usePut(buildUrl(endpoint.update, params), dateToString({ ...state })).then((data) => {
                fetchDetails(data, updateDetails);
                updateState(stringToDate(data));
                updateCopy(stringToDate(data));
                showNotification('success');
            });
        }
    };

    const fetchDetails = (state, updateDetails) => {
        params = {
            type: state[fields.TYPE],
            id: state[fields.ID],
        };
        useGet(`${buildUrl(endpoint.details, params)}?page=0&size=10`).then((details) => {
            updateDetails(details);
        });
    };

    return { onSave };
};
