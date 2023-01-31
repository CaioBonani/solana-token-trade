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

// import Enderecos from './Enderecos';

// import pbk from './Enderecos';
// import pvk from './Enderecos';
// import token from './Enderecos';

// import pegarPubkey from './Enderecos';
// import pegarPvtKey from './Enderecos';
// import pegarToken from './Enderecos';

import ReactDOM from 'react-dom';


// Special setup to add a Buffer class, because it's missing
window.Buffer = window.Buffer || require("buffer").Buffer;

function MintToken() {

    const connection = new Connection(clusterApiUrl('testnet'), 'confirmed');

    //const bs58 = require('bs58');
    const pvtKey = '5riZXsGzmHMbeh9eCww3xJhap2NxvjM5t2Lfgk97ShLw7zm217c9NnJKcStUtpsoxgvFsf4ggaKQ42yKkWkjJKh' //carteira 1
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

    let pvk: string;
    let pbk: string;
    let token: string;


    function pegarPvtKey() {
        //pegar valor do input
        const pvtKey = (document.getElementById("pvtKey") as HTMLInputElement).value;
        // alert(pvtKey);
        pvk = pvtKey;
    }
    function pegarPubkey() {
        //pegar valor do input
        const pubKey = (document.getElementById("pubKey") as HTMLInputElement).value;
        // alert(pubKey);
        pbk = pubKey;
        return pubKey;
    }

    function pegarToken() {
        //pegar valor do input
        const tokenKey = (document.getElementById("tokenKey") as HTMLInputElement).value;
        // alert(tokenKey);
        token = tokenKey;
    }

    function handleClick() {
        pegarPvtKey();
        pegarPubkey();
        pegarToken();
    }


    async function createToken() {

        console.log(pbk);
        console.log(pvk);
        console.log(token);

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

            <table>
                <tr>
                    <td>Private Key</td>
                    {/*caixa de texto que vai receber a chave privada*/}
                    <input type="text" id="pvtKey" name="pvtKey" />
                    {/* <button onClick={pegarPvtKey}>Enviar</button> */}
                </tr>

                <tr>
                    <td>Public Key</td>
                    {/*caixa de texto que vai receber a chave publica*/}
                    <input type="text" id="pubKey" name="pubKey" />
                    {/* <button onClick={pegarPubkey}>Enviar</button> */}
                </tr>

                <tr>
                    <td>Token</td>
                    {/*caixa de texto que vai receber o endereço token*/}
                    <input type="text" id="tokenKey" name="tokenKey" />
                    {/* <button onClick={pegarToken}>Enviar</button> */}
                </tr>

                <tr>
                    <button onClick={handleClick}>Enviar</button>
                </tr>
            </table>


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