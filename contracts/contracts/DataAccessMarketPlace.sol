// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract DataAccessMarketplace is Ownable, ReentrancyGuard {
    uint256 private _currentListingId;

    struct DataListing {
        uint256 id;
        address provider;
        string title;
        string category;
        uint256 price;
        string size;
        string records;
        bool verified;
        string description;
        string accessEndpoint;
        uint256 lastUpdated;
        uint256 rating;
        uint256 reviews;
        bool active;
        AccessType accessType;
        uint256 accessDuration;
    }

    struct Category {
        string id;
        string name;
        uint256 count;
        bool active;
    }

    struct Review {
        address reviewer;
        uint256 rating;
        string comment;
        uint256 timestamp;
    }

    enum AccessType { 
        TimeBasedSubscription,
        PermanentAccess,
        QueryBased
    }

    // State variables
    mapping(uint256 => DataListing) public listings;
    mapping(string => Category) public categories;
    mapping(uint256 => Review[]) public listingReviews;
    mapping(address => uint256[]) public providerListings;
    mapping(address => uint256[]) public buyerPurchases;
    string[] public categoryIds;

    // Events
    event ListingCreated(uint256 indexed id, address indexed provider, string title, uint256 price);
    event ListingUpdated(uint256 indexed id, string title, uint256 price);
    event ReviewAdded(uint256 indexed listingId, address indexed reviewer, uint256 rating);
    event PurchaseCompleted(uint256 indexed listingId, address indexed buyer, uint256 price);
    event CategoryAdded(string id, string name);

    constructor() Ownable(msg.sender) ReentrancyGuard() {
        // Initialize default categories
        _addCategory("all", "All Data");
        _addCategory("financial", "Financial");
        _addCategory("healthcare", "Healthcare");
        _addCategory("retail", "Retail");
        _addCategory("social", "Social Media");
    }
    function createListing(
        string memory _title,
        string memory _category,
        uint256 _price,
        string memory _size,
        string memory _records,
        string memory _description,
        string memory _accessEndpoint,
        AccessType _accessType,
        uint256 _accessDuration
    ) external returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(categories[_category].active, "Invalid category");
        require(bytes(_accessEndpoint).length > 0, "Access endpoint required");

        _currentListingId++;
        uint256 listingId = _currentListingId;
        
        listings[listingId] = DataListing({
            id: listingId,
            provider: msg.sender,
            title: _title,
            category: _category,
            price: _price,
            size: _size,
            records: _records,
            verified: false,
            description: _description,
            accessEndpoint: _accessEndpoint,
            lastUpdated: block.timestamp,
            rating: 0,
            reviews: 0,
            active: true,
            accessType: _accessType,
            accessDuration: _accessDuration
        });

        providerListings[msg.sender].push(listingId);
        categories[_category].count++;

        emit ListingCreated(listingId, msg.sender, _title, _price);
        return listingId;
    }

    function purchaseAccess(uint256 _listingId) external payable nonReentrant {
        DataListing storage listing = listings[_listingId];
        require(listing.active, "Listing not active");
        require(msg.value >= listing.price, "Insufficient payment");

        // Transfer payment to provider
        payable(listing.provider).transfer(msg.value);
        
        // Record purchase
        buyerPurchases[msg.sender].push(_listingId);

        emit PurchaseCompleted(_listingId, msg.sender, listing.price);
    }

    function addReview(
        uint256 _listingId,
        uint256 _rating,
        string memory _comment
    ) external {
        require(listings[_listingId].active, "Listing not active");
        require(_rating >= 10 && _rating <= 50, "Rating must be between 1.0 and 5.0");
        require(hasPurchased(msg.sender, _listingId), "Must purchase to review");

        Review memory review = Review({
            reviewer: msg.sender,
            rating: _rating,
            comment: _comment,
            timestamp: block.timestamp
        });

        listingReviews[_listingId].push(review);
        
        // Update listing rating
        DataListing storage listing = listings[_listingId];
        uint256 totalRating = listing.rating * listing.reviews + _rating;
        listing.reviews++;
        listing.rating = totalRating / listing.reviews;

        emit ReviewAdded(_listingId, msg.sender, _rating);
    }

    function getListingsByCategory(string memory _category) 
        external 
        view 
        returns (DataListing[] memory) 
    {
        uint256 count = 0;
        for (uint256 i = 1; i <= _currentListingId; i++) {
            if (listings[i].active && 
                (keccak256(bytes(_category)) == keccak256(bytes("all")) || 
                keccak256(bytes(listings[i].category)) == keccak256(bytes(_category)))) {
                count++;
            }
        }

        DataListing[] memory categoryListings = new DataListing[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= _currentListingId; i++) {
            if (listings[i].active && 
                (keccak256(bytes(_category)) == keccak256(bytes("all")) || 
                keccak256(bytes(listings[i].category)) == keccak256(bytes(_category)))) {
                categoryListings[index] = listings[i];
                index++;
            }
        }

        return categoryListings;
    }

    function getListingReviews(uint256 _listingId) 
        external 
        view 
        returns (Review[] memory) 
    {
        return listingReviews[_listingId];
    }

    function hasPurchased(address _buyer, uint256 _listingId) 
        public 
        view 
        returns (bool) 
    {
        uint256[] memory purchases = buyerPurchases[_buyer];
        for (uint256 i = 0; i < purchases.length; i++) {
            if (purchases[i] == _listingId) {
                return true;
            }
        }
        return false;
    }

    function getCurrentListingId() external view returns (uint256) {
        return _currentListingId;
    }

    // Admin functions
    function _addCategory(string memory _id, string memory _name) internal {
        categories[_id] = Category({
            id: _id,
            name: _name,
            count: 0,
            active: true
        });
        categoryIds.push(_id);
    }

    function addCategory(string memory _id, string memory _name) 
        external 
        onlyOwner 
    {
        _addCategory(_id, _name);
        emit CategoryAdded(_id, _name);
    }
}