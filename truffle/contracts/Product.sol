pragma solidity ^0.6.0;

import "./ProductManager.sol";

contract Product {
    uint public priceInWei;
    uint public pricePaid;
    uint public index;

    ProductManager parentContract;

    constructor(
        ProductManager _parentContract,
        uint _priceInWei,
        uint _index
    ) public {
        priceInWei = _priceInWei;
        index = _index;
        parentContract = _parentContract;
    }

    receive() external payable {
        require(pricePaid == 0, "Product: item is already paid");
        require(priceInWei == msg.value, "Product: only full payments allowed");
        pricePaid += msg.value;
        (bool success, ) = address(parentContract).call.value(msg.value)(
            abi.encodeWithSignature("doPayment(uint256)", index)
        );
        require(success, "Product: the transaction failed");
    }

    fallback() external {}
}
