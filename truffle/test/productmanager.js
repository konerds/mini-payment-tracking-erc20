const ProductManager = artifacts.require('ProductManager');
contract('ProductManager', (accounts) => {
    it('should be able to create the Product', async () => {
        const productManagerInstance = await ProductManager.deployed();
        const productName = 'Product 1';
        const productPrice = 500;
        const result = await productManagerInstance.createProduct(productName, productPrice, { from: accounts[0] });
        assert.equal(result.logs[0].args._productIndex, 0, "It's not the first product");
        const product = await productManagerInstance.products(0);
        assert.equal(product._identifier, productName, 'The product name is different');
    });
});
