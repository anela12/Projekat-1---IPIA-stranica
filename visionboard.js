document.addEventListener('DOMContentLoaded', () => {

  const board = document.getElementById('board');
  const addNoteBtn = document.getElementById('addNoteBtn');
  const addImageBtn = document.getElementById('addImageBtn');
  const addQuoteBtn = document.getElementById('addQuoteBtn');
  const saveBtn = document.getElementById('saveBtn');
  const clearBtn = document.getElementById('clearBtn');
  const pdfBtn = document.getElementById('pdfBtn');
  const mailBtn = document.getElementById('mailBtn');
  const popup = document.getElementById('popup');
  const sendEmailBtn = document.getElementById('sendEmail');
  const cancelEmailBtn = document.getElementById('cancelEmail');

  const colors = ["color1","color2","color3"];

  // Primjeri slika i citata
const sampleImages = [
  "slika1.png",
  "slika2.png",
  "slika3.png",
  "slika4.png"
];

  const sampleQuotes = [
    "“Svaka dovoljno napredna tehnologija jednaka je magiji.” – Arthur C. Clarke",
    "“Tehnologija je riječ koja opisuje nešto što još ne funkcionira.” – Douglas Adams",
    "“Ne osnivate zajednice. Zajednice već postoje. Pitanje je kako im možete pomoći da budu bolje.” – Mark Zuckerberg"
  ];

  function makeDraggable(el){
    let offsetX=0, offsetY=0, dragging=false;
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.type = 'button';
    delBtn.textContent = '✖';
    el.appendChild(delBtn);

    delBtn.addEventListener('click', (e)=>{ e.stopPropagation(); el.remove(); });

    el.addEventListener('mousedown', (e)=>{
      if(e.target===delBtn) return;
      dragging=true;
      offsetX=e.clientX-el.offsetLeft;
      offsetY=e.clientY-el.offsetTop;
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });

    function onMove(e){ if(!dragging) return; el.style.left=(e.clientX-offsetX)+'px'; el.style.top=(e.clientY-offsetY)+'px'; }
    function onUp(){ dragging=false; document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); }
  }

  addNoteBtn.addEventListener('click', ()=>{
    const note = document.createElement('div');
    note.className = 'note '+colors[Math.floor(Math.random()*colors.length)];
    note.contentEditable='true';
    note.style.left=Math.floor(Math.random()*400)+'px';
    note.style.top=Math.floor(Math.random()*200)+'px';
    note.textContent='Napiši nešto...';
    makeDraggable(note);
    board.appendChild(note);
  });

  addImageBtn.addEventListener('click', ()=>{
    const div = document.createElement('div');
    div.className='pinned-img';
    div.style.left=Math.floor(Math.random()*400)+'px';
    div.style.top=Math.floor(Math.random()*200)+'px';
    const img=document.createElement('img');
    img.src=sampleImages[Math.floor(Math.random()*sampleImages.length)];
    div.appendChild(img);
    makeDraggable(div);
    board.appendChild(div);
  });

  addQuoteBtn.addEventListener('click', ()=>{
    const q=document.createElement('div');
    q.className='quote';
    q.textContent=sampleQuotes[Math.floor(Math.random()*sampleQuotes.length)];
    q.style.left=Math.floor(Math.random()*400)+'px';
    q.style.top=Math.floor(Math.random()*200)+'px';
    q.contentEditable='true';
    makeDraggable(q);
    board.appendChild(q);
  });

  saveBtn.addEventListener('click', ()=>{
    const items=[];
    document.querySelectorAll('#board > div').forEach(el=>{
      items.push({className:el.className, html:el.innerHTML, left:el.style.left, top:el.style.top});
    });
    localStorage.setItem('visionBoardItems', JSON.stringify(items));
    alert('Board spremljen lokalno.');
  });

  function loadBoard(){
    const data=localStorage.getItem('visionBoardItems');
    if(!data) return;
    try{
      const items=JSON.parse(data);
      items.forEach(item=>{
        const div=document.createElement('div');
        div.className=item.className;
        div.style.left=item.left;
        div.style.top=item.top;
        div.innerHTML=item.html;
        makeDraggable(div);
        board.appendChild(div);
      });
    }catch(e){ console.error('Greška pri učitavanju board-a:',e); }
  }
  loadBoard();

  clearBtn.addEventListener('click', ()=>{
    if(confirm('Želite li očistiti ploču?')){
      board.innerHTML='';
      localStorage.removeItem('visionBoardItems');
    }
  });

  function renderBoardToDataURL(){
    return new Promise((resolve,reject)=>{
      if(typeof html2canvas==='undefined'){ reject(new Error('html2canvas nije učitan.')); return; }
      html2canvas(board,{useCORS:true, scale:2}).then(canvas=>{
        try{ resolve(canvas.toDataURL('image/png')); }catch(err){ reject(err); }
      }).catch(err=>reject(err));
    });
  }

  pdfBtn.addEventListener('click', async ()=>{
    try{
      pdfBtn.disabled=true;
      pdfBtn.textContent='Generišem...';
      const dataURL=await renderBoardToDataURL();
      const a=document.createElement('a');
      a.href=dataURL;
      a.download='vision_board.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      if(confirm('Slika je preuzeta. Želite li otvoriti prozor za ispis?')){
        const w=window.open('');
        w.document.write('<img src="'+dataURL+'" style="width:100%"/>');
        w.document.close();
        w.focus();
        w.print();
      }
    }catch(err){ console.error(err); alert('Greška: '+err.message); }
    finally{ pdfBtn.disabled=false; pdfBtn.textContent='Snimi kao PDF/Slika'; }
  });

  mailBtn.addEventListener('click', ()=>{ popup.style.display='flex'; popup.setAttribute('aria-hidden','false'); });
  cancelEmailBtn.addEventListener('click', ()=>{ popup.style.display='none'; popup.setAttribute('aria-hidden','true'); });

  sendEmailBtn.addEventListener('click', async ()=>{
    const email=document.getElementById('emailInput').value.trim();
    if(!email){ alert('Unesite email!'); return; }
    try{
      sendEmailBtn.disabled=true;
      sendEmailBtn.textContent='Šaljem...';
      const dataURL=await renderBoardToDataURL();
      const subject=encodeURIComponent('Vision Board');
      const body=encodeURIComponent('Ovo je screenshot vaše ploče (Base64). Ako se ne prikaže, preuzmite sliku i priložite ručno.%0A%0A') + encodeURIComponent(dataURL);
      const mailto=`mailto:${encodeURIComponent(email)}?subject=${subject}&body=${body}`;
      window.location.href=mailto;
      setTimeout(()=>{ popup.style.display='none'; popup.setAttribute('aria-hidden','true'); },300);
    }catch(err){ console.error(err); alert('Greška pri slanju emaila: '+err.message); }
    finally{ sendEmailBtn.disabled=false; sendEmailBtn.textContent='Pošalji'; }
  });

  popup.addEventListener('click', (e)=>{ if(e.target===popup){ popup.style.display='none'; popup.setAttribute('aria-hidden','true'); } });

  console.log('Vision board inicijalizovan — html2canvas:', typeof html2canvas!=='undefined');
});
