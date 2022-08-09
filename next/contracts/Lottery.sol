// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

contract Lottery {
    address public owner;
    address private bookingFactory;
    address payable[] public players;
    uint256 public lotteryId;
    mapping(uint256 => address payable) public lotteryHistory;

    constructor(address _bookingFactory) {
        owner = msg.sender;
        bookingFactory = _bookingFactory;
        lotteryId = 1;
    }

    receive() external payable {}

    function getWinnerByLottery(uint256 lottery)
        public
        view
        returns (address payable)
    {
        return lotteryHistory[lottery];
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function enter() public payable {
        require(msg.value > 0.0049 ether, "please send the required amount");
        // address of player entering lottery
        players.push(payable(msg.sender));
    }

    function enterFree(address _model) public payable onlyBookingFactory {
        // address of player being entered
        players.push(payable(_model));
    }

    function getRandomNumber() public view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(owner, block.timestamp)));
    }

    function pickWinner() public onlyowner {
        uint256 index = getRandomNumber() % players.length;
        players[index].transfer(address(this).balance);

        lotteryHistory[lotteryId] = players[index];
        lotteryId++;

        // reset the state of the contract
        players = new address payable[](0);
    }

    modifier onlyowner() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyBookingFactory() {
        require(msg.sender == bookingFactory);
        _;
    }
}
