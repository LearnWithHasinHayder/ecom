import {reactive, computed} from 'vue'
const cart = reactive({
    items:{},
    totalPrice:computed(()=>{
        let total = 0
        for(let id in cart.items){
            total += cart.items[id].quantity * cart.items[id].product.price
        }
        return parseFloat(total.toFixed(2))
    }),
    addItem(product){
        if(this.items[product.id]){
            this.items[product.id].quantity++
        }else{
            this.items[product.id] = {
                quantity: 1,
                product: product
            }
        }
        cart.saveCartInLocalStorage()
    },
    removeItem(product){
        if(this.items[product.id]){
            this.items[product.id].quantity--
            if(this.items[product.id].quantity==0){
                delete this.items[product.id]
            }
        }
        cart.saveCartInLocalStorage()
    },
    emptyCart(){
        this.items = {}
        cart.saveCartInLocalStorage()
    },
    saveCartInLocalStorage(){
        localStorage.setItem('cart', JSON.stringify(this.items))
        localStorage.setItem('totalPrice', this.totalPrice)
    },
    getCartFromLocalStorage(){
        this.items = JSON.parse(localStorage.getItem('cart')) || {}
    }
})
cart.getCartFromLocalStorage();
export {cart}