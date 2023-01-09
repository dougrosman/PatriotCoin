// SPDX-License-Identifier: MIT


//                                !
//            H|H|H|H|H           H__________________________________
//            H|H|H|H|H           H|* * * * * *|---------------------|
//            H|H|H|H|H           H| * * * * * |---------------------|
//            H|H|H|H|H           H|* * * * * *|---------------------|
//            H|H|H|H|H           H| * * * * * |---------------------|
//            H|H|H|H|H           H|---------------------------------|
//         ===============        H|---------------------------------|
//           /| _   _ |\          H|---------------------------------|
//           (| O   O |)          H|---------------------------------|
//           /|   U   |\          H-----------------------------------
//            |  \=/  |           H
//             \_..._/            H
//             _|\I/|_            H
//     _______/\| H |/\_______    H
//    /       \ \   / /       \   H
//   |         \ | | /         |  H
//   |          ||o||          |  H
//   |    |     ||o||     |    |  H
//   |    |     ||o||     |    |  H   Carl Pilcher
//
//
//
// Douglas Rosman, 2022

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USACOIN is ERC20 {

    mapping(address => uint256) private addressToLastMintTime;
    uint256 DAILY_ALLOWANCE = 25 * 10 ** decimals();
    uint256 MAX_BALANCE = 200 * 10 ** decimals();
    uint256 constant COOLDOWN_TIME = 86400; // 24 hours

    event MintEvent(string message, uint256 amount, uint256 newBalance, uint256 lastMintTime);

    constructor() ERC20("USACOIN", "USA") {}

    function GIVEUSACOIN() public {
        uint256 userBalance = balanceOf(msg.sender);
        require(userBalance < MAX_BALANCE, "BALANCE MAX LIMIT REACHED, PLEASE REDUCE TOKEN BALANCE");
        require(block.timestamp - addressToLastMintTime[msg.sender] > COOLDOWN_TIME, "PLEASE WAIT 24 HOURS TO RECEIVE MORE USACOIN");

        // GIVE THE DAILY ALLOWANCE (UP TO THE MAX BALANCE)
        uint256 amount = MAX_BALANCE - userBalance >= DAILY_ALLOWANCE ? DAILY_ALLOWANCE : MAX_BALANCE - userBalance;

        _mint(msg.sender, amount);
        addressToLastMintTime[msg.sender] = block.timestamp;
        emit MintEvent("USACOIN RECEIVED", amount, userBalance + amount, addressToLastMintTime[msg.sender]);
    }

    function getLastMintTime(address _addr) public view returns (uint256) {
        return addressToLastMintTime[_addr];
    }
}