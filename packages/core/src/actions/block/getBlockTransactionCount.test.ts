import { expect, test } from 'vitest'

import {
  accounts,
  initialBlockNumber,
  publicClient,
  testClient,
  walletClient,
} from '../../../test'
import { parseEther } from '../../utils'
import { mine } from '../test'
import { sendTransaction } from '../transaction/sendTransaction'
import { getBlock } from './getBlock'

import { getBlockTransactionCount } from './getBlockTransactionCount'

test('default', async () => {
  expect(await getBlockTransactionCount(publicClient)).toBeDefined()
})

test('args: blockNumber', async () => {
  expect(
    await getBlockTransactionCount(publicClient, {
      blockNumber: initialBlockNumber - 1n,
    }),
  ).toBe(99)
})

test('args: blockHash', async () => {
  const block = await getBlock(publicClient, {
    blockNumber: initialBlockNumber - 1n,
  })
  expect(
    await getBlockTransactionCount(publicClient, {
      blockHash: block.hash!,
    }),
  ).toBe(99)
})

test('args: blockTag', async () => {
  expect(
    await getBlockTransactionCount(publicClient, {
      blockTag: 'latest',
    }),
  ).toBe(0)
  await sendTransaction(walletClient, {
    request: {
      from: accounts[0].address,
      to: accounts[1].address,
      value: parseEther('1'),
    },
  })
  await mine(testClient, { blocks: 1 })
  expect(
    await getBlockTransactionCount(publicClient, {
      blockTag: 'latest',
    }),
  ).toBe(1)
})