export function storeUser(user){
    return {
        type:'STOREUSER',
        user
    }
}

export function removeUser(){
    return {
        type:'REMOVEUSER'
    }
}


export function failed(error) {
    return {
        type: 'FAILED',
        error: error
    };
}
