import {getUsers,createUser,deleteUser,updateCustomer,receiveUsers,failed,resetfailed,setSuccess} from "../actions/UserActions";
import store from '../store';


const initialState = {
  users: [],
  loading: true,
  error:'',
  success:false
};

export default function users(state=initialState,action) {
    switch (action.type) {
        case 'GET_USERS':
            fetch(action.url,{method:'GET'})
            .then(res=>res.json())
            .then(res=>store.dispatch(receiveUsers(res)))
            .catch(err=>failed(`Something went wrong ${err}`));
            return {...state,
                users:state.users,
                loading:true
            }
        break;

        case 'RECEIVE_USERS':
        return {...state,
            users: action.json.Users,
            loading: false
        };
        break;
    

        case 'CREATE_USER':
            fetch(action.url,{
            method:'POST',
            body:JSON.stringify(action.form)
            })
            .then(res =>{
                if(!res.ok){
                    return res.json();

                }else{
                    store.dispatch(setSuccess('User Created Successfully'))
                    store.dispatch(getUsers())
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

        case 'DELETE_USER':
            fetch(action.url,{
                method:'DELETE',
                body:JSON.stringify(action.form)
            })
            .then(res =>{
            store.dispatch(setSuccess('User Removed Successfully'))
            store.dispatch(getUsers())
            //setSuccess(1);

            })   
            .catch(err => {
             failed(`Something went wrong ${err}`)
            // setError(err);
            
            });
            return {...state}
        break;

        case 'UPDATE_CUSTOMER':
            fetch(action.url,{
                method:'POST',
                body:JSON.stringify(action.form)
            })
            .then(res =>{
            store.dispatch(setSuccess('User Updated Successfully'))
            store.dispatch(getUsers())
            //setSuccess(1);

            })   
            .catch(err => {
             failed(`Something went wrong ${err}`)
            // setError(err);
            
            });
            return {...state}
        break;
        case 'FAILED':
            return {...state,error:action.error}
        break;
        case 'SUCCESS':
            return {...state,success:action.success}
        break;
        case 'RESETERROR':
            return {...state,error:''}
    
        default:
         return {...state}
        break;
    }
}