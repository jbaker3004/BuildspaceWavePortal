import React, { useEffect, useState } from "react";
import './App.css';
import { ethers } from "ethers";
import abi from "./Utils/WavePortal.json"


const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [tweetValue, setTweetValue] = useState("")
  const contractAddress = "0x980800Fd7fb2E3df68886f855bf4B4771D1678a4"
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

        /*
        * Execute the actual wave from your smart contract - eg. write to blockchain
        */
        const waveTxn = await wavePortalContract.wave(tweetValue, {gasLimit:300000});
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
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
        * Call the getAllWaves method from your Smart Contract
        */
        const waves = await wavePortalContract.getAllWaves();
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        document.querySelector('.wave-count').innerHTML = "The total wave count is: " + count;

        /*
        * We only need address, timestamp, and message in our UI so let's
        * pick those out
        */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
        * Store our data in React State
        */
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
    getAllWaves();
  }, [])

  useEffect(() => {
    const onNewWave = (from, timestamp, message) => {
        console.log("NewWave", from, timestamp, message);
        setAllWaves((prevState) => [
          ...prevState,
          {
            address: from,
            timestamp: new Date(timestamp * 1000),
            message: message,
          },
        ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      let wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on("NewWave", onNewWave);
    } 
    
    return () => {
      if (wave.wavePortalContract) {
          wavePortalContract.off("NewWave", onNewWave);
        }
    }
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
          Send me a wave!
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {
          currentAccount ? (<textarea name="tweetArea"
            placeholder="Type your message"
            type="text"
            id="tweet"
            value={tweetValue}
            onChange={e => setTweetValue(e.target.value)} />) : null
        }

        {allWaves.map((wave, index) => {
          return (
            <div className="card" key={index}>
              <div><span>Address:</span> {wave.address}</div>
              <div><span>Time:</span> {wave.timestamp.toString()}</div>
              <div><span>Message:</span> {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}

export default App
