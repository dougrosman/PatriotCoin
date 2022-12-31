const CONNECT_AUTOMATICALLY = true;
let contract;
let signer;
let contractWithSigner;
let connected = false;
let mintingPaused = false;

if(CONNECT_AUTOMATICALLY) {
  main();
} else {
  connectButton.onclick = main;
}

async function main() {
  loadingIconConnect.style.display = "block";

  // Check website compatibility
  if(navigator.userAgent.indexOf("Safari") != -1
  && navigator.userAgent.indexOf("Chrome") == -1) {
    alert("Please switch to a desktop browser that supports Web3 (Chrome, Firefox, Brave, Edge, or Opera)");
    loadingIconConnect.style.display = "none";
    return;
  }
  console.log("Browser is Web3 compatible");

  // Check if MetaMask is installed
  if(!window.ethereum) {
    alert("No Web3 Provider detected, please install MetaMask (https://metamask.io)");
    loadingIconConnect.style.display = "none";
    return;
  }
  console.log("MetaMask is installed");

  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

  // If the network changes, refresh the page. (e.g. the user switches from mainnet to goerli)
  provider.on("network", (newNetwork, oldNetwork) => {
    if (oldNetwork) {
        window.location.reload();
    }
  });

  try {
    // (REQUIRED) Request to connect current wallet to the dApp
    await provider.send("eth_requestAccounts", []);
  } catch(error) {
    const errorMessage = "Cannot connect to wallet. There might be an issue with another browser extenstion. Try disabling some browser extensions (other than MetaMask), then attempt to reconnect."
    console.error(errorMessage, error);
    alert(errorMessage);
    loadingIconConnect.style.display = "none";
    return;
  }  
  console.log("Wallet connected");

  // Check if user is signed in to correct network
  const chainId = await provider.getNetwork();
  if(chainId.chainId != 80001) {
    alert("Please switch to the Mumbai Polygon Test Network in MetaMask. The page will refresh automatically after switching.");
    loadingIconConnect.style.display = "none";
    return;
  }
  console.log("Connected to Mumbai");
  connectionStatus.textContent = "🟢 Connected";
  connectButton.setAttribute("disabled", "true");
  signer = provider.getSigner();
  contract = new ethers.Contract(contractAddress, contractABI, provider);

  // (REQUIRED) Connect the signer to the contract
  contractWithSigner = contract.connect(signer);

  // Display the address of the signed-in wallet
  const connectedWalletAddress = await signer.getAddress();
  console.log(`Connected Wallet: ${connectedWalletAddress}`);

  // hide the loading icon
  loadingIconConnect.style.display = "none";
  connected = true;
}