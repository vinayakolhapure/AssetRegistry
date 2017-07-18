pragma solidity ^0.4.2;


contract AssetRetriever {
    function getAssetOwnerByAssetID(uint assetID) constant returns (address){
     }
}

contract SmartMortgage is AssetRetriever {
  
  AssetRetriever assetRegistry;
  
  function SmartMortgage(AssetRetriever _assetRegistry){
    assetRegistry = _assetRegistry;
  }

//State Fields
  struct Mortgage {
     uint assetId;
     uint mortgageId;
     bool isActive;
     MortgageInfo currentInfo;
     MortgageInfo[] previousInfo;
  }
  
  struct MortgageInfo {
     uint insertInfoTime; //unix time of insert - we will always append to preserve history
     address mortgagee;  //bank - lender
     address mortgagor;  // borrower
     uint loanStartDate; //unix time - solidity doesnt have dates
     uint loanAmount;
     uint loanTermMonths;
     uint interestWholePart;
     uint interestFractionPart;
  }

struct PendingMortgageChange {
    MortgageInfo pendingInfo;
    bool current_mortgagee_signoff; //signoffs will vary based on type
    bool new_mortgagee_signoff;
    bool mortgagor_signoff; // this may not always be required - e.g. banks may sell to one another
}

  uint mortgageCounter = 0;
  mapping (uint => uint[]) assetToMortgageIdMap;  //1 asset may have multiple mortgaages over time  
  mapping (uint => Mortgage) mortgageIdToMortgageMap; 
  mapping (uint => PendingMortgageChange) mortgageIdToPendingMortgageChangeMap; 

//Events
event MortgageCreated(uint mortgageId);
  
  function getRemoteAssetOwner(uint assetID) constant returns (address){
      return assetRegistry.getAssetOwnerByAssetID(assetID);
  }     
//Functions
  function createNewMortgage(uint _assetId,
                      uint _insertInfoTime,
                      address _mortgagee,
                      address _mortgagor,
                      uint _loanStartDate,
                      uint _loanAmount,
                      uint _loanTermMonths,
                      uint _interestWholePart,
                      uint _interestFractionPart
                      )
{
  //todo  need to call asset contract remotely to ensure only asset owner and others (tbd) can do this
  //todo also validate that assetId is valid
    mortgageCounter++;
    Mortgage storage m = mortgageIdToMortgageMap[mortgageCounter];
    m.assetId = _assetId;
    m.mortgageId = mortgageCounter;
    m.isActive = true;
    
    m.currentInfo.insertInfoTime = _insertInfoTime;
    m.currentInfo.mortgagee = _mortgagee;
    m.currentInfo.mortgagor = _mortgagor;
    m.currentInfo.loanStartDate = _loanStartDate;
    m.currentInfo.loanAmount = _loanAmount;
    m.currentInfo.loanTermMonths = _loanTermMonths;
    m.currentInfo.interestWholePart = _interestWholePart;
    m.currentInfo.interestFractionPart = _interestFractionPart;
    
    //add to asset map
    assetToMortgageIdMap[mortgageCounter].push(mortgageCounter);

    MortgageCreated(mortgageCounter);  //raise event
  }  
}
