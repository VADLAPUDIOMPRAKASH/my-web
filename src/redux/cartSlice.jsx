import { createSlice } from '@reduxjs/toolkit';

const initialState = JSON.parse(localStorage.getItem('cart')) ?? [];

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const existingItem = state.find(item => item.id === action.payload.id);
            
            if (existingItem) {
                existingItem.quantity = (Number(existingItem.quantity) || 1) + (Number(action.payload.quantity) || 1);
            } else {
                state.push({
                    ...action.payload,
                    quantity: Number(action.payload.quantity) || 1
                });
            }
        },

        deleteFromCart(state, action) {
            return state.filter(item => item.id !== action.payload.id);
        },

        incrementQuantity(state, action) {
            const item = state.find(item => item.id === action.payload.id);
            if (item) {
                item.quantity = (Number(item.quantity) || 1) + 1;
            }
        },

        decrementQuantity(state, action) {
            const item = state.find(item => item.id === action.payload.id);
            if (item) {
                item.quantity = Math.max(1, (Number(item.quantity) || 1) - 1);
            }
        }
    }
});

export const {
    addToCart,
    deleteFromCart,
    incrementQuantity,
    decrementQuantity
} = cartSlice.actions;

export default cartSlice.reducer;