export let pvk: string;
export let pbk: string;
export let token: string;

function Addresses() {

    function pegarPvtKey() {
        //pegar valor do input
        const pvtKey = (document.getElementById("pvtKey") as HTMLInputElement).value;
        alert(pvtKey);
        pvk = pvtKey;
    }
    function pegarPubkey() {
        //pegar valor do input
        const pubKey = (document.getElementById("pubKey") as HTMLInputElement).value;
        alert(pubKey);
        pbk = pubKey;
        return pubKey;
    }
    
    function pegarToken() {
        //pegar valor do input
        const tokenKey = (document.getElementById("tokenKey") as HTMLInputElement).value;
        alert(tokenKey);
        token = tokenKey;
    }

    function handleClick() {
        pegarPvtKey();
        pegarPubkey();
        pegarToken();
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
        </div>  


    );
}
export default Addresses;