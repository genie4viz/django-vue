import axios from "axios";
import api from "../Services/api.js"

import {createAsyncRequestType, createAction} from "./utils/actionCreators.js"
import {API_ROOT} from "../config.jsx";

export const SET_PAGE = "SET_PAGE";
export const setPage = pageNum => createAction(SET_PAGE, {pageNum: pageNum})

export const RESET_PAGE = "RESET_PAGE";
export const resetPage = (pageNum) => createAction(SET_PAGE, {pageNum: 1})

export const PAGINATION = createAsyncRequestType("PAGINATION")
export const PAGINATE_ADMIN = createAsyncRequestType("ADMIN_PAGINATION")

export const paginationActions = {
    request: type => createAction(type.REQUEST),
    success: (type, response) => createAction(type.SUCCESS, {data: response.data}),
    failure: (type, error) => createAction(type.FAILURE, {data: error.data})
}

export const fetchPage = (pageNum, link, type = PAGINATION) => async (dispatch, getState) => {
  try {
    dispatch(paginationActions.request(type))
    let response = await api.fetchPage(link)
    dispatch(paginationActions.success(type, response))
    dispatch(setPage(pageNum))
  } catch (e) {
    dispatch(paginationActions.failure(type, e))
  }
}
