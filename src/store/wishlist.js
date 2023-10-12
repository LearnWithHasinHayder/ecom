import { reactive } from 'vue'
import { authStore } from './store'
const wishlist = reactive({
    items: [],
    getWishlist() {
        return this.items
    },
    async fetchWishlistItems() {
        const apiUrl = 'http://localhost:8000/api/wishlist'
        const token = authStore.getUserToken()
        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const wishlistData = await response.json();
            this.items = wishlistData.wishlist
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    },
    async toggleWishList(product) {
        let apiUrl = 'http://localhost:8000/api/wishlist'
        let method = 'POST'
        let body = {
            product_id: product.id
        }
        const token = authStore.getUserToken()

        if (this.items.includes(product.id)) {
            this.items = this.items.filter(item => item !== product.id)
            apiUrl = `http://localhost:8000/api/wishlist/${product.id}`
            method = 'DELETE'
            body = {}
        } else {
            this.items.push(product.id)
        }

        try {
            const response = await fetch(apiUrl, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Product ID saved to wishlist:', data);
        } catch (error) {
            console.error('Error saving product ID to wishlist:', error);
        }
    },
    isWishListed(product){
        return this.items.includes(product.id)
    },
    getIcon(product){
        return this.isWishListed(product) ? '//img.icons8.com/?size=60&id=59805&format=png' : '//img.icons8.com/?size=96&id=85038&format=png'
    }
})

export { wishlist }