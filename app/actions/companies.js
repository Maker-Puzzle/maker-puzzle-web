import * as types from '../types';
import { Maker, Company } from '../services';

export function companyPortfoiloEditorStart() {
  return {
    type: types.COMPANY_PORTFOLIO_EDITOR_START
  }
}

export function companyPortfoiloEditorCancel() {
  return {
    type: types.COMPANY_PORTFOLIO_EDITOR_CANCEL
  }
}

export function productEditorStart() {
  return {
    type: types.PRODUCT_EDITOR_START
  }
}

export function productEditorCancel() {
  return {
    type: types.PRODUCT_EDITOR_CANCEL
  }
}

export function companyPortfoiloSubmit(portfolio) {
  return async (dispatch, getState) => {
    const { company: { company: { link_name }} } = getState();
    const res = await Company().submitPortfolio({ link_name, data:portfolio });
    if (res.status === 200) {
      dispatch({type:types.COMPANY_PORTFOLIO_EDIT_SUCCESS, data: res.data});
    }
    else {
      dispatch({type:types.COMPANY_PORTFOLIO_EDIT_FAILURE});
    } 
    return res;
  };
}

export function productSubmit(product) {
  return async (dispatch, getState) => {
    const { company, user } = getState();
    const res = await Company().submitProduct({link_name: company.company.link_name, data:product});
    if (res.status === 200) {
      dispatch({type:types.PRODUCT_EDIT_SUCCESS, data: res.data});
    }
    else {
      dispatch({type:types.PRODUCT_EDIT_FAILURE});
    } 
    return res;
  };
}