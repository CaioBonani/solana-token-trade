import {
    clusterApiUrl,
    Connection,
    PublicKey,
    Keypair,
    LAMPORTS_PER_SOL,
    GetProgramAccountsFilter,
} from '@solana/web3.js';

import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    transfer,
    Account,
    getMint,
    getAccount,
    createAssociatedTokenAccount,
    TOKEN_PROGRAM_ID
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
    const [amount, setAmount] = React.useState(0);
    const [tokens, setTokens] = React.useState('');


    let fromTokenAccount: Account;
    let mint: PublicKey;

    function pegarPvtKey() {
        const pvk = (document.getElementById("pvtKey") as HTMLInputElement).value;
        setPvtKey(pvk);
    }

    function pegarPubkey() {
        const pbk = (document.getElementById("pubKey") as HTMLInputElement).value;
        setPubKey(pbk);
    }

    function pegarToken() {
        const token = (document.getElementById("tokenKey") as HTMLInputElement).value;
        setTokenKey(token);
    }

    function pegarAmount() {
        const qtd = parseInt((document.getElementById("amount") as HTMLInputElement).value);
        setAmount(qtd);
    }


    async function testApi() {

        const amount = 1000000000;

        const private_key = '3hy5sUta8NgU6M8K2kjSjCY48b8Wwd66rpJG2JZ1qhyPLGXt3R6cNEEZz9df666oLPJMKZnUxT5BkbVmXsDEJ3DD'
        const pvtKeyDecoded = bs58.decode("3hy5sUta8NgU6M8K2kjSjCY48b8Wwd66rpJG2JZ1qhyPLGXt3R6cNEEZz9df666oLPJMKZnUxT5BkbVmXsDEJ3DD");
        const uInt8ArrayFromPvtKey = new Uint8Array(pvtKeyDecoded.buffer, pvtKeyDecoded.byteOffset, pvtKeyDecoded.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        const fromWallet = Keypair.fromSecretKey(uInt8ArrayFromPvtKey);


        let from = await getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            new PublicKey("GUuXJ5mh8MqoAEsayC1okx71L9HjP2VGdspJZ1BqHvLv"),
            fromWallet.publicKey
        );

        console.log('Sending Wallet Token Account:'  + from.address.toBase58());

        let to = await getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            new PublicKey("GUuXJ5mh8MqoAEsayC1okx71L9HjP2VGdspJZ1BqHvLv"),
            new PublicKey("3LgXWHn9ZHtv7jgUk4Ei8JF35qonMjKkhr6VhTZgy5rK")
        );

        let sender = from.address.toBase58();
        let receiver = to.address.toBase58();

        console.log('Sender Wallet Token Account: ' + from.address.toBase58());
        console.log('Receiving Wallet Token Account: ' + to.address.toBase58());

        fetch("https://localhost:8080", {
            method: "POST",
            headers: {
                "Allow-Control-Allow-Origin": "https://localhost/8080",
                "Content-Type": "application/json",
                "Allow-Control-Allow-Methods": "POST",
            },
            body: JSON.stringify({ private_key, sender, receiver, amount }),

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
        pegarAmount();
    }


    async function GetTokenAccount() {

        console.log('Sender Private Key: ' + pvtKey);
        console.log('Token Key: ' + tokenPubKey);
        console.log('Receiver Public Key: ' + pubKey);

        const pvtKeyDecoded = bs58.decode(pvtKey);
        const uInt8ArrayFromPvtKey = new Uint8Array(pvtKeyDecoded.buffer, pvtKeyDecoded.byteOffset, pvtKeyDecoded.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        const fromWallet = Keypair.fromSecretKey(uInt8ArrayFromPvtKey);

        const tokenQueSeraTransferido = new PublicKey(tokenPubKey);

        mint = tokenQueSeraTransferido;

        console.log('Sender Public Key: ' + fromWallet.publicKey.toBase58());

        fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            mint,
            fromWallet.publicKey
        );

        console.log(`Wallet Token Account: ${fromTokenAccount.address.toBase58()}`);
    }

    async function checkBalance() {

        const mintInfo = await getMint(connection, mint);
        console.log(`How many ${mint.toBase58()} tokens exists: ${mintInfo.supply}`);
        alert(`How mayny ${mint.toBase58()} tokens exists: ${mintInfo.supply}`);

        const tokenAccountInfo = await getAccount(connection, fromTokenAccount.address);
        console.log(`How many tokens the sender holds: ${tokenAccountInfo.amount}`);
        alert(`How many tokens the sender holds: ${tokenAccountInfo.amount}`);
    }

    async function sendToken() {

        const pvtKeyDecoded = bs58.decode(pvtKey);
        const uInt8ArrayFromPvtKey = new Uint8Array(pvtKeyDecoded.buffer, pvtKeyDecoded.byteOffset, pvtKeyDecoded.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        const fromWallet = Keypair.fromSecretKey(uInt8ArrayFromPvtKey);

        const toWallet = new PublicKey(pubKey);

        GetTokenAccount();

        const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, mint, toWallet);
        console.log(`Receiver Token Account: ${toTokenAccount.address}`);

        const signature = await transfer(
            connection,
            fromWallet,
            fromTokenAccount.address,
            toTokenAccount.address,
            fromWallet.publicKey,
            amount * 1000000000
        );

        console.log(`Transaction Signature: ${signature}`);
        alert(`Transaction Signature: ${signature}`);
    }

    async function getAllTokensFromAccount() {

        const consoleLogElement = document.getElementById("console-log");
        console.log("Getting all tokens from account");
        
        
        // const pub = new PublicKey("9avcSjtvuf74i8iu8EoLnEdaxsfkCfUxW23kkewsFZhd");
        const pub = "9avcSjtvuf74i8iu8EoLnEdaxsfkCfUxW23kkewsFZhd"
        
        const filters:GetProgramAccountsFilter[] = [
            {
                dataSize: 165,    //size of account (bytes)
            },
            {
                memcmp: {
                offset: 32,     //location of our query in the account (bytes)
                bytes: pub,  //our search criteria, a base58 encoded string
            },            
        }];
        const accounts = await connection.getParsedProgramAccounts(
            TOKEN_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
            {filters: filters}
            );
            console.log(`Found ${accounts.length} token account(s) for wallet ${pub}.`);
            let string = '';

            accounts.forEach((account, i) => {
                //Parse the account data
                const parsedAccountInfo:any = account.account.data;
                const mintAddress:string = parsedAccountInfo["parsed"]["info"]["mint"];
                const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
                //Log results

                string: string = string + 'Token mint: ' + mintAddress + ' - Token Balance: ' + tokenBalance + '\n' + '\n';
                // console.log(`Token Account No. ${i + 1}: ${account.pubkey.toString()}`);
                // console.log(`--Token Mint: ${mintAddress}`);
                // console.log(`--Token Balance: ${tokenBalance}`);

                console.log(string);

                const teste = 'alo\nalo'
                
                setTokens(string);
            });
    }

    // async function getAllTokensFromAccount() {

    //     // const pvtKeyDecoded = bs58.decode(pvtKey);
    //     // const uInt8ArrayFromPvtKey = new Uint8Array(pvtKeyDecoded.buffer, pvtKeyDecoded.byteOffset, pvtKeyDecoded.byteLength / Uint8Array.BYTES_PER_ELEMENT);
    //     // const fromWallet = Keypair.fromSecretKey(uInt8ArrayFromPvtKey);

    //     //tirar a gambiarra dps

    //     const pub = new PublicKey("9avcSjtvuf74i8iu8EoLnEdaxsfkCfUxW23kkewsFZhd");
    //     const tokenAccounts = await connection.getTokenAccountsByOwner(pub, { programId: TOKEN_PROGRAM_ID });
        
    //     //parse the content

        

    //     // setTokens(tokenAccounts)
        
    //     console.log(tokenAccounts);
    //     alert(tokenAccounts);

    // }

    return (

        <div id="pai">
            <div id="barraSuperior">
                <table id="keys">
                    <tr>
                        <span id="area">Token-Area</span>
                        <td>
                            <button onClick={GetTokenAccount}>Get Token Account</button>
                        </td>

                        <td>
                            <button onClick={checkBalance}>Check balance</button>
                        </td>

                        <td>
                            <button onClick={sendToken}>Send token</button>
                        </td>

                        <td>
                            <button onClick={testApi}>Test API</button>
                        </td>

                        <td>
                            <button onClick={getAllTokensFromAccount}>Get All Tokens From Account</button>
                        </td>
                    </tr>
                </table>
            </div>

            <div id="token">
                <br />
                <div id="area">Data</div>

                <input type="text" id="pvtKey" name="pvtKey" placeholder='Private Key'/>
                <p>Private Key: {pvtKey}</p>
            
                <input type="text" id="pubKey" name="pubKey" placeholder='Public Key' />
                <p>Public Key: {pubKey}</p>

                <input type="text" id="tokenKey" name="tokenKey" placeholder='Token Key' />
                <p>Token: {tokenPubKey}</p>

                <input type="text" id="amount" name="amount" placeholder='Amount' />
                <p>Amount: {amount}</p>

                <button id="botao" onClick={handleClick}>Save</button>


                <div id="wallet">
                    <h1>Wallet</h1>

                    <span> Tokens: </span>

                    <div id="console-log" style={{whiteSpace: 'pre-line'}}>
                        {tokens}
                    </div>
                </div>

                {/* <br />
                <br /> */}

            </div>

        </div>
    );
}

export default MintToken;