import {
    UPDATE_LANGUAGE,
    DEFAULT_RETURN,
    REQUEST_FAILURE,
    POST_CRUD,
    REQUEST_INIT,
    IDLE_LOGOUT,
    UPDATE_PROFILE_IMAGE

} from '../actions/LoginTypes';

const initialState = {
    language: 'en-US',
    loading: false,
    navigation: 'login',
    masterData: {},
    masterStatus: "",
    errorStatus: "",
    idleneed:true,
    idleTimeout: 1000 * 60, //added by Syed on 27-SEP-2024
    sessionExpired: Date.now() + 600000,
    //inputParam:{}
    userInfo: {
        susername: '',
        suserrolename: ''
    },

}

const LoginReducer = (state = initialState, action) => {
    switch (action.type) {

        case REQUEST_INIT:
            return {
                ...state,
                loading: action.payload
            }

            case UPDATE_LANGUAGE:
                return {
                    ...state,
                    ...action.payload
                }

                case DEFAULT_RETURN:
                    // console.log("DEFAULT_RETURN action.payload:", action.payload);
                    return {
                        ...state,
                        ...action.payload
                    }

                    case REQUEST_FAILURE:
                        return {
                            ...state,
                            error: action.payload.error,
                                loading: action.payload.loading
                        }

                        case POST_CRUD:
                            // let {selectedId, filterValue} = state;            
                            // if (action.payload.operation === "create"){
                            //     selectedId =null;
                            //     //filterValue ="";
                            // }
                            return {
                                ...state,
                                ...action.payload,
                                    //selectedId//, filterValue
                            }
                            case IDLE_LOGOUT:
                                return{
                                    ...initialState,
                                    ...action.payload
                                }
                                  case UPDATE_PROFILE_IMAGE:
                                        state.userImagePath = action.payload.profiledata['UserProfileImage']? action.payload.profiledata['UserProfileImage'] :"";                           
                                        
                                        return {
                                                 ...state,
                                                 ...action.payload
                                               }                                               
                                            default:
                                                return state
    }
}

export default LoginReducer;