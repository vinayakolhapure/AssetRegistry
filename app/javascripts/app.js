// Import the page's CSS. Webpack will know what to do with it.
//import "../stylesheets/app.css";
// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

// Import our contract artifacts and turn them into usable abstractions.
import asset_artifacts from '../../build/contracts/AssetRegistry.json';

// MetaCoin is our usable abstraction, which we'll use through the code below.
var AssetRegistry = contract(asset_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    AssetRegistry.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];
      console.log("Coinbase: " + web3.eth.coinbase);
      //self.refreshBalance();
    });
  },

  /*setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },*/

 /* refreshBalance: function() {
    var self = this;

    var meta;
    AssetRegistry.deployed().then(function(instance) {
      meta = instance;
      return web3.eth.coinbase//meta.createAsset(1, 1, 1, web3.eth.coinbase, {from: web3.eth.coinbase});
    }).then(function(value) {
      var balance_element = document.getElementById("balance");
      balance_element.innerHTML = value;
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },*/

  /*getAsset: function() {
    var self = this;

    var assetId = parseInt(document.getElementById("assetId").value);
    //var receiver = document.getElementById("receiver").value;

    //this.setStatus("Initiating transaction... (please wait)");

    var meta;
    AssetRegistry.deployed().then(function(instance) {
      meta = instance;
      return meta.getAssetByAssetID.call(assetId);
    }).then(function(returnVal) {
	  console.log(returnVal);
      var balance_element = document.getElementById("balance");
      balance_element.innerHTML = returnVal;
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    });
  },*/

  searchAssetByID: function() {
    var self = this;
    var searchID = parseInt(document.getElementById("searchID").value);
    var meta;
    AssetRegistry.deployed().then(function(instance) {
    meta = instance;
    return meta.getAssetByAssetID.call(searchID);
    }).then(function(returnVal) {
	    console.log(returnVal);
      var searchResult = document.getElementById("searchResult");
      if(returnVal[4]!='0x0000000000000000000000000000000000000000'){
        var li = document.createElement('LI');
        li.className += "list-group-item";
        li.innerHTML = 'Asset ID: ' + returnVal[0] + ', Block: ' + returnVal[1] + ', Borough: ' + returnVal[2] + ', Lot: ' + returnVal[3] + ', Current Owner: ' + returnVal[4];
        searchResult.appendChild(li);
      } else{
        var errorInput = document.createElement('P');
        errorInput.innerHTML = 'No asset with ID: ' + returnVal[0] + ' exists on the network.';
        searchResult.appendChild(errorInput);
      }
    }).catch(function(e) {
      console.log(e);
    });
  },

  getAssetID: function() {
    var self = this;
    var block = parseInt(document.getElementById("getBlock").value);
    var borough = parseInt(document.getElementById("getBorough").value);
    var lot = parseInt(document.getElementById("getLot").value);
    var meta;
    console.log(block + ', ' + borough + ', ' + lot);
    AssetRegistry.deployed().then(function(instance) {
    meta = instance;
    return meta.getAssetIDByBBL.call(block,borough,lot);
    }).then(function(returnVal) {
	    console.log(returnVal);
      var returnAssetID = document.getElementById("returnAssetID");
      returnAssetID.innerHTML = 'Asset ID: ' + returnVal;
    }).catch(function(e) {
      console.log(e);
    });
  },

  updateAsset: function() {
    var self = this;
    var newOwner = document.getElementById("newOwner").value;
    var assetToUpdate = parseInt(document.getElementById("assetToUpdate").value);
    var meta;
    console.log(newOwner + ', ' + assetToUpdate);
    AssetRegistry.deployed().then(function(instance) {
    meta = instance;
    //return meta.createAsset(1,2,3, web3.eth.coinbase, {from: web3.eth.coinbase});
    return meta.updateAssetInfo(newOwner,assetToUpdate, {from: web3.eth.coinbase});
    }).then(function(returnVal) {
	    console.log(returnVal);
      var result = document.getElementById("updateResult");
      result.innerHTML = 'Asset updated!';
    }).catch(function(e) {
      console.log(e);
    });
  },

  createAsset: function() {
    console.log("Called");
    var self = this;
    var block = parseInt(document.getElementById("block").value);
	  var borough = parseInt(document.getElementById("borough").value);
	  var lot = parseInt(document.getElementById("lot").value);
	
    var meta;
    AssetRegistry.deployed().then(function(instance) {
      meta = instance;
      return meta.createAsset(block, borough, lot, web3.eth.coinbase, {from: web3.eth.coinbase});
    }).then(function(returnVal) {
	    console.log(returnVal);
      console.log("AFTER RETURNVAL");	  
	    console.log(returnVal.logs);
    }).catch(function(e) {
      console.log(e);
	    console.log("ERROR CREATING ASSET");
      //self.setStatus("UNAUTHORIZED USER ACCOUNT");
    });
  },
  /*
  var li = document.createElement('LI');
        li.className += "list-group-item";
        li.innerHTML = 'Asset ID: ' + returnVal[0] + ', Block: ' + returnVal[1] + ', Borough: ' + returnVal[2] + ', Lot: ' + returnVal[3] + ', Current Owner: ' + returnVal[4];
        searchResult.appendChild(li);
  */ 
  getLogs: function() {
	var meta;
  var heading = document.getElementById("panel_creation_logs");
  var h3=document.createElement("h3");
  h3.innerHTML="";
  h3.innerHTML="All Created Assets";
  heading.appendChild(h3);
	AssetRegistry.deployed().then(function(instance) {
		meta = instance;
		var events = meta.allEvents({fromBlock: 0, toBlock: 'latest'}, function(error,log){
			if(!error){
				console.log(log.event);
        if(log.event=='AssetCreated'){
          var logs = document.getElementById("logs");
          var logList = document.createElement('LI');
          logList.className += "list-group-item";
          logList.innerHTML = 'Asset ID: ' + log.args.assetId + ', Block: ' + log.args.block + ', Borough: ' + log.args.borough + ', Lot: ' + log.args.lot;
          logs.appendChild(logList);
        }
      }
		});
		events.stopWatching();//Don't know if this works.
	});
  }
}; 
  

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
