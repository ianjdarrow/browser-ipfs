import React, { Component } from 'react';
import IPFS from 'ipfs';
import './App.css';

import FileTracker from './components/FileTracker';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      node: null,
      files: []    
    }
  }

  async componentWillMount() {
    const config = {
      Addresses: {
        Swarm: [
          '/dns4/wrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star'
        ]
      }
    }
    const node = new IPFS({ config, repo: 'ian-repo-123123' });
    node.once('ready', async () => {
      const rdy = await node.id();
      const online = node.isOnline();
      console.log(online ? `IPFS node online with id ${ rdy.id }` : `Failed to start node`);
    });
    this.setState({ node });
  }

  saveFile = async (e) => {
    if(!(e.target.files && e.target.files.length > 0)) return;
    const previewReader = new FileReader(),
          rawReader = new FileReader(),
          file = e.target.files[0],
          result = {
            name: file.name,
            type: file.type,
            size: file.size,
            ipfsHash: ''
          };

    previewReader.onloadend = () => {
      result.previewURL = previewReader.result;
    }
    rawReader.onloadend = async () => {
      result.raw = rawReader.result;
      const contentHash = await window.crypto.subtle.digest('SHA-256', result.raw);
      result.contentHash = btoa(String.fromCharCode(...new Uint8Array(contentHash))); 
      let files = this.state.files;
      files.push(result);
      this.setState({ files });
      this.refs.fileInput.value = null;
    }
    await previewReader.readAsDataURL(file);
    rawReader.readAsArrayBuffer(file);
  };

  uploadToIpfs = async (file) => {
    this.state.node.files.add(Buffer.from(file.raw), (err, filesAdded) => {
      if (err) throw err;
      const added = filesAdded[0];
      file.ipfsHash = added.hash;
      console.log(`Added file: ${ added.hash }`);
      const files = this.state.files;
      const toUpdate = files.findIndex((item) => item.contentHash === file.contentHash);
      files[toUpdate] = file;
      this.setState({ files });
    });
  }

  deleteFile = (file) => {
    const files = this.state.files;
    const toDelete = files.findIndex((item) => item.contentHash === file.contentHash);
    files.splice(toDelete, 1);
    this.setState({ files });
  }

  render() {
    return (
      <div className="app">
        <input type='file' ref='fileInput' onChange={ this.saveFile } />
        <FileTracker 
          files={ this.state.files } 
          uploadToIpfs={ this.uploadToIpfs }
          deleteFile={ this.deleteFile }/>
      </div>
    );
  }
}

export default App;
