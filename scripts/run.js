// Script to run smart contract. To run smart contract we need to compile, deploy and execute. 

const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');     //Connect to contract in WavePortal.sol using ethers.getContractFactory
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.01"),
  });                                                                                //Use the signer (person with private key) to deploy contract to blockchain
  await waveContract.deployed();                                                     //Wait until contract is deployed
  console.log('Contract addy:', waveContract.address);                               //Log out Smart Contract address in the console


    let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  /**
   * Let's send a few waves!
   */
  let waveTxn = await waveContract.wave('Wave1!');                          // Create waveTxn variable. Wait for connection to WavePortal.sol and run 'wave' function and include message "A message!"
  await waveTxn.wait();                                                               // Wait for the transaction to be mined

  const waveTxn2 = await waveContract.wave("This is wave #2");
  await waveTxn2.wait();

  /* Get Contract balance to see what happened!   */
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log("Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves);

  let waveCount;                                                                     //Set variable "waveCount"
  waveCount = await waveContract.getTotalWaves();                                //waveCount = wait for successful connection to smart contract + run getTotalWaves function from WavePortal.sol
  console.log(waveCount.toNumber());                                             //Log out to console the count provided by 'getTotalWaves' function. The 'toNumber' attribute converts the value into a javascript number so code can read it. 

  // const [_, randomPerson] = await hre.ethers.getSigners();                           
  // waveTxn = await waveContract.connect(randomPerson).wave('Another message!');
  // await waveTxn.wait(); // Wait for the transaction to be mined
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();