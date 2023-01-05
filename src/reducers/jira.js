import Immutable from 'immutable';
import store from '../store';
import { getIssues, getIssueDetails, receiveFilter, receiveDetail, failed,getfilterMore, receiveFilterMore,setSuccess } from '../actions/JiraActions';

const initialState = {
	issues: Immutable.List(),
	maxResults: 0,
	total: 0,
	startAt: 0,
    loading: true,
    detail: {}
};

export default function jira(state = initialState, action) {
    switch (action.type) {
        
		case 'GET_ISSUES': {
			fetch(action.URL, { method: 'POST',body:JSON.stringify(action.filter) })
				.then((res) => res.json())
				.then((res) => store.dispatch(receiveFilter(res,action.filter)))
				.catch((err) => failed(`Something went wrong ${err}`));
                return {
                   
                    issues: state.issues,
                    maxResults: state.maxResults,
                    total: state.total,
                    startAt: state.startAt,
                    loading: true
                };
			break;
		}

		case 'RECEIVE_FILTER': {
			return {
				issues: Immutable.List(action.json.issues),
				maxResults: action.json.maxResults,
				total: action.json.total,
				startAt: action.json.startAt,
				loading: false,
			};
		}

        case 'GET_FILTER_MORE': {
            fetch(action.URL, { method: 'POST',body:action.body })
                .then(succes => succes.json())
                .then(succes => store.dispatch(receiveFilterMore(succes)))
                .catch(error => store.dispatch(failed('Something went wrong' + error)));
            return state;
        }

        case 'RECEIVE_FILTER_MORE': {
            return {
                issues: Immutable.List(action.json.issues),
                maxResults: action.json.maxResults,
                total: action.json.total,
                startAt: action.json.startAt,
                loading: state.loading
            };
        }

        case 'ADD_COMMENT':
            console.log(action)
            fetch(action.url,{
            method:'POST',
            body:JSON.stringify(action.form)
            })
            .then(res =>{
                if(!res.ok){
                    return res.json();

                }else{
                    store.dispatch(setSuccess('Comment Created Successfully'))
                    store.dispatch(getIssueDetails(action.form.issueId))
                }
            }).then(res=>{
                
                store.dispatch(failed(`${res}`))

            })
            .catch(err => {
            console.log(err)
             failed(`Something went wrong ${err}`)
            
            });
            return {...state}
        break;

        case 'SUCCESS':
            return {...state,success:action.success}
        case 'UPDATE':
            fetch(action.URL,{
                method:'POST',
                body:JSON.stringify({
                    "body":action.body,
                    "key":action.key
                })
                }).then(res=>{
                    var win = window.open(`/issue/details/${action.key}`, "blank");
                })
                .catch(err => {
                console.log(err)
                 failed(`Something went wrong ${err}`)
                
                });
       
		default:
            return state;
			break;
	}
}
