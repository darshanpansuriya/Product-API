const Shopify = require('shopify-api-node');
const product = require('./product.json');

const shopify = new Shopify({
    shopName: 'theplanetsoft-theme-development',
    accessToken: process.env.ACCESS_TOKEN
});

const location_id = 63185879247, inventory_management_ids = [];
const varaint = product.variants[0];
const media = product.media.map(img=>({
    id: img.id,
    position: img.position,
    src: img.src,
    width: img.width,
    height: img.height,
}));
const productData = {
    title: product.title,
    body_html: product.description,
    vendor: product.vendor,
    product_type: product.type,
    tags: product.tags, // Tags should be an array of strings
    handle: product.handle,
    // published: product.Published === 'true', // Convert 'true' or 'false' to boolean
    published_at: new Date(product.published_at), // Convert a date string to a JavaScript Date object
    variants: [
      {
        title: varaint.title,
        price: varaint.price, // Convert to float
        sku: varaint.sku,
        barcode: varaint.barcode,
        weight: varaint.weight, // Convert to float
        // weight_unit: varaint.WeightUnit,
        inventory_management: varaint.inventory_management,
        // inventory_policy: varaint.InventoryPolicy,
        // inventory_quantity: parseInt(varaint.InventoryQuantity), // Convert to integer
        requires_shipping: varaint.requires_shipping, // Convert 'true' or 'false' to boolean
        option1: varaint.option1,
        option2: varaint.option2,
        option3: varaint.option3,
      },
    ],
    images: media,
    // Add more product properties as needed
};
console.log()
async function createProducts() {
    try {
        const createdProduct = await shopify.product.create(productData);
        console.log(createdProduct);
        for(let variant of createdProduct.variants) {
            inventory_management_ids.push(variant.inventory_item_id);
        }
        
        for (let id of inventory_management_ids){
            const inventory_level = await shopify.inventoryLevel.adjust({
                "location_id": location_id, "inventory_item_id": id, "available_adjustment": 5
            });
            console.log(inventory_level)
        }
        console.log(`Created product with ID ${createdProduct.id}`);
    } catch (error) {
        console.error('Error creating product:', error.response ? error.response.body : error.message);
    }
}
// Call the createProducts function to create the products
// createProducts();