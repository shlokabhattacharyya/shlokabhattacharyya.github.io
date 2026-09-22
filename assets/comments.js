// friends comments — backed by Firebase Firestore (free tier, no server needed)
// setup: paste your web app config from console.firebase.google.com below,
// then publish the rules in firestore.rules.

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
    getFirestore, collection, addDoc, getDocs, getCountFromServer,
    query, orderBy, limit, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyAU1azaQ7V0p4EHIDGJn_KlaboJdVUYSa4",
  authDomain: "project-website-7ea1d.firebaseapp.com",
  projectId: "project-website-7ea1d",
  storageBucket: "project-website-7ea1d.firebasestorage.app",
  messagingSenderId: "750300169166",
  appId: "1:750300169166:web:5e24a61abe5095d247219f"
};

const PAGE = 10;      // comments shown by default
const MAX = 200;      // comments shown after "view all"
const COOLDOWN = 60;  // seconds between posts from the same browser

const $ = id => document.getElementById(id);
const els = {
    shown: $('c-shown'), total: $('c-total'), viewAll: $('c-view-all'), add: $('c-add'),
    form: $('c-form'), name: $('c-name'), text: $('c-text'), website: $('c-website'),
    post: $('c-post'), status: $('c-status'), count: $('c-count'), list: $('c-list'),
};
if (!els.list) throw new Error('comments: markup missing');

const escape = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'june', 'july', 'aug', 'sept', 'oct', 'nov', 'dec'];
function fmt(ts) {
    const d = ts && ts.toDate ? ts.toDate() : new Date();
    let h = d.getHours(); const ampm = h >= 12 ? 'pm' : 'am'; h = h % 12 || 12;
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} at ${h}:${m} ${ampm}`;
}

function setStatus(msg, kind) {
    els.status.textContent = msg;
    els.status.className = 'comment-status' + (kind ? ' ' + kind : '');
}
function resetCount() {
    els.count = document.createElement('span'); els.count.id = 'c-count';
    els.status.className = 'comment-status';
    els.status.textContent = '';
    els.status.append(els.count, ' characters left');
    updateCount();
}
function updateCount() { els.count.textContent = 500 - els.text.value.length; }

// --- not configured yet: show a friendly note instead of a broken box ---
if (firebaseConfig.projectId === 'PASTE_YOUR_PROJECT') {
    els.shown.textContent = '0'; els.total.textContent = '0';
    els.list.innerHTML = '<div class="comment-empty">comments aren\'t set up yet — paste your firebase config into assets/comments.js.</div>';
    els.add.addEventListener('click', e => e.preventDefault());
    els.viewAll.addEventListener('click', e => e.preventDefault());
} else {
    const db = getFirestore(initializeApp(firebaseConfig));
    const col = collection(db, 'comments');
    let showingAll = false;

    async function load() {
        try {
            const [snap, countSnap] = await Promise.all([
                getDocs(query(col, orderBy('createdAt', 'desc'), limit(showingAll ? MAX : PAGE))),
                getCountFromServer(col),
            ]);
            const total = countSnap.data().count;
            els.total.textContent = total;
            els.shown.textContent = snap.size;
            els.viewAll.style.display = (total > PAGE && !showingAll) ? '' : 'none';

            if (snap.empty) {
                els.list.innerHTML = '<div class="comment-empty">no comments yet. be the first!</div>';
                return;
            }
            els.list.innerHTML = snap.docs.map(doc => {
                const c = doc.data();
                return `<div class="comment"><div class="who">${escape(c.name || 'anonymous')}</div>` +
                    `<div class="what"><div class="when">${fmt(c.createdAt)}</div>` +
                    `<div class="text">${escape(c.text || '')}</div></div></div>`;
            }).join('');
        } catch (err) {
            console.error(err);
            els.list.innerHTML = '<div class="comment-empty">couldn\'t load comments right now. try refreshing.</div>';
        }
    }

    els.viewAll.addEventListener('click', e => { e.preventDefault(); showingAll = true; load(); });

    els.add.addEventListener('click', e => {
        e.preventDefault();
        els.form.hidden = !els.form.hidden;
        if (!els.form.hidden) els.name.focus();
    });

    els.text.addEventListener('input', updateCount);

    els.form.addEventListener('submit', async e => {
        e.preventDefault();
        const name = els.name.value.trim();
        const text = els.text.value.trim();
        if (els.website.value) return;                       // honeypot: bots fill hidden fields
        if (!name || !text) { setStatus('name and comment are both required.', 'error'); return; }
        if (name.length > 40 || text.length > 500) { setStatus('too long! 40 chars for names, 500 for comments.', 'error'); return; }

        let last = 0;
        try { last = Number(localStorage.getItem('c-last') || 0); } catch {}
        const wait = COOLDOWN - Math.round((Date.now() - last) / 1000);
        if (wait > 0) { setStatus(`slow down! try again in ${wait}s.`, 'error'); return; }

        els.post.disabled = true;
        setStatus('posting…');
        try {
            await addDoc(col, { name, text, createdAt: serverTimestamp() });
            try { localStorage.setItem('c-last', String(Date.now())); } catch {}
            els.text.value = '';
            els.form.hidden = true;
            resetCount();
            showingAll = false;
            await load();
            els.list.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } catch (err) {
            console.error(err);
            setStatus('couldn\'t post — check your connection and try again.', 'error');
        } finally {
            els.post.disabled = false;
        }
    });

    load();
}