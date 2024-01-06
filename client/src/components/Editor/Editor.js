import ReactQuill from 'react-quill';

const Editor = ({value, onChange}) => {
    
const modules = {
    toolbar: [
        [{ 'font': [] }],
        [{ 'header': [1, 2, 3, 4, false] }],
        
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }, {'indent': '-1'}, {'indent': '+1'}],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['link', 'image']
    ]
};
  
const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
];

  return (
    <ReactQuill theme="snow" 
                value={value}
                onChange={onChange} 
                modules={modules}
                formats={formats} />
  )
}

export default Editor