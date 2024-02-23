import { useEth } from '../contexts/EthContext';
import { useEffect, useState } from 'react';
import styles from './PageMain.module.css';

function PageMain() {
    const { state } = useEth();
    useEffect(() => {
        state?.productManager?.events.SupplyChainStep().on('data', async (event) => {
            if (+event.returnValues._step === 1) {
                const product = await state.productManager.methods.products(event.returnValues._productIndex).call();
                alert(`Product ${product._identifier} was paid, deliver it now!`);
            }
        });
    }, [state]);
    const [enteredProductPrice, setEnteredProductPrice] = useState('');
    const [enteredProductName, setEnteredProductName] = useState('');
    const handlerOfCreatingProduct = async (e) => {
        if (enteredProductPrice <= 0) {
            alert('Invalid product price');
            return;
        }
        if (!enteredProductName) {
            alert('Invalid product name');
            return;
        }
        const result = await state.productManager.methods
            .createProduct(enteredProductName, enteredProductPrice)
            .send({ from: state.accounts[0] });
        alert(`Send ${enteredProductPrice} Wei to ${result.events.SupplyChainStep.returnValues._productAddress}`);
    };
    return (
        <>
            {!state?.isLoaded ? (
                <p>⚠️ MetaMask is not connected to the same network as the one you deployed to.</p>
            ) : (
                <>
                    <div className={styles.container}>
                        <h1>Mini Payment Tracking</h1>
                        <h2>Event Trigger / Supply Chain</h2>
                        <hr />
                        <div>
                            <h3>Add product</h3>
                            <div className={styles.addingProductBody}>
                                Price in Wei:{' '}
                                <input
                                    type='text'
                                    placeholder='Product price'
                                    value={enteredProductPrice}
                                    onChange={(e) => {
                                        if (/^\d+$|^$/.test(e.target.value)) {
                                            setEnteredProductPrice(e.target.value);
                                        }
                                    }}
                                />
                                <input
                                    type='text'
                                    placeholder='Product name'
                                    value={enteredProductName}
                                    onChange={(e) => setEnteredProductName(e.target.value)}
                                />
                                <button type='button' onClick={handlerOfCreatingProduct}>
                                    Create product
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default PageMain;
