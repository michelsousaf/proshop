import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_RESET,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_PAY_RESET,
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_MY_FAIL,
  ORDER_LIST_MY_RESET,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_SUCCESS,
  ORDER_DELIVER_FAIL,
  ORDER_DELIVER_RESET,
  VESSEL_SCHEDULE_FAIL,
  VESSEL_SCHEDULE_SUCCESS,
  VESSEL_SCHEDULE_REQUEST,
} from "../constants/orderConstants";

import {
  EXPORT_EXCEL_START,
  EXPORT_EXCEL_END,
  EXPORT_EXCEL_ERROR,
} from "../constants/exportConstants";

export const orderCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_CREATE_REQUEST:
      return {
        loading: true,
      };

    case ORDER_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        order: action.payload,
      };

    case ORDER_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case ORDER_CREATE_RESET:
      return {};

    default:
      return state;
  }
};

export const orderDetailsReducer = (
  state = { loading: true, orderItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case ORDER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case ORDER_DETAILS_SUCCESS:
      return {
        loading: false,
        order: action.payload,
      };

    case ORDER_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const orderPayReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_PAY_REQUEST:
      return {
        loading: true,
      };

    case ORDER_PAY_SUCCESS:
      return {
        loading: false,
        success: true,
      };

    case ORDER_PAY_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case ORDER_PAY_RESET:
      return {};

    default:
      return state;
  }
};

export const orderDeliverReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_DELIVER_REQUEST:
      return {
        loading: true,
      };

    case ORDER_DELIVER_SUCCESS:
      return {
        loading: false,
        success: true,
      };

    case ORDER_DELIVER_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case ORDER_DELIVER_RESET:
      return {};

    default:
      return state;
  }
};

export const orderListMyReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ORDER_LIST_MY_REQUEST:
      return {
        loading: true,
      };

    case ORDER_LIST_MY_SUCCESS:
      return {
        loading: false,
        orders: action.payload,
      };

    case ORDER_LIST_MY_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case ORDER_LIST_MY_RESET:
      return {
        orders: [],
      };

    default:
      return state;
  }
};

export const orderListReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ORDER_LIST_REQUEST:
      return {
        loading: true,
      };

    case ORDER_LIST_SUCCESS:
      return {
        loading: false,
        orders: action.payload.orders,
        page: action.payload.page,
        pages: action.payload.pages,
        has_next: action.payload.has_next,
        has_previous: action.payload.has_previous,
        total_items: action.payload.total_items,
      };

    case ORDER_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const listVesselSchedules = (state = { vessels: [] }, action) => {
  switch (action.type) {
    case VESSEL_SCHEDULE_REQUEST:
      return {
        loading: true,
      };

    case VESSEL_SCHEDULE_SUCCESS:
      return {
        loading: false,
        vessels: action.payload,
      };

    case VESSEL_SCHEDULE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case "FETCH_DATA_ERROR":
    case "FETCH_DATA_ERROR_400":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};
