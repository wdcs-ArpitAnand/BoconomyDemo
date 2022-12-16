import { useState } from "react";
import Greeter from "./api/Greeter.json";
import { Biconomy } from "@biconomy/mexa";
import { ethers } from "ethers";
// import * as dotenv from "dotenv";
import "./App.css";

require('dotenv').config()

const App = () => {
  const [greetingValue, setGreetingValue] = useState("");

  const greeterAddress = "0x976eA34a98EFA0447552882978f0396b3008e79F";

  const requestAccounts = async () => {
    return await window.ethereum.request({ method: "eth_requestAccounts" });
  };

  const fetchGreeting = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet();
        console.log("data: ", data);
        alert(data);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  };


  const setGreeting = async () => {

    if (!greetingValue) return;
    if (typeof window.ethereum !== "undefined") {
      const accounts = await requestAccounts();

      console.log("DS",process.env)
      const biconomy = new Biconomy(window.ethereum, {
        apiKey: "Lx7VaQ4EU.2551605e-d86c-463a-9e86-ecfc300e9074",
        debug: true,
        contractAddresses: [greeterAddress],
      });
      const provider = await biconomy.provider;

      const contractInstance = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        biconomy.ethersProvider
      );
      await biconomy.init();

      const { data } = await contractInstance.populateTransaction.SayHello(
        greetingValue
      );

      let txParams = {
        data: data,
        to: greeterAddress,
        from: accounts[0],
        signatureType: "EIP712_SIGN",
      };

      await provider.send("eth_sendTransaction", [txParams]);
    }
  };

  return (
    <div className="App">
      <h3>Biconomy Gassless Transaction</h3>
      <div className="setGreeter">
        <input
          placeholder="EnterMessage"
          value={greetingValue}
          onChange={(e) => setGreetingValue(e.target.value)}
        />
        <button onClick={setGreeting}>Set Greeting</button>
      </div>
      <div className="getGreeter">
        <button onClick={fetchGreeting}>Get Greeting</button>
      </div>
    </div>
  );
};

export default App;
