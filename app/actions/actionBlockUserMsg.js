import {
  BLOCK_USER_MESSAGE,
  UNBLOCK_USER_MESSAGE,
} from "../constants/actionTypes";

export const getUserMesBlocked = (myID) => async (dispatch, getState) => {
  const { db } = getState();
  if (!db || !myID) return;
  const snap = await db.ref(`blockedList/${myID}`).once("value");
  const list = snap?.val() || [];
  dispatch({
    type: BLOCK_USER_MESSAGE,
    payload: {
      newList: list,
    },
  });
};

export const blockUserMsg = (myID, userID) => async (dispatch, getState) => {
  try {
    const { db } = getState();
    if (!db || !myID) return;
    const snap = await db.ref(`blockedList/${myID}`).once("value");
    const prevList = snap?.val() || [];
    if (!prevList.includes(userID)) {
      const newList = [...prevList, userID];
      await db.ref(`blockedList/${myID}`).set(newList);
      dispatch({
        type: BLOCK_USER_MESSAGE,
        payload: {
          newList,
        },
      });
    }
  } catch {
    console.log("error actions/blockUserMsg");
  }
};

export const unBlockUserMsg = (myID, userID) => async (dispatch, getState) => {
  try {
    const { db } = getState();
    if (!db || !myID) return;
    const snap = await db.ref(`blockedList/${myID}`).once("value");
    const prevList = snap?.val() || [];
    if (prevList.includes(userID)) {
      const newList = prevList.filter((item) => item !== userID);
      await db.ref(`blockedList/${myID}`).set(newList);
      dispatch({
        type: BLOCK_USER_MESSAGE,
        payload: {
          newList,
        },
      });
    }
  } catch {
    console.log("error actions/unBlockUserMsg");
  }
};
