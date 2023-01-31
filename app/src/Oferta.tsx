import { 
    clusterApiUrl, 
    Connection, 
    PublicKey, 
    Keypair, 
    LAMPORTS_PER_SOL, 
    Transaction, 
    sendAndConfirmTransaction,
    SystemProgram,
} from '@solana/web3.js';

import { 
    createMint, 
    getOrCreateAssociatedTokenAccount, 
    mintTo, 
    Account, 
    createSetAuthorityInstruction, 
    AuthorityType
} from '@solana/spl-token';

import bs58 from 'bs58';
import { Program } from '@project-serum/anchor';

function Oferta() {


    const connection = new Connection(clusterApiUrl('testnet'), 'confirmed');

    const pvtKey = '5riZXsGzmHMbeh9eCww3xJhap2NxvjM5t2Lfgk97ShLw7zm217c9NnJKcStUtpsoxgvFsf4ggaKQ42yKkWkjJKh4' //carteira 1
    const pvtKeyDecoded = bs58.decode(pvtKey); 
    const uInt8ArrayFromPvtKey = new Uint8Array(pvtKeyDecoded.buffer, pvtKeyDecoded.byteOffset, pvtKeyDecoded.byteLength / Uint8Array.BYTES_PER_ELEMENT);
    const fromWallet = Keypair.fromSecretKey(uInt8ArrayFromPvtKey);

    // Public Key to your Phantom Wallet
    const pubKey = 'w2Z5rPAARvW8uF2mMtNeCQX1LDqTYq5CKf1hT6WdZ1P' //carteira 2
    const toWallet = new PublicKey(pubKey);

    function teste() {
    
    }

    async function salvarOferta() {

        //const program = new Program();

        



    }





    return (

        <div>
        
            <table>
                <tr>
                    <td>Preço do token</td>
                    <input type="text" id="oferta" name="oferta" />
                    <button onClick={teste}>Enviar</button>
                </tr>
            </table>
        </div>
            
    );
}

export default Oferta;