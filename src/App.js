import React, { useState, useEffect } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";

const TWITTER_HANDLE = "parksthegreen";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const TEST_GIFS = [
  "https://media.giphy.com/media/Z1kpfgtHmpWHS/giphy.gif",
  "https://media.giphy.com/media/WaugJpjO79kDm/giphy.gif",
  "https://media.giphy.com/media/5Vy3WpDbXXMze/giphy.gif",
  "https://media.giphy.com/media/bUPxPtjImNhO8/giphy.gif"
];

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  /*
   * This function holds the logic for deciding if a Phantom Wallet is
   * connected or not
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found!");

          /*
           * The solana object gives us a function that will allow us to connect
           * directly with the user's wallet!
           */
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            "Connected with Public Key:",
            response.publicKey.toString()
          );
          /*
           * Set the user's publicKey in state to be used later!
           */
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana object not found! Get a Phantom Wallet 👻");
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   *  invokes an instance of solana.connect() and sets walletAddress for conditional rendering
   */
  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('Gif link:', inputValue)
    } else {
      console.log('Empty input. Try again.')
    }
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  /*
   * We want to render this UI when the user hasn't connected
   * their wallet to our app yet.
   */
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  /**
   * Render this UI if the user has connected their phantom wallet to app
   * --> maps() and render each gif from TEST_GIFS
   */
  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}
      >
        <input
          type="text"
          placeholder="Enter a .gif link!" 
          value={inputValue}
          onChange={onInputChange} 
        />
        <button
          type="submit"
          className="cta-button submit-gif-button"
        >
          Submit
        </button>
      </form>
      <div className="gif-grind">
        {TEST_GIFS.map((gif) => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif}/>
          </div>  
        ))}
      </div>
    </div>
  );

  /*
   * When our component first mounts, let's check to see if we have a connected
   * Phantom Wallet
   */
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className="App">
      {/* This was solely added for some styling fanciness */}
      <div className={walletAddress ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {/* Add the condition to show this only if we don't have a wallet address */}
          {!walletAddress && renderNotConnectedContainer()}
          {/* render gifs if wallet is connected */}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
