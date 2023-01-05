import Immutable from 'immutable';
import store from '../store';
import { failed, receiveDetail} from '../actions/JiraActions';

const initialState = {
    loading: false,
    detail: {}
};

export default function details(state = initialState, action) {
	switch (action.type) {
		
        case 'GET_DETAILS': {
            fetch(action.URL)
                .then((succes) => succes.json())
                .then(succes => store.dispatch(receiveDetail(succes)))
                .catch(error => store.dispatch(failed('something went wrong:' + error)));
            return {
              
                detail: state.detail,
                loading: true
            };
        }

        case 'RECEIVE_DETAIL': {
            return {
               
                detail: JSON.parse(action.json),
                loading: false
            };
        }
		default:
            return state;
			break;
	}
}
