// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";
import "./Lottery.sol";

contract BookingFactory is ReentrancyGuard {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    Counters.Counter public bookingId;
    address payable private _owner;
    //  booking number mapped to models address
    mapping(uint256 => address) public noShows;
    uint256[] collectDeposits;

    enum Status {
        Initiated,
        Completed,
        Cancelled
    }

    event BookingCreated(uint256 indexed bookingId);

    // an individual booking
    struct Booking {
        // status of booking
        Status status;
        // initiator of booking
        address client;
        // wallets mapped to deposits
        mapping(address => uint256) models;
        // address of models who have been paid
        mapping(address => bool) paid;
        // total amount of models
        Counters.Counter totalModels;
        // total amount of models
        Counters.Counter totalPaid;
        // date of booking
        uint256 startDate;
        // initiator of booking
        address[] wallets;
    }

    mapping(uint256 => Booking) bookings;

    constructor() {
        _owner = payable(msg.sender);
    }

    receive() external payable {}

    modifier OnlyClient(uint256 _bookingNumber) {
        require(
            msg.sender == bookings[_bookingNumber].client,
            "Only client can call"
        );
        _;
    }

    modifier OnlyOwner() {
        require(msg.sender == _owner, "Only the owner can call");
        _;
    }

    modifier StatusInitiated(uint256 _bookingNumber) {
        require(
            bookings[_bookingNumber].status == Status.Initiated,
            "Must be satus initiated"
        );
        _;
    }

    modifier ModelPaid(uint256 _bookingNumber, address _model) {
        require(
            bookings[_bookingNumber].paid[_model] == false,
            "Model already paid"
        );
        _;
    }

    function enterFree(Lottery _lottery, address _model) public {
        _lottery.enterFree(_model);
    }

    function getSum(uint256[] memory _deposits)
        public
        pure
        returns (uint256 sum)
    {
        for (uint256 i = 0; i < _deposits.length; i++) {
            sum = sum + _deposits[i];
        }
        return sum;
    }

    // check if model exists in wallets array
    function checkIfExists(uint256 _bookingNumber)
        internal
        view
        returns (bool exists)
    {
        for (uint256 i = 0; i < bookings[_bookingNumber].wallets.length; i++) {
            if (bookings[_bookingNumber].wallets[i] == msg.sender) {
                return true;
            }
        }
    }

    function getBalance() public view returns (uint256 balance) {
        return address(this).balance;
    }

    // add require to make sure msg.value is 25% of _fees
    function createBooking(
        address[] memory _models,
        uint256[] memory _deposits,
        uint256 _startDate
    ) public payable {
        require(
            msg.value == getSum(_deposits),
            "Please ensure the correct deposit is sent"
        );

        require(
            _startDate >= block.timestamp - 2000 seconds,
            "Cannot book in the past"
        );

        bookingId.increment();

        Booking storage b = bookings[bookingId.current()];
        b.status = Status.Initiated;
        b.client = msg.sender;
        b.startDate = _startDate;
        b.wallets = _models;

        for (uint256 i = 0; i < _models.length; i++) {
            b.totalModels.increment();
            b.models[_models[i]] = _deposits[i];
            b.paid[_models[i]] = false;
        }

        emit BookingCreated(bookingId.current());
    }

    function addModel(
        uint256 _bookingNumber,
        address _model,
        uint256 _deposit
    ) public payable OnlyClient(_bookingNumber) {
        require(
            msg.value == _deposit,
            "Please ensure the correct deposit is sent"
        );
        Booking storage b = bookings[_bookingNumber];
        if (b.status == Status.Completed) {
            b.status = Status.Initiated;
        }
        b.totalModels.increment();
        b.models[_model] = _deposit;
    }

    function payModel(
        address payable _model,
        Lottery _lottery,
        uint256 _bookingNumber
    )
        public
        payable
        StatusInitiated(_bookingNumber)
        OnlyClient(_bookingNumber)
        ModelPaid(_bookingNumber, _model)
    {
        require(
            msg.value == bookings[_bookingNumber].models[_model].mul(5),
            "Please ensure the correct fee is sent"
        );

        payable(_model).transfer(msg.value);
        modelCheckIn(_model, _lottery, _bookingNumber);
    }

    function modelCheckIn(
        address payable _model,
        Lottery _lottery,
        uint256 _bookingNumber
    )
        public
        payable
        StatusInitiated(_bookingNumber)
        OnlyClient(_bookingNumber)
        ModelPaid(_bookingNumber, _model)
    {
        uint256 deposit = bookings[_bookingNumber].models[_model];
        address payable lotteryAddress = payable(address(_lottery));
        payable(lotteryAddress).transfer(deposit.div(20));
        payable(_owner).transfer(deposit.sub(deposit.div(20)));
        Booking storage b = bookings[_bookingNumber];
        b.paid[_model] = true;
        b.totalPaid.increment();

        if (b.totalPaid.current() == b.totalModels.current()) {
            b.status = Status.Completed;
        }

        enterFree(_lottery, _model);
    }

    function cancelBooking(
        uint256 _bookingNumber,
        address payable[] memory _models
    )
        public
        payable
        StatusInitiated(_bookingNumber)
        OnlyClient(_bookingNumber)
    {
        for (
            uint256 i = 0;
            i < bookings[_bookingNumber].totalModels.current();
            i++
        ) {
            if (bookings[_bookingNumber].paid[_models[i]] == true) {
                continue;
            } else {
                payable(_models[i]).transfer(
                    bookings[_bookingNumber].models[_models[i]].div(2)
                );
                payable(_owner).transfer(
                    bookings[_bookingNumber].models[_models[i]].div(2)
                );
            }
        }
        Booking storage b = bookings[_bookingNumber];
        b.status = Status.Cancelled;
    }

    function modelCancels(uint256 _bookingNumber)
        public
        payable
        StatusInitiated(_bookingNumber)
        ModelPaid(_bookingNumber, msg.sender)
    {
        require(
            checkIfExists(_bookingNumber),
            "Only Model can cancel own request"
        );

        payable(bookings[_bookingNumber].client).transfer(
            bookings[_bookingNumber].models[msg.sender]
        );

        // remove wallet from wallets array
        for (uint256 i = 0; i < bookings[_bookingNumber].wallets.length; i++) {
            if (bookings[_bookingNumber].wallets[i] == msg.sender) {
                bookings[_bookingNumber].wallets[i] = bookings[_bookingNumber]
                    .wallets[bookings[_bookingNumber].wallets.length - 1];
                // Remove the last element
                bookings[_bookingNumber].wallets.pop();
            }
        }

        Booking storage b = bookings[_bookingNumber];
        b.totalModels.decrement();

        if (b.totalPaid.current() == b.totalModels.current()) {
            b.status = Status.Completed;
        }
    }


    function reportAsNoShow(uint256 _bookingNumber, address _model)
        public
        payable
        OnlyClient(_bookingNumber)
        ModelPaid(_bookingNumber, _model)
    {
        require(
            block.timestamp >= bookings[_bookingNumber].startDate + 1 days,
            "24 hours after booking"
        );

        require(
            block.timestamp <= bookings[_bookingNumber].startDate + 7 days,
            "7 days after a booking "
        );

        noShows[_bookingNumber] = _model;
    }

    function approveRefundForNoShow(uint256 _bookingNumber, address _model)
        public
        payable
        OnlyOwner
    {
        payable(bookings[_bookingNumber].client).transfer(
            bookings[_bookingNumber].models[_model]
        );

        Booking storage b = bookings[_bookingNumber];
        if (b.status != Status.Completed) {
            b.status == Status.Completed;
        }
    }

    function checkForDeposists(uint256 _bookingNumber)
        public
        view
        OnlyOwner
        returns (uint256 deposit, address model)
    {
        require(
            block.timestamp >= bookings[_bookingNumber].startDate + 15 days,
            "Can check for deposists 15 days after booking"
        );

        for (uint256 i = 0; i < bookings[_bookingNumber].wallets.length; i++) {
            if (
                bookings[_bookingNumber].paid[
                    bookings[_bookingNumber].wallets[i]
                ] == false
            ) {
                if (
                    noShows[_bookingNumber] !=
                    bookings[_bookingNumber].wallets[i]
                ) {
                    return (
                        bookings[_bookingNumber].models[
                            bookings[_bookingNumber].wallets[i]
                        ],
                        bookings[_bookingNumber].wallets[i]
                    );
                }
            }
        }
    }

    function payOwner(
        uint256 _bookingNumber,
        uint256 _deposit,
        address _model
    ) public payable OnlyOwner {
        payable(_owner).transfer(_deposit);
        bookings[_bookingNumber].paid[_model] == true;
        bookings[_bookingNumber].totalPaid.increment();
        if (
            bookings[_bookingNumber].totalPaid.current() ==
            bookings[_bookingNumber].totalModels.current()
        ) {
            Booking storage b = bookings[_bookingNumber];
            b.status = Status.Completed;
        }
    }
}
