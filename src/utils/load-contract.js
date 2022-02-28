import contract from '@truffle/contract';

export const loadContract = async(name,provider)=>{
    const res = await fetch(`/contracts/${name}.json`);
    const Artifacts = await res.json();
    const _contracts = contract(Artifacts);
    _contracts.setProvider(provider);
    const deployedContract =  await _contracts.deployed();
    return deployedContract;
};