document.addEventListener('DOMContentLoaded', () => {

    // ----- active nav link -----
    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
    document.querySelectorAll('.navstrip a').forEach(link => {
        const linkPath = new URL(link.href).pathname.replace(/\/$/, '') || '/';
        const isActive = linkPath === currentPath ||
            (linkPath !== '/' && currentPath.startsWith(linkPath + '/'));
        if (isActive) link.classList.add('active');
    });

    // ----- site-wide search -----
    // add new posts / projects / articles here so search can find them
    const SITE_INDEX = [
        // blog
        { kind: 'blog', title: 'information aggregation and its failure modes', sub: 'when the crowd is only one person', url: '/blog/information-aggregation-and-its-failure-modes/' },
        { kind: 'blog', title: 'mechanistic interpretability for AI safety', sub: 'how we can "read AI\'s mind"', url: '/blog/mechanistic-interpretability-for-ai-safety/' },
        { kind: 'blog', title: 'do you have good taste?', sub: 'how our perception of quality is changing', url: '/blog/do-you-have-good-taste/' },
        // projects
        { kind: 'project', title: 'statistical-arbitrage-backtester', sub: 'pairs-trading statistical arbitrage backtester with cointegration-based mean reversion. Python numpy pandas statsmodels yfinance', url: 'https://github.com/shlokabhattacharyya/statistical-arbitrage-backtester' },
        { kind: 'project', title: 'neural-alignment-benchmark', sub: 'comparing representations of world models (DIAMOND) to human brain activity (Meta TRIBE v2). Python torch nilearn neuroscience', url: 'https://github.com/shlokabhattacharyya/neural-alignment-benchmark' },
        { kind: 'project', title: 'dash', sub: 'AI-powered terminal productivity dashboard with tasks, calendar, and Pomodoro timer. Python Llama 3 tmux', url: 'https://github.com/shlokabhattacharyya/dash' },
        { kind: 'project', title: 'hft-inference-engine', sub: 'low-latency MLP inference engine in C for market microstructure prediction. C Python torch', url: 'https://github.com/shlokabhattacharyya/hft-inference-engine' },
        { kind: 'project', title: 'urban displacement predictive model', sub: 'machine learning predictive model for gentrification risk and housing displacement. Python scikit-learn geopandas Flask', url: '/projects/' },
        { kind: 'project', title: 'logical-fallacy-detector', sub: 'Chrome browser extension to detect logical fallacies in a piece of work. Javascript HTML CSS', url: 'https://github.com/shlokabhattacharyya/logical-fallacy-detector' },
        { kind: 'project', title: 'bad-chess', sub: 'a set of chess engines that are really good at playing chess really bad. Python', url: 'https://github.com/shlokabhattacharyya/bad-chess' },
        { kind: 'project', title: 'text-editor', sub: 'a text editor in C for C.', url: 'https://github.com/shlokabhattacharyya/text-editor' },
        { kind: 'project', title: 'mathipedia', sub: 'full-stack machine learning pipeline to cluster 5,000+ math concepts. Python sentence-transformers umap Wikipedia Flask', url: 'https://github.com/shlokabhattacharyya/mathipedia' },
        { kind: 'project', title: 'ascii-art-generator', sub: 'generate ASCII art of anything! powered by a HuggingFace AI model. Python Pillow', url: 'https://github.com/shlokabhattacharyya/ascii-art-generator' },
        // writing
        { kind: 'article', title: "now we're commodifying...friendship?", sub: 'The Wesleyan Argus, april 17, 2026', url: 'https://wesleyanargus.com/2026/04/17/now-were-commodifying-friendship/' },
        { kind: 'article', title: 'is AI going to trap you in a permanent underclass?', sub: 'The Wesleyan Argus, april 3, 2026', url: 'https://wesleyanargus.com/2026/04/03/is-ai-going-to-trap-you-in-a-permanent-underclass/' },
        { kind: 'article', title: 'the weaponization of humanitarian aid', sub: 'Arcadia Political Review, february 18, 2026', url: 'https://www.wesleyanarcadia.com/arcadiapolitical/2026/2/18/xf91ifynheszukw8sf5oh5k9xdguuc' },
        { kind: 'article', title: 'the financialization of everything', sub: 'Wesleyan Business Review, december 21, 2025', url: 'https://www.wesleyanbusinessreview.com/issue-xi-finance-economics/a-new-era-of-power-demand-67kns-rawec' },
        { kind: 'article', title: 'the future of the corporate world in the age of artificial intelligence', sub: 'Wesleyan Business Review, december 21, 2025', url: 'https://www.wesleyanbusinessreview.com/issue-xi-technology/a6oyjbvojbt7zab7dujv61vbhnlbwm-26tm5' },
        { kind: 'article', title: 'we won! now what?', sub: 'The Wesleyan Argus, november 21, 2025', url: 'https://wesleyanargus.com/2025/11/21/we-won-now-what/' },
        { kind: 'article', title: 'nobody wants to listen anymore!', sub: 'The Wesleyan Argus, november 14, 2025', url: 'https://wesleyanargus.com/2025/11/14/nobody-wants-to-listen-anymore/' },
        { kind: 'article', title: 'dear vivek ramaswamy, conservatives will never fully accept you', sub: 'The Wesleyan Argus, october 28, 2025', url: 'https://wesleyanargus.com/2025/10/28/dear-vivek-ramaswamy-conservatives-will-never-fully-accept-you/' },
        { kind: 'article', title: 'the rise of anti-intellectualism in american society', sub: 'The Wesleyan Argus, october 10, 2025', url: 'https://wesleyanargus.com/2025/10/10/the-rise-of-anti-intellectualism-in-american-society/' },
        { kind: 'article', title: 'the cancellation of jimmy kimmel', sub: 'The Wesleyan Argus, september 30, 2025', url: 'https://wesleyanargus.com/2025/09/30/in-attempting-to-silence-kimmel-trump-grinds-away-at-pillars-of-free-expression-political-speech/' },
    ];

    const input = document.getElementById('search');
    const button = document.getElementById('search-btn');
    const note = document.querySelector('.search-note');
    const results = document.querySelector('.search-results');
    if (!input || !note || !results) return;

    const escape = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

    // items already on this page get filtered in place; everything else shows in the results box
    const pageItems = Array.from(document.querySelectorAll('[data-search]'));

    function run() {
        const q = input.value.trim().toLowerCase();

        pageItems.forEach(el => {
            const hit = !q || el.getAttribute('data-search').toLowerCase().includes(q) || el.textContent.toLowerCase().includes(q);
            el.classList.toggle('miss', !hit);
            el.classList.toggle('hit', hit && q.length > 0);
        });

        if (!q) {
            note.classList.remove('show');
            results.classList.remove('show');
            results.innerHTML = '';
            return;
        }

        const onPage = new Set(pageItems.map(el => el.getAttribute('data-url')).filter(Boolean));
        const matches = SITE_INDEX.filter(item =>
            !onPage.has(item.url) &&
            (item.title + ' ' + item.sub).toLowerCase().includes(q)
        );
        const localHits = pageItems.filter(el => el.classList.contains('hit')).length;
        const total = localHits + matches.length;

        note.innerHTML = `showing ${total} result${total === 1 ? '' : 's'} for "${escape(q)}" &nbsp;<a href="#" class="search-clear">[ clear ]</a>`;
        note.classList.add('show');
        note.querySelector('.search-clear').addEventListener('click', e => {
            e.preventDefault();
            input.value = '';
            run();
        });

        if (matches.length) {
            results.innerHTML = matches.map(item => {
                const external = /^https?:/.test(item.url);
                return `<div class="result"><a href="${escape(item.url)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escape(item.title)}</a><span class="kind">${item.kind}</span><br><span style="color:#6b4a5e">${escape(item.sub)}</span></div>`;
            }).join('');
            results.classList.add('show');
        } else if (localHits === 0) {
            results.innerHTML = '<div class="empty">nothing found. try a different word, like "AI", "chess", or "argus".</div>';
            results.classList.add('show');
        } else {
            results.classList.remove('show');
            results.innerHTML = '';
        }
    }

    input.addEventListener('input', run);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
    if (button) button.addEventListener('click', run);

});
