import {
    BlockfrostProvider,
    MeshTxBuilder,
    MeshWallet,
    PlutusScript,
    serializePlutusScript,
    UTxO
    ,resolvePlutusScriptAddress
  } from "@meshsdk/core";
  import { applyParamsToScript } from "@meshsdk/core-csl";
  import blueprint from "./plutus.json";
  import { Script } from "node:vm";
   
  export const blockchainProvider = new BlockfrostProvider('preprod2DQWsQjqnzLW9swoBQujfKBIFyYILBiL');
   
  // wallet for signing transactions
  export const wallet = new MeshWallet({
      networkId: 0, // Mạng Cardano: 0 là Testnet (Preview, PreprodPreprod)
      fetcher: blockchainProvider, // Provider để truy vấn blockchain
      submitter: blockchainProvider, // Provider để gửi giao dịch
      key: {
          type: 'mnemonic', // loai 24 ki tu
          // words: [
          //   "illness", "tomato", "organ", "credit", "hybrid", "path", "slight", "bomb", "allow", "media", "credit", "virtual", "uncle", "blast", "type", "very", "certain", "join", "feed", "repeat", "elbow", "place", "aim", "oblige"
          // ], // Danh sách các từ mnemonic - beneficiary
          words: [
            "spoil", "maid", "general", "expire", "kidney", "deal", "awful", "clip", "fragile", "kitchen", "reason", "crater", "attitude", "grain", "bitter", "bag", "mouse", "reform", "cactus", "spot", "vital", "sea", "same", "salon"
          ]
      },
  });
  //console.log(wallet.getChangeAddress());
  export function getScript() {
    const scriptCbor = applyParamsToScript(
      blueprint.validators[0].compiledCode,
      []
    );
    const script: PlutusScript = {
      code : scriptCbor,
      version: "V3"
    }
   
    const scriptAddr = serializePlutusScript(
      { code: scriptCbor, version: "V3" },undefined, 0
    ).address;;
    
   
    return { scriptCbor, scriptAddr };
  }
  
  // reusable function to get a transaction builder
  export function getTxBuilder() {
    return new MeshTxBuilder({
      fetcher: blockchainProvider,
      submitter: blockchainProvider,
      verbose:true,
    });
  }
   
  // reusable function to get a UTxO by transaction hash
  export async function getUtxoByTxHash(txHash: string): Promise<UTxO> {
    const utxos = await blockchainProvider.fetchUTxOs(txHash);
    if (utxos.length === 0) {
      throw new Error("UTxO not found");
    }
    return utxos[0];
  }
  
  
  
  export async function getWalletInfoForTx(wallet: any) {
    const utxos = await wallet.getUtxos();
    const walletAddress = (await wallet.getUsedAddresses())[0];
    const collateral = (await wallet.getCollateral())[0];
    return { utxos, walletAddress, collateral };
  }
  export async function getUtxoForTx(address: string, txHash: string, wallet: any){
    const utxos: UTxO[] = await blockchainProvider.fetchAddressUTxOs(address);
    const utxo = utxos.find(function (utxo: UTxO) {
      return utxo.input.txHash === txHash;
    });
  
    if (!utxo) throw new Error("No UTXOs found in getUtxoForTx method.");
    return utxo;
  }
  
  export async function getAddressUTXOAsset(address: string, unit: string, wallet: any)  {
    const utxos = await blockchainProvider.fetchAddressUTxOs(address, unit);
    return utxos[utxos.length - 1];
  };