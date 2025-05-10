import {
  CIP68_100,
  stringToHex,
  mConStr0,
  metadataToCip68,
  deserializeAddress,
  MeshTxBuilder,
  BlockfrostProvider,
  applyParamsToScript,
  resolveScriptHash,
  serializeAddressObj,
  serializePlutusScript,
  scriptAddress,
  PlutusScript,
  UTxO,
  BrowserWallet
} from "@meshsdk/core";
import { isNil } from "lodash";
import plutus from './plutus.json';
import {wallet, getWalletInfoForTx } from './common';

// Platform constants - defined once for the whole application
const PLATFORM = {
  address: "addr_test1qqwkave5e46pelgysvg6mx0st5zhte7gn79srscs8wv2qp5qkfvca3f7kpx3v3rssm4j97f63v5whrj8yvsx6dac9xrqyqqef6",
  fee: "1000000", // 1 ADA in lovelace
  network: "preprod"
};

// Calculate platform derived values
const platformPubKeyHash = deserializeAddress(PLATFORM.address).pubKeyHash;
const platformStakeCredential = deserializeAddress(PLATFORM.address).stakeCredentialHash;

// Blockchain provider
const blockchainProvider = new BlockfrostProvider('preprod2DQWsQjqnzLW9swoBQujfKBIFyYILBiL');

// Helper functions
function readValidator(title: string): string {
  const validator = plutus.validators.find(v => v.title === title);
  if (!validator) throw new Error(`${title} validator not found.`);
  return validator.compiledCode;
}

async function getUtxoForTx(address: string, txHash: string): Promise<UTxO> {
  const utxos = await blockchainProvider.fetchAddressUTxOs(address);
  const utxo = utxos.find(utxo => utxo.input.txHash === txHash);
  if (!utxo) throw new Error(`No UTXOs found for txHash: ${txHash}`);
  return utxo;
}

async function getAddressUTXOAsset(address: string, unit: string): Promise<UTxO> {
  try {
    const utxos = await blockchainProvider.fetchAddressUTxOs(address, unit);
    if (utxos.length === 0) {
      // Try searching all UTXOs at the address if specific asset not found
      console.log("Asset not found with direct query, checking all UTXOs at address...");
      const allUtxos = await blockchainProvider.fetchAddressUTxOs(address);
      console.log(`Found ${allUtxos.length} UTXOs at ${address}`);
      
      // Log all assets in these UTXOs
      console.log("Listing all assets in these UTXOs:");
      allUtxos.forEach((utxo, index) => {
        console.log(`UTXO ${index + 1} (${utxo.input.txHash}):`);
        utxo.output.amount.forEach(asset => {
          console.log(`- ${asset.unit}: ${asset.quantity}`);
        });
      });
      
      throw new Error(`No UTXOs found with asset: ${unit}`);
    }
    
    console.log(`Found ${utxos.length} UTXOs with the asset`);
    console.log(`Found UTXO: ${utxos[utxos.length - 1].input.txHash}`);
    return utxos[utxos.length - 1];
  } catch (error) {
    console.error("Error fetching UTXOs:", error);
    throw error;
  }
}

/**
 * Cập nhật token CIP68
 * @param tokenInfo Thông tin token cần cập nhật
 * @param ownerInfo Thông tin người sở hữu gốc token
 * @returns Transaction hash
 */

