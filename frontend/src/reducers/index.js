
const initialState= {
  isLogged: undefined,
  uname: "",
  activity: [],
  assets: [],
  starredAssets: [],
  recentAssets: [],
  groups: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SESSION_ACTIVE" :
      return {...state,isLogged:true,uname:action.data.uname};
    case "SESSION_INACTIVE" :  
      return {...state,isLogged:false};
    case "GET_ASSETS_SUCCESS" :
      return {
        ...state,
        assets:action.data,
        deleteAssetSuccess:undefined,
        addAssetToStarredSuccess:undefined,
        removeAssetFromStarredSuccess:undefined,
        addFolderSuccess:undefined,
        uploadFileSuccess:undefined,
        shareAssetSuccess:undefined
      };
    case "GET_ASSETS_FAILURE" :  
      return state;
    case "GET_STARRED_ASSETS_SUCCESS" :
      return {
        ...state,
        starredAssets:action.data,
        deleteAssetSuccess:undefined,
        addAssetToStarredSuccess:undefined,
        removeAssetFromStarredSuccess:undefined,
        addFolderSuccess:undefined,
        uploadFileSuccess:undefined,
        shareAssetSuccess:undefined
      };
    case "GET_STARRED_ASSETS_FAILURE" :  
      return state;
    case "GET_RECENT_ASSETS_SUCCESS" :
      return {
        ...state,
        recentAssets:action.data,
        deleteAssetSuccess:undefined,
        addAssetToStarredSuccess:undefined,
        removeAssetFromStarredSuccess:undefined,
        addFolderSuccess:undefined,
        uploadFileSuccess:undefined,
        shareAssetSuccess:undefined
      };
    case "GET_RECENT_ASSETS_FAILURE" :  
      return state;
    case "ADD_ASSET_SUCCESS" :
      if(action.isDir) {
        return {...state,addFolderSuccess:true};
      } else {
        return {...state,uploadFileSuccess:true};
      }
    case "ADD_ASSET_FAILURE" :  
      if(action.isDir) {
        return {...state,addFolderSuccess:false};
      } else {
        return {...state,uploadFileSuccess:false};
      }
    case "STAR_ASSET_SUCCESS" :
      if(action.isStarred) {
        return {...state,addAssetToStarredSuccess:true};
      } else {
        return {...state,removeAssetFromStarredSuccess:true};
      }
    case "STAR_ASSET__FAILURE" :  
      if(action.isStarred) {
        return {...state,addAssetToStarredSuccess:false};
      } else {
        return {...state,removeAssetFromStarredSuccess:false};
      }
    case "SHARE_ASSET_SUCCESS" :
      return {...state,shareAssetSuccess:true};
    case "SHARE_ASSET__FAILURE" :  
      return {...state,shareAssetSuccess:false};
    case "DELETE_ASSET_SUCCESS" :
      return {...state,deleteAssetSuccess:true};
    case "DELETE_ASSET_FAILURE" :  
      return {...state,deleteAssetSuccess:false};
    case "GET_GROUPS_SUCCESS" :
      return {
        ...state,
        groups:action.data,
        deleteGroupSuccess:undefined,
        addGroupSuccess:undefined,
        updateGroupSuccess:undefined,
        addRemoveMemberSuccess:undefined
      };
    case "GET_GROUPS_FAILURE" :  
      return state;
    case "ADD_GROUP_SUCCESS" :
      return {
        ...state,
        addGroupSuccess:true,
        deleteGroupSuccess:undefined,
        getGroupByIdSuccess:undefined,
        updateGroupSuccess:undefined,
        addRemoveMemberSuccess:undefined
      };
    case "ADD_GROUP_FAILURE" :  
      return {
        ...state,
        addGroupSuccess:false,
        deleteGroupSuccess:undefined,
        getGroupByIdSuccess:undefined,
        updateGroupSuccess:undefined,
        addRemoveMemberSuccess:undefined
      };
    case "UPDATE_GROUP_SUCCESS" :
      return {
        ...state,updateGroupSuccess:true,
        deleteGroupSuccess:undefined,
        getGroupByIdSuccess:undefined,
        addGroupSuccess:undefined,
        addRemoveMemberSuccess:undefined
      };
    case "UPDATE_GROUP_FAILURE" :  
      return {
        ...state,updateGroupSuccess:false,
        deleteGroupSuccess:undefined,
        getGroupByIdSuccess:undefined,
        addGroupSuccess:undefined,
        addRemoveMemberSuccess:undefined
      };
    case "DELETE_GROUP_SUCCESS" :
      return {
        ...state,deleteGroupSuccess:true,
        updateGroupSuccess:undefined,
        getGroupByIdSuccess:undefined,
        addGroupSuccess:undefined,
        addRemoveMemberSuccess:undefined
      };
    case "DELETE_GROUP_FAILURE" :  
      return {
        ...state,deleteGroupSuccess:false,
        updateGroupSuccess:undefined,
        getGroupByIdSuccess:undefined,
        addGroupSuccess:undefined,
        addRemoveMemberSuccess:undefined
      };
    case "GET_GROUP_BY_ID_SUCCESS" :
      return {
        ...state,getGroupByIdSuccess:true,getGroupByIdData:action.data,
        updateGroupSuccess:undefined,
        deleteGroupSuccess:undefined,
        addGroupSuccess:undefined,
        addRemoveMemberSuccess:undefined
      };
    case "GET_GROUP_BY_ID_FAILURE" :  
      return {
        ...state,getGroupByIdSuccess:false,
        updateGroupSuccess:undefined,
        deleteGroupSuccess:undefined,
        addGroupSuccess:undefined,
        addRemoveMemberSuccess:undefined
      };
    case "ADD_REMOVE_MEMBER_SUCCESS" :
      return {
        ...state,addRemoveMemberSuccess:true,
        updateGroupSuccess:undefined,
        deleteGroupSuccess:undefined,
        addGroupSuccess:undefined,
        getGroupByIdSuccess:undefined
      };
    case "ADD_REMOVE_MEMBER_FAILURE" :  
      return {
        ...state,addRemoveMemberSuccess:false,
        updateGroupSuccess:undefined,
        deleteGroupSuccess:undefined,
        addGroupSuccess:undefined,
        getGroupByIdSuccess:undefined
      };
    case "UPDATE_USER_PROFILE_SUCCESS" :
      return {
        ...state,updateUserProfileSuccess:true
      };
    case "UPDATE_USER_PROFILE_FAILURE" :  
      return {
        ...state,updateUserProfileSuccess:false
      };
    case "GET_USER_PROFILE_SUCCESS" :
      return {
        ...state,
        profile:action.data,
        updateUserProfileSuccess:undefined
      };
    case "GET_USER_PROFILE_FAILURE" :  
      return {
        ...state,
        updateUserProfileSuccess:undefined
      };
    case "GET_USER_ACTIVITY_SUCCESS" :
      return {
        ...state,
        activity:action.data,
        updateUserProfileSuccess:undefined
      };
    case "GET_USER_ACTIVITY_FAILURE" :  
      return {
        ...state,
        updateUserProfileSuccess:undefined
      };
    default : 
      return state;
  }
};

export default reducer;
