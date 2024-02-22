pragma solidity ^0.6.0;

import "./Ownable.sol";
import "./Product.sol";

contract ProductManager is Ownable {
    enum SupplyChainState {
        Created,
        Paid,
        Deivered
    }

    struct ProductWrapper {
        Product _product;
        string _identifier;
        uint _productPrice;
        ProductManager.SupplyChainState _state;
    }

    mapping(uint => ProductWrapper) public products;
    uint productIndex;

    event SupplyChainStep(
        uint _productIndex,
        uint _step,
        address _productAddress
    );

    function createProduct(
        string memory _identifier,
        uint _productPrice
    ) public onlyOwner {
        Product product = new Product(this, _productPrice, productIndex);
        products[productIndex]._product = product;
        products[productIndex]._identifier = _identifier;
        products[productIndex]._productPrice = _productPrice;
        products[productIndex]._state = SupplyChainState.Created;
        emit SupplyChainStep(
            productIndex,
            uint(products[productIndex]._state),
            address(product)
        );
        productIndex++;
    }

    function doPayment(uint _productIndex) public payable {
        require(
            products[_productIndex]._productPrice == msg.value,
            "ProductManager: only full payments accepted"
        );
        require(
            products[_productIndex]._state == SupplyChainState.Created,
            "ProductManager: product is further in the chain"
        );
        products[_productIndex]._state = SupplyChainState.Paid;
        emit SupplyChainStep(
            productIndex,
            uint(products[productIndex]._state),
            address(products[_productIndex]._product)
        );
    }

    function doDelivery(uint _productIndex) public onlyOwner {
        require(
            products[_productIndex]._state == SupplyChainState.Paid,
            "ProductManager: product is further in the chain"
        );
        products[_productIndex]._state = SupplyChainState.Deivered;
        emit SupplyChainStep(
            productIndex,
            uint(products[productIndex]._state),
            address(products[_productIndex]._product)
        );
    }
}
