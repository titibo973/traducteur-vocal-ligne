const textTop = document.getElementById('text-top'), textBottom = document.getElementById('text-bottom');
const bgCol = document.getElementById('bgCol'), colInact = document.getElementById('colInact'), colAct = document.getElementById('colAct');

function setNom(id) {
    const nom = prompt("Entrez votre nom/initiale :");
    if (nom) document.getElementById(id).innerText = nom.charAt(0).toUpperCase();
}

bgCol.addEventListener('input', (e) => {
    document.getElementById('zoneTop').style.backgroundColor = e.target.value;
    document.getElementById('zoneBottom').style.backgroundColor = e.target.value;
});

function updateBtn(btn, active) {
    btn.style.backgroundColor = active ? colAct.value : colInact.value;
}

async function lancerTraduction(cote) {
    const btn = document.getElementById(cote === 'top' ? 'btnTop' : 'btnBottom');
    const source = document.getElementById(cote === 'top' ? 'langTop' : 'langBottom').value;
    const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    
    rec.onstart = () => { btn.classList.add('active'); updateBtn(btn, true); };
    rec.onend = () => { btn.classList.remove('active'); updateBtn(btn, false); };
    rec.start();

    rec.onresult = async (e) => {
        const res = await fetch('/api/traductions', { method: 'POST', body: JSON.stringify({ texte: e.results[0][0].transcript, source: source.split('-')[0], cible: (source==='fr-FR'?'pt':'fr'), moteur: 'GLOBAL' }), headers:{'Content-Type':'application/json'}});
        const data = await res.json();
        if (cote === 'top') { textTop.innerText = e.results[0][0].transcript; textBottom.innerText = data.traduction; }
        else { textBottom.innerText = e.results[0][0].transcript; textTop.innerText = data.traduction; }
    };
}