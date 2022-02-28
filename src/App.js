import React, { useEffect, useState } from 'react';
import './App.css';
import detectEthereumProvider from '@metamask/detect-provider'
import {loadContract} from './utils/load-contract';
import Web3 from 'web3';

function App() {
  const [web3api,setweb3api] = useState({
    web3:null,
    contract:null,
    provider:null
  });
  const [balance,setBalance] = useState(null);
  const [Account,setAccount] = useState(null);
  const [reload,shouldReload] = useState(false);
  const [AccBal,setAccBal] = useState(null);

  const loadEffect =()=>{
    shouldReload(!reload);
  }

useEffect(()=>{
  const loadWallet = async()=>{
    const provider = await detectEthereumProvider();
    const contract = await loadContract('Funder',provider);
    if(provider){
       provider.request({method:'eth_requestAccounts'})
       
       setweb3api({
         web3:new Web3(provider),
         provider,
         contract,
       });
    }
    else{
      console.error('Please install MetaMask!')
    }
  }
  loadWallet();
},[])

useEffect(()=>{
  const loadBalance = async()=>{
    const {web3,contract}= web3api;
    const balance = await web3.eth.getBalance(contract.address);
    
    setBalance(web3.utils.fromWei(balance,'ether'));
   
  };
  web3api.contract && loadBalance();
},[web3api,reload])

useEffect(()=>{
  const loadAccount = async()=>{
    const {web3} = web3api;
    const accounts =await web3.eth.getAccounts();
    const AccBal = await web3.eth.getBalance(accounts[0]);
    setAccount(accounts[0]);
    setAccBal(web3.utils.fromWei(AccBal,'ether'));
  };
web3api.web3 && loadAccount();
},[web3api,reload])

const transferFund = async()=>{
  const {contract,web3} = web3api;
  await contract.transfer({
    from: Account,
    value: web3.utils.toWei('0.05','ether')
  });
  loadEffect();
};

const withdrawFund = async ()=>{
  const {web3,contract} = web3api;
  const withdrawbalance = await web3.utils.toWei('0.05','ether');
  await contract.withdraw(withdrawbalance,
    {from:Account}
    );
  loadEffect();
}


  return (
    <div class="car text-center">
        <div class="card-header">A Basic Funding DAPP</div>
        <div class="card-body">
          <h5 class="card-title">Balance: {balance} ETH </h5>
          <p class="card-text">
            Account : {Account ? Account : "No Account is connected!!"} 
          </p>
          <h6 class="card-title">Remaining Account Balance:{AccBal} ETH </h6>
          <button type="button" class="btn btn-success " onClick={transferFund}>
            Transfer
          </button>
          &nbsp;
          <button type="button" class="btn btn-primary " onClick={withdrawFund}>
            Withdraw
          </button>
        </div>
        <div class="card-footer text-muted">Arpit Sharma</div>
      </div>
  );
}

export default App;
