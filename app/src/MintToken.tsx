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
import ReactDOM from 'react-dom';
import React from 'react';

import './MintToken.css';

window.Buffer = window.Buffer || require("buffer").Buffer;

function MintToken() {
    
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    const [pvtKey, setPvtKey] = React.useState('');
    const [pubKey, setPubKey] = React.useState('');
    const [tokenPubKey, setTokenKey] = React.useState('');
    
    let fromTokenAccount: Account;
    let mint: PublicKey;
    
    function pegarPvtKey() {
        //pegar valor do input
        const pvk = (document.getElementById("pvtKey") as HTMLInputElement).value;
        setPvtKey(pvk);
        (document.getElementById("pvtKey") as HTMLInputElement).value = "";
    }
    function pegarPubkey() {
        //pegar valor do input
        const pbk = (document.getElementById("pubKey") as HTMLInputElement).value;
        setPubKey(pbk);
        (document.getElementById("pubKey") as HTMLInputElement).value = "";
        
    }
    
    function pegarToken() {
        //pegar valor do input
        const token = (document.getElementById("tokenKey") as HTMLInputElement).value;
        setTokenKey(token);
        (document.getElementById("tokenKey") as HTMLInputElement).value = "";
        
    }
    
    async function testeApi() {
        
        const amount = 1000000000;
        
        const pvtKeyDecoded = bs58.decode("3hy5sUta8NgU6M8K2kjSjCY48b8Wwd66rpJG2JZ1qhyPLGXt3R6cNEEZz9df666oLPJMKZnUxT5BkbVmXsDEJ3DD");
        const uInt8ArrayFromPvtKey = new Uint8Array(pvtKeyDecoded.buffer, pvtKeyDecoded.byteOffset, pvtKeyDecoded.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        const fromWallet = Keypair.fromSecretKey(uInt8ArrayFromPvtKey);

        let from = await getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            new PublicKey("GUuXJ5mh8MqoAEsayC1okx71L9HjP2VGdspJZ1BqHvLv"),
            fromWallet.publicKey
        );

        console.log('Token Account da carteira que está enviando: ' + from.address.toBase58());

        let to = await getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            new PublicKey("GUuXJ5mh8MqoAEsayC1okx71L9HjP2VGdspJZ1BqHvLv"),
            new PublicKey("3LgXWHn9ZHtv7jgUk4Ei8JF35qonMjKkhr6VhTZgy5rK")
        );

        let from_a= from.address.toBase58();
        let to_a= to.address.toBase58();

        console.log('Token Account da carteira que vai receber: ' + to.address.toBase58());

        fetch("http://localhost/8080", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({from_a, to_a, amount}),

        }).then(response => {
            console.log("Success:");

        }).catch((error) => {
            console.error("Error:", error);
        });
    }


    function handleClick() {
        pegarPvtKey();
        pegarPubkey();
        pegarToken();
    }


    async function GetTokenAccount() {

        console.log('Chave Privada da carteira que está enviando: ' + pvtKey);
        console.log('Chave Pública do Token: ' + tokenPubKey);
        console.log('Chave Pública da carteira que vai receber: ' + pubKey);

        const pvtKeyDecoded = bs58.decode(pvtKey);
        const uInt8ArrayFromPvtKey = new Uint8Array(pvtKeyDecoded.buffer, pvtKeyDecoded.byteOffset, pvtKeyDecoded.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        const fromWallet = Keypair.fromSecretKey(uInt8ArrayFromPvtKey);

        const tokenQueSeraTransferido = new PublicKey(tokenPubKey);

        mint = tokenQueSeraTransferido;

        console.log('Chave Pública da carteira que está enviando: ' + fromWallet.publicKey.toBase58());

        // Get the token account of the fromWallet address, and if it does not exist, create it
        fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            mint,
            fromWallet.publicKey
        );
        
        //Cada carteira que possui um token, possui um token account, a token account é "dona" do token e a carteira é "dono" da token account
        console.log(`Token Account da carteira: ${fromTokenAccount.address.toBase58()}`);
    }

    async function checkBalance() {
        // get the amount of tokens in the mint
        const mintInfo = await getMint(connection, mint);
        console.log(`Quantos tokens ${mint.toBase58()} existem: ${mintInfo.supply}`);

        // get the amount of tokens left in the account
        const tokenAccountInfo = await getAccount(connection, fromTokenAccount.address);
        console.log(`Quantos tokens a carteira que enviou possui: ${tokenAccountInfo.amount}`);
    }

    async function sendToken() {

        const pvtKeyDecoded = bs58.decode(pvtKey);
        const uInt8ArrayFromPvtKey = new Uint8Array(pvtKeyDecoded.buffer, pvtKeyDecoded.byteOffset, pvtKeyDecoded.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        const fromWallet = Keypair.fromSecretKey(uInt8ArrayFromPvtKey);

        const toWallet = new PublicKey(pubKey);
        

        // Get the token account of the toWallet address, and if it does not exist, create it
        const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, mint, toWallet);
        console.log(`Token Account da carteira que está recebendo: ${toTokenAccount.address}`);

        const signature = await transfer(
            connection,
            fromWallet,
            fromTokenAccount.address,
            toTokenAccount.address,
            fromWallet.publicKey,
            1000000000 // 1 billion
        );
        console.log(`Transferência realizada com a assinatura: ${signature}`);
    }


    

    return (
        
        <div>
            <div id="barraSuperior">
                <table id="keys">
                    <tr>
                        <td>Private Key</td>
                        <input type="text" id="pvtKey" name="pvtKey" />

                        <td>Public Key</td>                    
                        <input type="text" id="pubKey" name="pubKey" />
                
                        <td id="tokenButton">Token</td>        
                        <input type="text" id="tokenKey" name="tokenKey" />

                        <button id="botao" onClick={handleClick}>Enviar</button>
                    </tr>
                </table>
            </div>

            <div id="token">
                <br/>
                <span id="area">Área do Token</span>  
                <button onClick={GetTokenAccount}>Get Token Account</button>
                <button onClick={checkBalance}>Check balance</button>
                <button onClick={sendToken}>Send token</button>
                <button onClick={testeApi}>Teste API</button>
                <br/>
                <br/>
            </div>

        </div>
    );
}

export default MintToken;