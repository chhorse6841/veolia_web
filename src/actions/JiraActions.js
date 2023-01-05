import {BASE_URL} from '../config/config';


function finalizeFilter(filters) {
    return {
        "address": filters == null ? "" : filters.address,
        "brand": filters == null ? "" : filters.brand,
        "brandType": filters == null ? "" : filters.brandType,
        "contact": filters == null ? "" : filters.contact,
        "customerReference": filters == null ? "" : filters.customerReference,
        "key": filters == null ? "" : filters.key,
        "licensePlate": filters == null ? "" : filters.licensePlate,
        "resolutionDateBegin": filters == null ? "" : filters.resolutionDateBegin,
        "resolutionDateEnd": filters == null ? "" : filters.resolutionDateEnd,
        "startAt": filters == null ? 0 : filters.startAt,
        "status": filters == null ? "" : filters.status,
        "customer":filters==null?"":filters.customer,
        "chassyNumber":filters==null?"":filters.chassyNumber
    };
}

export function getIssues(filter){
    return {
        type:'GET_ISSUES',
        URL:`${BASE_URL}/getfilter`,
        filter:filter
    }
}

export function updateIssue(key,id){
 return{
     type:'UPDATE',
     URL:`${BASE_URL}/create/location`,
     body: {
        fields: {
          
         customfield_10132:"https://www.google.com/maps/embed/v1/view?key=AIzaSyBhiqcP_bAdHxn2PIilDhj76W7rHhQBmwE&center=50.7355103,4.593384&zoom=18"
          
          }
        },
        key:key
 }  
}
export function receiveFilter(json,filter) {
    // if(filter.salesorder !== ""){
    //     for (var  property=0; property < json.issues.length-1 ;property++) {
    //         if(json.issues[property].salesorder === filter.salesorder){
    //             json.issues = [json.issues[property]]
    //         }
    //       }
    // }
    // if(filter.installationAddress !==""){
    //     var jsonTemp ={ ...json}
    //     var checked = false
    //     for (var  property=0; property < jsonTemp.issues.length-1 ;property++) {
    //         if(jsonTemp.issues[property].installationAddress.toUpperCase().indexOf(filter.installationAddress.toUpperCase()) != -1){
    //             if(!checked){
    //                 json.issues=[]
    //                 checked = true
    //             }
    //             json.issues.push(jsonTemp.issues[property])

    //         }
    //       }
    // }   
     return {
        type: 'RECEIVE_FILTER',
        json: json
    };
}

export function getIssueDetails(key){
    return {
        type:'GET_DETAILS',
        URL:`${BASE_URL}/getticketdetails/${key}`,
        key:key
    }
}

export function receiveDetail(json) {
    return {
        type: 'RECEIVE_DETAIL',
        json: json
    };
}

export function failed(error) {
    return {
        type: 'FAILED',
        error: error
    };
}

export function getfilterMore(filters) {
    if (filters == null) return {type: 'NOP'};
    return {
        type: 'GET_FILTER_MORE',
        URL:`${BASE_URL}/getfilter`,
        body: JSON.stringify({
            "address": filters.address,
            "brand": filters.brand,
            "brandType": filters.brandType,
            "contact": filters.contact,
            "customerReference": filters.customerReference,
            "key": filters.key,
            "licensePlate": filters.licensePlate,
            "resolutionDateBegin": filters.resolutionDateBegin,
            "resolutionDateEnd": filters.resolutionDateEnd,
            "startAt": filters.startAt,
            "status": filters.status,
            "customer":filters.customer,
            "chassyNumber":filters.chassyNumber
        })
    };
}

export function receiveFilterMore(json) {
    return {
        type: 'RECEIVE_FILTER_MORE',
        json: json
    };
}

export function addComment(form){
    return {
        type:'ADD_COMMENT',
        url:`${BASE_URL}/create/comment`,
        form:form
    }
}

export function setSuccess(success) {
    return {
        type: 'SUCCESS',
        success
    };
}
