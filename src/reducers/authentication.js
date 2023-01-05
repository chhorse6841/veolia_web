import Immutable from 'immutable';
import store from '../store';


const initialState = {
    Authenticated:false,
    user:{}
};

export default function authentication(state = initialState, action) {
	switch (action.type) {
		case 'STOREUSER': {
		
                return {
                   
                    Authenticated:true,
                    user:action.user
                };
			break;
        }
        
        case 'REMOVEUSER': {
		
            return {
               
                Authenticated:false,
                user:{}
            };
        break;
    }
   
       
		default:
            return state;
			break;
	}
}