export async function updateTokens(
  wallet: any,
  tokenInfo: Array<{ 
    assetName: string; 
    metadata: any; 
    txHash?: string;
  }>,
  ownerInfo: {
    address: string;
    pubKeyHash: string;
  },
  policyId: string,
  storeScriptCbor: string,
): Promise<string> {
  console.log("Starting token update process...");
  
  // Get current wallet information automatically
  const {utxos, walletAddress, collateral} = await getWalletInfoForTx(wallet);
  const { pubKeyHash: userPubKeyHash } = deserializeAddress(walletAddress);
  
  console.log("Current user wallet address:", walletAddress);
  console.log("Current user pubKeyHash:", userPubKeyHash);
  
  // Initialize transaction builder
  const unsignedTx = new MeshTxBuilder({
    fetcher: blockchainProvider,
    submitter: blockchainProvider,
    verbose: true,
  });
  
  // Get validators and scripts
  const mintCompilecode = readValidator("mint.mint.mint");
  const storeCompilecode = readValidator("store.store.spend");

  // Apply parameters to store script
  const storeScriptCbor = "5903735903700101003333232323232323223223223225333008323232323253323300e3001300f37540042646464646464a66602860060022a66602e602c6ea8024540085854ccc050c01c00454ccc05cc058dd50048a8010b0b180a1baa00815333012300130133754004264646464646464646464a6660386016603a6ea80044c8c94ccc078c034c07cdd50098a5113323223370e6004646600200201a44a66604c002297ae0132325333025533302553330253371204264a66604c6032604e6ea8004520001375a605660506ea8004c94ccc098c064c09cdd50008a60103d87a8000132330010013756605860526ea8008894ccc0ac004530103d87a8000132323232533302c33722911000021533302c3371e9101000021301533030375000297ae014c0103d87a8000133006006003375a605a0066eb8c0ac008c0bc008c0b4004c8cc004004dd59815981618141baa00322533302a00114c103d87a8000132323232533302b33722911000021533302b3371e910100002130143302f374c00297ae014c0103d87a8000133006006003375660580066eb8c0a8008c0b8008c0b00044cdd7980598139baa300b302737540046016604e6ea80305280a5113375e6016604e6ea8c02cc09cdd5001180598139baa00513302900233004004001133004004001302a002302800148010c004004894ccc08c00452000133700900119801001181300098030009bae32330010013756600860406ea8030894ccc088004584c8c94ccc084cdd79811001260104435f706b0013023002133004004001302600230240013021301e37540022c64660020026eb0c084024894ccc080004530103d87a800013232533301f3375e600a60426ea80080404c020cc08c0092f5c02660080080026048004604400246040002600202e460046603a60046603a6ea40052f5c06603a980103d87a80004bd701ba548000dd6180d980e180e180e180e180e180e0011bac301a001301a301a00130153754014602e60286ea800858dc3a4000602a602c004602800260206ea8008dc3a40042c6022602400460200026020004601c00260146ea800452613656375c0026eb4004dd7000ab9a5573aaae7955cfaba05742ae8930011e581c1d6eb334cd741cfd048311ad99f05d0575e7c89f8b01c3103b98a006004c010101004c011e581c62a6dd92d4f7799c12c64ec8323079bcf18d77f71a62455df7f7427f0001";
  
  // Create store script
  const storeScript: PlutusScript = {
    code: storeScriptCbor,
    version: "V3" as const,
  };
  
  // Calculate store address with stake credential
  const storeAddress = "addr_test1zz6mgddrec0agt6a4c620m340w52zat32nkyga9jmt8vl7yqkfvca3f7kpx3v3rssm4j97f63v5whrj8yvsx6dac9xrqhgfpc8";
  
  console.log("Store address:", storeAddress);
  
  // Calculate mint script and policy ID
  const storeScriptHash = deserializeAddress(storeAddress).scriptHash;
  const mintScriptCbor = applyParamsToScript(mintCompilecode, [
    platformPubKeyHash,
    BigInt(1),
    storeScriptHash,
    platformStakeCredential,
    ownerInfo.pubKeyHash,
  ]);
  const policyId = "ec1910e97786573f729d46f3291edb3150d4c090718661fa2fb8070c";
  console.log("Policy ID:", policyId);

  console.log("Building transaction...");
  
  // Process each token update
  await Promise.all(
    tokenInfo.map(async ({ assetName, metadata, txHash }) => {
      console.log(`Asset name (hex): ${stringToHex(assetName)}`);
      const referenceTokenId = policyId + CIP68_100(stringToHex(assetName));
      console.log(`Reference token ID: ${referenceTokenId}`);
      
      console.log(`Searching for asset ${referenceTokenId} at address ${storeAddress}`);
      
      const storeUtxo = !isNil(txHash)
        ? await getUtxoForTx(storeAddress, txHash)
        : await getAddressUTXOAsset(storeAddress, referenceTokenId);
      
      if (!storeUtxo) throw new Error("Store UTXO not found");
      
      // Make sure metadata has _pk field set to owner's pubKeyHash
      if (!metadata._pk) {
        console.log("Adding owner pubKeyHash to metadata _pk field");
        metadata._pk = ownerInfo.pubKeyHash;
      }
      
      // Build token update transaction
      unsignedTx
        .spendingPlutusScriptV3()
        .txIn(storeUtxo.input.txHash, storeUtxo.input.outputIndex)
        .txInInlineDatumPresent()
        .txInRedeemerValue(mConStr0([]))
        .txInScript(storeScriptCbor)
        .txOut(storeAddress, [
          {
            unit: referenceTokenId,
            quantity: "1",
          }
        ])
        .txOutInlineDatumValue(metadataToCip68(metadata));
    }),
  );

  // Add platform fee payment
  unsignedTx
    .txOut(PLATFORM.address, [
      {
        unit: "lovelace",
        quantity: "1000000",
      },  
    ])
    .changeAddress(walletAddress)
    .requiredSignerHash(userPubKeyHash)
    // IMPORTANT: Owner must sign the tx
    .selectUtxosFrom(utxos)
    .txInCollateral(
      collateral.input.txHash, 
      collateral.input.outputIndex,
      collateral.output.amount,
      collateral.output.address
    )
    .setNetwork("preprod");

  
  // Complete transaction
  console.log("Completing transaction...");
  const completedTx = await unsignedTx.complete();
  console.log("txBodyJson", JSON.stringify(completedTx));

  console.log("Signing transaction...");
  const signedTx = await wallet.signTx(completedTx, true);
  console.log("Submitting transaction...");
  
  try {
    const txHashUpdate = await wallet.submitTx(signedTx);
    console.log("Transaction submitted successfully!");
    console.log("Update successful! TxHash: " + txHashUpdate);
    return txHashUpdate;
  } catch (error) {
    console.error("Error submitting transaction:", error);
    throw error;
  }
}
