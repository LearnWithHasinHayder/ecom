//create home component
<script setup>
import { ref, reactive, onBeforeMount } from 'vue'
import axios from 'axios'
import { Order } from '../store/order'

onBeforeMount(() => {
    Order.fetchOrders()
})

const toggleProducts = (orderId) => {
    const order = Order.orders.find(order => order.id === orderId);
    if (order) {
        order.showProducts = !order.showProducts;
    }
};
</script>
<template>
    <div class="bg-white">
        <div class="mx-auto px-12 py-8 ">
            <h2 class="text-2xl font-bold tracking-tight text-gray-900">Cart</h2>
            <p class="my-10">
            </p>
        </div>
        <div class="px-12 py-8 ">
            <div class="my-2" v-for="order in Order.orders" :key="order.id">
                <div class="order-info flex justify-between w-full">
                    <p class="w-1/3"><strong>Order ID:</strong> {{ order.id }}</p>
                    <p class="w-1/3"><strong>Total Amount:</strong> ${{ order.totalAmount }}</p>
                    <p class="text-right w-1/3">
                        <button @click="toggleProducts(order.id)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ">
                            Show Detail
                        </button>
                    </p>

                    <hr>
                </div>

                <!-- Show products for the current order when toggled -->
                <div v-if="order.showProducts" class="border my-5 p-5">
                    <div class="flex items-center my-3" v-for="product in order.products" :key="product.id">
                        <p class="w-2/3">
                            <router-link :to="{ name: 'product', params: { id: product.id } }">
                                {{ product.title }}
                            </router-link>
                        </p>
                        <p class="w-[100px]">{{ product.price }}</p>
                        <p>Quantity: {{ product.quantity }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>