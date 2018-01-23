import React from 'react';

const formatBytes = (bytes) => {
   if(bytes === 0) return 'n/a';
   const k = 1024,
       sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
       i = Math.floor(Math.log(bytes) / Math.log(k));
   return `${ parseFloat((bytes / Math.pow(k, i)).toFixed(0)) } ${ sizes[i] }`;
}

const getIpfsAddress = (hash) => `https://ipfs.io/ifps/${ hash }`;

const FileCard = (props) => {
  return (
    <div className='file-card'>
      <div className='file-card-filename'><strong>{ props.file.name }</strong></div> 
      <div className='file-card-filesize'>{ formatBytes(props.file.size) }</div>
      <div className='file-card-image'>
        <img src={ props.file.previewURL } className='preview-image' alt={ props.file.name }/>
      </div>
      <div className='file-card-options'>
        { props.file.ipfsHash 
          ? getIpfsAddress(props.file.ipfsHash) 
          : <button onClick={ () => props.uploadToIpfs(props.file) }>Upload to IPFS</button>}
      </div>
    </div>
  );
}

export default FileCard;