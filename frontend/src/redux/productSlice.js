import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "product",

    initialState: {
        products: [],
        cart: null
    },

    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
        },

        setCart: (state, action) => {
            state.cart = action.payload;
        },

        clearCart: (state) => {
            state.cart = null;
        },
    }
});

export const { setProducts, setCart, clearCart } = productSlice.actions;
export default productSlice.reducer;