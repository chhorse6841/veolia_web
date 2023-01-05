import {BASE_URL} from '../config/config';
export function getUsers(){
    return {
        type:'GET_USERS',
        url:`${BASE_URL}/list/users`
    }
}

export function receiveUsers(json) {
    return {
        type: 'RECEIVE_USERS',
        json: json
    };
}

export function createUser(form){
    return {
        type:'CREATE_USER',
        url:`${BASE_URL}/create/user`,
        form:form
    }
}

export function deleteUser(form){
    return {
        type:'DELETE_USER',
        url:`${BASE_URL}/delete/user`,
        form:form
    }
}

export function updateCustomer(form){
    return {
        type:'UPDATE_CUSTOMER',
        url:`${BASE_URL}/edit/customer`,
        form:form
    }
}

export function failed(error) {
    return {
        type: 'FAILED',
        error: error
    };
}

export function resetfailed() {
    return {
        type: 'RESETERROR',
    };
}

export function setSuccess(success) {
    return {
        type: 'SUCCESS',
        success
    };
}