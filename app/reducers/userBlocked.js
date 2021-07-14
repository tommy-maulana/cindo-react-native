import {
  BLOCK_USER_MESSAGE,
  UNBLOCK_USER_MESSAGE,
} from "../constants/actionTypes";

export const userBlocked = (state = [], action) => {
  switch (action.type) {
    case BLOCK_USER_MESSAGE:
      return action.payload.newList;
    default:
      return state;
  }
};
