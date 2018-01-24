import React from 'react';
import FileCard from './FileCard';

const fileList = (props) => {
  return props.files.map((file) => (
    <FileCard 
      file={ file } 
      uploadToIpfs={ props.uploadToIpfs } 
      deleteFile={ props.deleteFile }
      key={ file.contentHash } />
  ));
}

const FileTracker = (props) => {
  return (
    <div className='file-tracker'>
      { props.files ? fileList(props) : null }
    </div>
  )
}

export default FileTracker;