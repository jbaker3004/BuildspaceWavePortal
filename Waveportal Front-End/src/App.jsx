import React, { useEffect, useState } from "react";
import './App.css';
import { ethers } from "ethers";
import abi from "./Utils/WavePortal.json"


const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0xAb7748464AF099747A2a7BaA4901510703Dc0778"
  const contractABI = abi.abi
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
      } catch (error) {
        console.log(error)
        } 
    }

  /* Read how many waves from smart contract */
  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        document.querySelector('.wave-count').innerHTML = "The total wave count is: " + count;

        /*
        * Execute the actual wave from your smart contract - eg. write to blockchain
        */
        const waveTxn = await wavePortalContract.wave("this is a message");
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        document.querySelector('.wave-count').innerHTML = "The total wave count is: " + count;
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }


  const getAllWaves = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider
          const signer = provider.getSigner();
          const wavePortalContract = new ethers.Contract(contractAddress, wavePortal.abi, signer);

          const waves = await wavePortalContract.getAllWaves();

          let wavesCleaned = [];
          waves.forEach(wave => {
            wavesCleaned.push({
              address: wave.waver,
              timestamp: new Date(wave.timestamp * 1000),
              message: wave.message
            });
          });

          setAllWaves(wavesCleaned);
        } else {
          console.log("Ethereum object doesn't exist!")
        }
      } catch (error) {
        console.log(error);
      }
    }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I'm James :) I work in VC, deeply focussed on world-changing technologies.
        HMU on <a href="https://www.linkedin.com/in/james-baker3004/">Linkedin</a> if you want to chat VC, investing, tech, money, or anything!
        </div>
        <div className="bio">
         I'm a complete novice coder - this is part of my learning journey! Connect your Ethereum wallet and wave at me to keep my dev journey going!
        </div>

        

        <div className="bio wave-count"></div>

        <button className="waveButton" onClick={wave}>
          Send me a Wave!
        </button>

        {/* If there is no currentAccount render this button*/}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        
        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}

      </div>
    </div>
  );
}

export default App
