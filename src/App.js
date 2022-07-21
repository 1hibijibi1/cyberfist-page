import React, { Component } from 'react';
import Typist from 'react-typist';
import './App.css';
import Configs from './configurations.json';
import ERC721_ABI from "./contract-abi.json";
import { ethers } from "ethers";
import './style.css';
import cyberhead from './cyberfist-head.png';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      darkBackgroundModes: [
        'day',
        'terminal',
        'torquoise',
        'alizarin',
        'amythyst',
        'carrot',
        'peterriver'
      ],
      lightBackgroundModes: [
        'night',
        'lightred',
        'lightpurple',
        'lightgreen',
        'lightblue',
        'lightyellow'
      ],
      backgroundType: Configs.backgroundType || 'plain',
      appClass: Configs.plainBackgroundMode || 'daylight',
      devIntro: Configs.devIntro || 'Lorem Ipsum',
      devDesc:
        Configs.devDesc ||
        'Aute veniam ut deserunt cillum irure pariatur Lorem dolore anim nostrud quis veniam elit culpa.',
      backgroundMode: 'default',
      backgroundIndex: 0,
      bgStyle: {},
      icons: Configs.icons || []
    };
  }

  componentWillMount = () => {
    
  };

    async connectToMetamask() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const accounts = await provider.send("eth_requestAccounts", []);
        const balance = await provider.getBalance(accounts[0]);
        const balanceInEther = ethers.utils.formatEther(balance);
        const block = await provider.getBlockNumber();

        provider.on("block", (block) => {
            this.setState({ block })
        })

        const cyberfistContract = new ethers.Contract('0x8cd7230d75D864a93Cb597053AD5438B90f08d40', ERC721_ABI, provider);
        const tokenName = await cyberfistContract.name();
        const CyberfistContractadd = ('0x8cd7230d75D864a93Cb597053AD5438B90f08d40');


        this.setState({ selectedAddress: accounts[0], balance: balanceInEther, block, tokenName, CyberfistContractadd })
    }

    async mint(_quantity) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()

        const cyberfistContract = new ethers.Contract('0x8cd7230d75D864a93Cb597053AD5438B90f08d40', ERC721_ABI, provider);

        const cyberfistContractWithSigner = cyberfistContract.connect(signer);
        cyberfistContractWithSigner.mint(_quantity)
    }

    renderMetamask() {
        if (!this.state.selectedAddress) {
            return (
                <button onClick={() => this.connectToMetamask()}>Connect to Metamask</button>
            )
        } else {
            return (
                <div className="mint-welcome">
                    <p>Welcome, {this.state.selectedAddress}</p>
                    <p>Contract Name: {this.state.tokenName}</p>
                    <button onClick={() => this.mint("1")}>Mint 1 Cyberfist</button>
                </div>
            );
        }
    }
    componentDidMount() {
        document.title = "Mint Page";
    } 

  render() {
    const {
      appClass, bgStyle, backgroundMode, devIntro, devDesc, icons
    } = this.state;

    return (
      <div className={appClass} style={bgStyle}>
        <div
          className={backgroundMode}
        >
          <main className="App-main">
            
            <div className="container">
             <h1 className="intro">{devIntro}</h1>
            <div className="shell">Cyberfist</div>
            <div><img src={cyberhead} alt="cyberfist" height={270}/></div>
            <div className="tagline"></div>   
            <div className="mm-btn"> {this.renderMetamask()}</div>
                <Typist>{devDesc}</Typist>
                       
            <div className="icons-social">
                {icons.map((icon, i) => (
                  <a
                    target="_blank"
                    key={i}
                    rel="noopener noreferrer"
                    href={`${icon.url}`}
                  >
                    <i className={`fab ${icon.image}`} />
                  </a>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default App;
