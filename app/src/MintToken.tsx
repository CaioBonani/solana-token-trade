import { 
    clusterApiUrl, 
    Connection, 
    PublicKey, 
    Keypair, 
    LAMPORTS_PER_SOL 
} from '@solana/web3.js';

import { 
    createMint, 
    getOrCreateAssociatedTokenAccount, 
    mintTo, 
    transfer, 
    Account, 
    getMint, 
    getAccount,
    createAssociatedTokenAccount
} from '@solana/spl-token';

import bs58 from 'bs58';

import pbk from './Enderecos';
import pvk from './Enderecos';
import token from './Enderecos';

import pegarPubkey from './Enderecos';
import pegarPvtKey from './Enderecos';
import pegarToken from './Enderecos';

import ReactDOM from 'react-dom';


// Special setup to add a Buffer class, because it's missing
window.Buffer = window.Buffer || require("buffer").Buffer;

function MintToken() {


    const var1 = pbk.toString();
    
    const var2 = pvk.toString();
    
    const var3 = token.toString();
    
    console.log(var1, var2, var3);
    

    const connection = new Connection(clusterApiUrl('testnet'), 'confirmed');

    //const bs58 = require('bs58');
    const pvtKey = '5riZXsGzmHMbeh9eCww3xJhap2NxvjM5t2Lfgk97ShLw7zm217c9NnJKcStUtpsoxgvFsf4ggaKQ42yKkWkjJKh4' //carteira 1
    const pvtKeyDecoded = bs58.decode(pvtKey); 
    const uInt8ArrayFromPvtKey = new Uint8Array(pvtKeyDecoded.buffer, pvtKeyDecoded.byteOffset, pvtKeyDecoded.byteLength / Uint8Array.BYTES_PER_ELEMENT);
    const fromWallet = Keypair.fromSecretKey(uInt8ArrayFromPvtKey);

    // Public Key to your Phantom Wallet
    const pubKey = 'w2Z5rPAARvW8uF2mMtNeCQX1LDqTYq5CKf1hT6WdZ1P' //carteira 2
    const toWallet = new PublicKey(pubKey); 

	let fromTokenAccount: Account; 
	let mint: PublicKey;

    const tokenPubKey = '8tTF9ieU4rDHoprhV6Qhnm9xyogPuELL5F99MqGkDkh1';
    let tokenQueSeraTransferido: PublicKey;
    tokenQueSeraTransferido = new PublicKey(tokenPubKey); //endereco do token que sera transferido, esse token foi criado pelo CLI

    

    async function createToken() {

        console.log(var1);
        console.log(var2);
        console.log(var3);

        const fromAirdropSignature = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
        await connection.confirmTransaction(fromAirdropSignature);
        
        // Create new token mint
        // mint = await createMint(
        //         connection, 
        //         fromWallet, 
        //         fromWallet.publicKey, 
        //         null, 
        //         9 // 9 here means we have a decmial of 9 0's
        //     );
        mint = tokenQueSeraTransferido;

        console.log(`Create token: ${mint.toBase58()}`);

        console.log('keypair: ' + fromWallet.publicKey.toBase58());
    
        // Get the token account of the fromWallet address, and if it does not exist, create it
        fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            mint,
            fromWallet.publicKey
        ); 

        // if (fromTokenAccount == null) {
        //     console.log('fromTokenAccount is null');

        //     fromTokenAccount = await createAssociatedTokenAccount(
        //         connection,
        //         fromWallet,
        //         mint,
        //         fromWallet.publicKey
        //     );
        // }

        console.log(`Create Token Account: ${fromTokenAccount.address.toBase58()}`);
    }

    async function mintToken() {      
        // Mint 1 new token to the "fromTokenAccount" account we just created
        const signature = await mintTo(
            connection,
            fromWallet,
            mint,
            fromTokenAccount.address,
            fromWallet.publicKey,
            10000000000 // 10 billion
        );
        console.log(`Mint signature: ${signature}`);
    }

    async function checkBalance() {
        // get the supply of tokens we have minted into existance
        const mintInfo = await getMint(connection, mint);
		console.log(mintInfo.supply);
		
		// get the amount of tokens left in the account
        const tokenAccountInfo = await getAccount(connection, fromTokenAccount.address);
		console.log(tokenAccountInfo.amount);
    }

    async function sendToken() {
        // Get the token account of the toWallet address, and if it does not exist, create it
        const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, mint, toWallet);
        console.log(`toTokenAccount ${toTokenAccount.address}`);

        const signature = await transfer(
            connection,
            fromWallet,
            fromTokenAccount.address,
            toTokenAccount.address,
            fromWallet.publicKey,
            1000000000 // 1 billion
        );
        console.log(`finished transfer with ${signature}`);
    }
    
    return (
        <div>
            Mint Token Section
            <div>
                <button onClick={createToken}>Create token</button>
                <button onClick={mintToken}>Mint token</button>
                <button onClick={checkBalance}>Check balance</button>
                <button onClick={sendToken}>Send token</button>
            </div>
        </div>
    );
}

export default MintToken;