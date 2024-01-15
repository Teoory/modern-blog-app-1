import ReactQuill from 'react-quill';
import Quill from 'quill';
import './Editor.css';

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
        ['link', 'image', 'video'],
        ['custom-hr']
    ]
};
  
const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image',
    'custom-hr'
];

const HorizontalLine = Quill.import('blots/block/embed');
HorizontalLine.blotName = 'custom-hr';
HorizontalLine.tagName = 'hr';
Quill.register(HorizontalLine);

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    document.getElementsByClassName("ql-toolbar ql-snow")[0].style.position = "fixed";
    document.getElementsByClassName("ql-toolbar ql-snow")[0].style.top = 0;
    document.getElementsByClassName("ql-toolbar ql-snow")[0].style.zIndex = 999;
    document.getElementsByClassName("ql-toolbar ql-snow")[0].style.backgroundColor = "white";
  } else {
    document.getElementsByClassName("ql-toolbar ql-snow")[0].style.position = "relative";
  }
}

  return (
    <ReactQuill theme="snow" 
                value={value}
                onChange={onChange} 
                modules={modules}
                formats={formats} />
  )
}

export default Editor