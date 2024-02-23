import React, { useReducer, useCallback, useEffect } from 'react';
import Web3 from 'web3';
import EthContext from './EthContext';
import { reducer, actions, initialState } from './state';

function EthProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const init = useCallback(async (artifactProductManager, artifactProduct) => {
        if (artifactProductManager && artifactProduct) {
            const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
            const accounts = await web3.eth.requestAccounts();
            const networkID = await web3.eth.net.getId();
            const { abi: abiProductManager } = artifactProductManager;
            let addressProductManager, contractProductManager;
            try {
                addressProductManager = artifactProductManager.networks[networkID].address;
                contractProductManager = new web3.eth.Contract(abiProductManager, addressProductManager);
            } catch (err) {
                console.error(err);
            }
            const { abi: abiProduct } = artifactProduct;
            let addressProduct, contractProduct;
            try {
                addressProduct = artifactProduct.networks[networkID]?.address;
                contractProduct = new web3.eth.Contract(abiProduct, addressProduct);
            } catch (err) {
                console.error(err);
            }
            dispatch({
                type: actions.init,
                data: {
                    isLoaded: true,
                    web3,
                    accounts,
                    networkID,
                    productManager: contractProductManager,
                    product: contractProduct,
                },
            });
        }
    }, []);
    useEffect(() => {
        const tryInit = async () => {
            try {
                init(require('../../contracts/ProductManager.json'), require('../../contracts/Product.json'));
            } catch (err) {
                console.error(err);
            }
        };
        tryInit();
    }, [init]);
    useEffect(() => {
        const events = ['chainChanged', 'accountsChanged'];
        const handleChange = () => {
            init(state.artifact);
        };

        events.forEach((e) => window.ethereum.on(e, handleChange));
        return () => {
            events.forEach((e) => window.ethereum.removeListener(e, handleChange));
        };
    }, [init, state.artifact]);
    return (
        <EthContext.Provider
            value={{
                state,
                dispatch,
            }}
        >
            {children}
        </EthContext.Provider>
    );
}

export default EthProvider;
