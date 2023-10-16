import {reactive, computed} from 'vue'
import {Order} from './order'
import { authStore } from './store'
const cart = reactive({
    items:{},
    couponCode:'',
    discountInPercentage:0,
    discountApplied: false,
    originalPrice:0,
    totalCartItems:computed(()=>{
        let total = 0
        for(let id in cart.items){
            total += cart.items[id].quantity
        }
        return total
    }),
    totalPrice:computed(()=>{
        let total = 0
        for(let id in cart.items){
            total += cart.items[id].quantity * cart.items[id].product.price
        }
        cart.originalPrice = total
        if(cart.discountInPercentage){
            total = total - (total * cart.discountInPercentage / 100)
            cart.discountApplied = true
        }
        return parseFloat(total.toFixed(2))
    }),
    addItem(product){
        if(this.items[product.id]){
            this.items[product.id].quantity++
        }else{
            const clonedProduct= {...product}
            delete(clonedProduct.description)
            this.items[product.id] = {
                quantity: 1,
                product: clonedProduct
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
        // console.log(this.items);
    },
    checkout(){
        Order.placeorder(this.totalPrice, this.items)
        // this.emptyCart()
    },
    applyDiscount(discount){
        if(this.discountApplied){
            return
        }
        this.totalPrice = this.totalPrice - discount
    },
    async applyDiscountInPercentage(){
        if(cart.discountApplied){
            return
        }

        const apiUrl = 'http://localhost:8000/api/coupon';
        const token = authStore.getUserToken();

        const payload = {
            coupon: cart.couponCode
        };

        try{
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const couponData = await response.json();
            console.log(couponData);
            if(couponData.value!=0){
                this.discountApplied = true
                this.discountInPercentage = couponData.value
            }
        }catch(error){}


        
        
    },
    removeDiscount(){
        this.discountApplied = false
        this.discountInPercentage = 0
    }
})

cart.getCartFromLocalStorage();
export {cart}