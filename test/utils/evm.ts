import { ethers, network } from 'hardhat';
import { BigNumber } from 'ethers';

export async function resetHardhat() {
  if ((network as any).config.forking) {
    const { url: jsonRpcUrl, blockNumber } = (network as any).config.forking;

    await ethers.provider.send('hardhat_reset', [
      { forking: { jsonRpcUrl, blockNumber } },
    ]);
  } else {
    await ethers.provider.send('hardhat_reset', []);
  }
}

export async function getBlockNumber() {
  return parseInt(await ethers.provider.send('eth_blockNumber', []));
}

export async function mineBlock() {
  await ethers.provider.send('evm_mine', []);
}

export async function getEthBalance(address: string) {
  return BigNumber.from(
    await ethers.provider.send('eth_getBalance', [address]),
  );
}

export async function mineBlockUntil(to: number) {
  const block = await getBlockNumber();
  if (block == to) return;

  if (block > to) {
    throw new Error('Block already passed');
  }

  for (let i = block; i < to; i++) {
    await mineBlock();
  }
}

export async function setTimestamp(timestamp: number) {
  await ethers.provider.send('evm_setNextBlockTimestamp', [timestamp]);
  await mineBlock();
}

export async function increaseTimestamp(amount: number) {
  await ethers.provider.send('evm_increaseTime', [amount]);
  await mineBlock();
}
