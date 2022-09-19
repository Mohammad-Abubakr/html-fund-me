import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("ConnectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
  if (typeof !window.ethereum !== "undefined") {
    console.log("Metamask is present")
    await window.ethereum.request({ method: "eth_requestAccounts" })
    connectButton.innerHTML = "Connected!"
  } else {
    console.log("No metamask detected")
    connectButton.innerHTML = "Install Metamask"
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value
  if (typeof !window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      })
      await waitForTransactionMined(transactionResponse, provider)
      console.log("Done")
    } catch (error) {
      console.log(error)
    }
  }
}

function waitForTransactionMined(transactionResponse, provider) {
  console.log(`Mining at :${transactionResponse.hash}`)
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with :${transactionReceipt.confirmations} confirmations`
      )
      resolve()
    })
  })
}

async function getBalance() {
  if (typeof !window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    console.log(ethers.utils.formatEther(balance))
    document.getElementById("balanceField").innerHTML =
      ethers.utils.formatEther(balance)
  }
}

async function withdraw() {
  if (typeof !window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    console.log(`Signer:  ${contractAddress}`)
    try {
      const transactionResponse = await contract.withdraw()
      await waitForTransactionMined(transactionResponse, provider)
      console.log("Done")
    } catch (error) {
      console.log(error)
    }
  }
}
