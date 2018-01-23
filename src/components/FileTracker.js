import React from 'react';
import FileCard from './FileCard';

const fileList = (props) => {
  return props.files.map((file) => (
    <FileCard file={ file } uploadToIpfs={ props.uploadToIpfs } key={ String(Math.random() + Date.now()) } />
  ));
}

const FileTracker = (props) => {
  return (
    <div className='file-tracker'>
      <h3>Files</h3>
      { props.files ? fileList(props) : null }
    </div>
  )
}

export default FileTracker;