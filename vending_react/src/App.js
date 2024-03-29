import "./App.css"
import { ethers } from "ethers"
import { useState } from "react"
import VendingMachine from "./artifacts/contracts/VendingMachine.sol/VendingMachine.json"

const VENDING_MACHINE_ADDRESS = "0x66e5CE39C90341f54b6D5B43710B2e034CDe6A7D"

function App() {
    /* functions */
    // get request account
    const [buyerBalance, setBuyerBalance] = useState()
    const [vendingBalance, setVendingBalance] = useState()
    const [count, setCount] = useState() // purchase
    const [amount, setAmount] = useState() // restock

    async function RequestAccount() {
        await window.ethereum.request({ method: "eth_requestAccounts" })
    }

    // get buyer balance
    async function getBuyerBalance() {
        // getting the Buyer Balance from the contract

        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const vendingContract = new ethers.Contract(
                VENDING_MACHINE_ADDRESS,
                VendingMachine.abi,
                signer
            )
            try {
                /*
                function getBuyerBalancer() public view returns (uint256) {
                    return donutBalances[msg.sender];
                }
                */
                const newBuyerBalance = await vendingContract.getBuyerBalancer()
                console.log("BuyerBalance", newBuyerBalance.toString())
                setBuyerBalance(newBuyerBalance.toString())
            } catch (error) {
                console.log(error)
            }
        }
    }

    // get vending balance
    async function getVendingBalance() {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const vendingContract = new ethers.Contract(
                VENDING_MACHINE_ADDRESS,
                VendingMachine.abi,
                provider
            )
            try {
                // call contract.getVendingBalance() and display current balance of vending machine
                /*
                 function getVendingMachineBalance() public view returns (uint256) {
                    return donutBalances[address(this)];
                 }
                */
                const newVendingBalance = await vendingContract.getVendingMachineBalance()
                console.log("vending balance is: ", newVendingBalance.toString())
                // set in the useState
                setVendingBalance(newVendingBalance.toString())
            } catch (error) {
                console.log("Error: ", error)
            }
        }
    }

    // purchase
    async function purchase() {
        if (!count) return
        if (typeof window.ethereum !== "undefined") {
            try {
                await RequestAccount()

                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const signer = provider.getSigner()
                const vendingContract = new ethers.Contract(
                    VENDING_MACHINE_ADDRESS,
                    VendingMachine.abi,
                    signer
                )

                const price = await vendingContract.price()
                const value = (price * count).toString()

                const purchaseTx = await vendingContract.purchase(count, {
                    value: value,
                    gasLimit: 300000,
                })

                setCount()
                await purchaseTx.wait()
            } catch (error) {
                console.log("Purchase Error:", error)
            }
        } else {
            console.log("type is undefined")
        }
    }

    // restock
    async function restock() {
        if (!amount) {
            return
        }

        if (typeof window.ethereum !== "undefined") {
            await RequestAccount()

            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()

            // creating the contract with signer

            const vendingContract = new ethers.Contract(
                VENDING_MACHINE_ADDRESS,
                VendingMachine.abi,
                signer
            )
            const restockTX = await vendingContract.restock(amount, { gasLimit: 300000 })

            setAmount()
            await restockTX.wait() // complete the transaction
        }
    }

    // front side ---> jsx
    return (
        <div className="App">
            <div className="App-Header">
                <div className="description">
                    <h1 className="app-name">Token Vending</h1>
                    <h3>Full stack dapp using ReactJS and Hardhat</h3>
                </div>

                {/* buttons section */}

                <div className="custom-buttons">
                    <button className="get-func" onClick={getVendingBalance}>
                        vending balance
                    </button>
                    <button className="tx-func" onClick={restock}>
                        restock
                    </button>

                    <button className="get-func" onClick={getBuyerBalance}>
                        Buyer Balance
                    </button>
                    <button className="tx-func" onClick={purchase}>
                        Purchse
                    </button>
                </div>

                {/* Current count stored on Blockchain */}

                <div className="display">
                    <h2 className="vending-balance"> Vending balance: {vendingBalance}</h2>
                    <h2 className="user-balance"> User balance: {buyerBalance}</h2>
                </div>

                {/* input section for change states of BlockChain */}

                <input
                    onChange={(e) => setAmount(e.target.value)}
                    value={amount}
                    placeholder="Set Restock amount"
                />
                <input
                    onChange={(v) => {
                        setCount(v.target.value)
                    }}
                    value={count}
                    placeholder="count of product"
                />

                <h5 className="hint">
                    This is a simple demo version of the application. <br />
                    Please note that it is for demonstration purposes only <br />
                    and will be used in a more robust version in thefuture.
                </h5>
            </div>
        </div>
    )
}

export default App
// this comment is for seyyad branch
