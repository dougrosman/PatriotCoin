pragma solidity >= 0.4.22 < 0.7.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract Erc20Demo is ERC20 {
    
    constructor() public ERC20("Erc20demo", "ERC") {
        _setupDecimals(0);
        _mint(msg.sender, 1000 * (10 ** uint256(decimals())));
        _transfer(msg.sender, address(this), 1000);
    }
    
    // this pays out directly from the contract
    function reward(uint256 amt) public {
        uint256 contractBalance = balanceOf(address(this));
        require(amt > 0, "No reward??");
        require(amt <= contractBalance, "Not enough tokens in the reserve");
        _transfer(address(this), msg.sender, amt);
    }
}