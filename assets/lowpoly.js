/* low-poly nav models for the home page — three.js r128 (UMD) must be loaded first */
(function () {
  const M = (c, extra) => new THREE.MeshStandardMaterial(Object.assign({ color: c, flatShading: true, roughness: 0.85, metalness: 0 }, extra || {}));
  const mesh = (g, m, x, y, z) => { const o = new THREE.Mesh(g, m); o.position.set(x || 0, y || 0, z || 0); return o; };

  function statueHead(opt) {
    const g = new THREE.Group();
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(opt.bust.v, 3)); geo.setIndex(opt.bust.i);
    const flat = geo.toNonIndexed(); flat.computeVertexNormals();
    const bust = new THREE.Mesh(flat, M(0xece3d2)); bust.rotation.y = -Math.PI / 2; bust.scale.setScalar(2.4); g.add(bust);
    return g;
  }

  function guitar() {
    const g = new THREE.Group();
    const red = M(0x8f1f24), cream = M(0xf5e9c8), wood = M(0xc9955b), dark = M(0x2d2a2a), fret = M(0x4b3226), chrome = M(0xdedede, { metalness: 0.3, roughness: 0.5 });
    const pts = [[0, -0.95], [0.55, -0.82], [0.74, -0.45], [0.6, -0.05], [0.42, 0.25], [0.56, 0.62], [0.3, 0.74], [0.16, 0.45], [0, 0.35], [-0.15, 0.5], [-0.44, 0.78], [-0.64, 0.56], [-0.5, 0.2], [-0.7, -0.15], [-0.72, -0.5], [-0.5, -0.86]];
    const shape = new THREE.Shape(); shape.moveTo(pts[0][0], pts[0][1]); pts.slice(1).forEach(p => shape.lineTo(p[0], p[1])); shape.closePath();
    const body = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 1 }), red); body.position.z = -0.1; g.add(body);
    const guard = new THREE.Shape(); [[-0.42, -0.6], [0.35, -0.6], [0.4, 0.05], [0.25, 0.4], [-0.1, 0.3], [-0.5, 0.1]].forEach((p, i) => i ? guard.lineTo(p[0], p[1]) : guard.moveTo(p[0], p[1])); guard.closePath();
    g.add(mesh(new THREE.ExtrudeGeometry(guard, { depth: 0.02, bevelEnabled: false }), cream, 0, 0, 0.13));
    g.add(mesh(new THREE.BoxGeometry(0.19, 1.55, 0.09), wood, 0, 1.1, 0.07));
    g.add(mesh(new THREE.BoxGeometry(0.19, 1.3, 0.03), fret, 0, 0.95, 0.13));
    for (let i = 0; i < 9; i++) g.add(mesh(new THREE.BoxGeometry(0.19, 0.012, 0.012), chrome, 0, 0.42 + i * 0.14, 0.15));
    const hs = mesh(new THREE.BoxGeometry(0.34, 0.46, 0.07), wood, 0.06, 2.05, 0.07); hs.rotation.z = -0.12; g.add(hs);
    for (let i = 0; i < 6; i++) g.add(mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 6), chrome, 0.26, 1.88 + i * 0.07, 0.04));
    g.add(mesh(new THREE.BoxGeometry(0.44, 0.12, 0.07), dark, 0, 0.18, 0.16));
    g.add(mesh(new THREE.BoxGeometry(0.44, 0.12, 0.07), dark, 0, -0.2, 0.16));
    g.add(mesh(new THREE.BoxGeometry(0.48, 0.08, 0.09), chrome, 0, -0.5, 0.16));
    for (let i = 0; i < 6; i++) g.add(mesh(new THREE.BoxGeometry(0.012, 2.5, 0.012), chrome, -0.07 + i * 0.028, 0.75, 0.21));
    g.add(mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.06, 8), cream, 0.5, -0.5, 0.16));
    g.add(mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.06, 8), cream, 0.52, -0.72, 0.16));
    g.position.y = -0.45; g.scale.setScalar(0.76);
    const w = new THREE.Group(); w.add(g); w.rotation.z = -0.35; w.rotation.x = 0.15;
    return w;
  }

  function rocket() {   /* shuttle, purple + green */
    const g = new THREE.Group();
    const pale = M(0x9fd49a), green = M(0x4fa35c), dark = M(0x2d6b3a), tank = M(0x7a4fd1);
    // external tank
    g.add(mesh(new THREE.CylinderGeometry(0.3, 0.3, 2.3, 8), tank, 0, 0, -0.1));
    g.add(mesh(new THREE.ConeGeometry(0.3, 0.75, 8), tank, 0, 1.52, -0.1));
    // solid rocket boosters
    [-0.45, 0.45].forEach(x => {
      g.add(mesh(new THREE.CylinderGeometry(0.15, 0.15, 2.0, 8), pale, x, -0.05, -0.2));
      g.add(mesh(new THREE.ConeGeometry(0.15, 0.5, 8), green, x, 1.2, -0.2));
      [0.5, -0.35].forEach(y => g.add(mesh(new THREE.CylinderGeometry(0.165, 0.165, 0.06, 8), dark, x, y, -0.2)));
      g.add(mesh(new THREE.CylinderGeometry(0.12, 0.17, 0.2, 8), dark, x, -1.12, -0.2));
    });
    // orbiter
    g.add(mesh(new THREE.CylinderGeometry(0.26, 0.3, 1.5, 8), pale, 0, -0.1, 0.38));
    g.add(mesh(new THREE.ConeGeometry(0.26, 0.6, 8), green, 0, 0.95, 0.38));
    g.add(mesh(new THREE.BoxGeometry(0.46, 0.9, 0.3), pale, 0, -0.2, 0.52));
    const wing = new THREE.Shape(); wing.moveTo(0, 0.55); wing.lineTo(1.0, -0.5); wing.lineTo(1.0, -0.75); wing.lineTo(0, -0.75); wing.closePath();
    const wingGeo = new THREE.ExtrudeGeometry(wing, { depth: 0.07, bevelEnabled: false });
    const wl = new THREE.Mesh(wingGeo, green); wl.position.set(0, -0.15, 0.4); g.add(wl);
    const wr = new THREE.Mesh(wingGeo, green); wr.position.set(0, -0.15, 0.4); wr.scale.x = -1; g.add(wr);
    const fin = new THREE.Shape(); fin.moveTo(0, 0); fin.lineTo(0.75, 0.0); fin.lineTo(0.55, -0.55); fin.lineTo(0, -0.55); fin.closePath();
    const finM = new THREE.Mesh(new THREE.ExtrudeGeometry(fin, { depth: 0.06, bevelEnabled: false }), green);
    finM.rotation.y = Math.PI / 2; finM.position.set(0.03, -0.35, 0.68); g.add(finM);
    [[0, -1.0, 0.38], [-0.17, -0.92, 0.52], [0.17, -0.92, 0.52]].forEach(p => g.add(mesh(new THREE.CylinderGeometry(0.08, 0.13, 0.24, 8), dark, p[0], p[1], p[2])));
    g.scale.setScalar(0.8);
    const w = new THREE.Group(); w.add(g); w.rotation.z = -0.35; w.rotation.x = 0.25;
    return w;
  }

  function legos() {
    const g = new THREE.Group();
    const u = 0.38, h = 0.36, wall = 0.05, top = 0.08;
    function brick(nx, nz, color, x, y, z) {
      const b = new THREE.Group(); const mat = M(color); const W = nx * u, D = nz * u;
      // hollow shell: top plate + four walls, so the underside is open like a real brick
      b.add(mesh(new THREE.BoxGeometry(W, top, D), mat, 0, h / 2 - top / 2, 0));
      b.add(mesh(new THREE.BoxGeometry(W, h - top, wall), mat, 0, -top / 2, D / 2 - wall / 2));
      b.add(mesh(new THREE.BoxGeometry(W, h - top, wall), mat, 0, -top / 2, -D / 2 + wall / 2));
      b.add(mesh(new THREE.BoxGeometry(wall, h - top, D - 2 * wall), mat, W / 2 - wall / 2, -top / 2, 0));
      b.add(mesh(new THREE.BoxGeometry(wall, h - top, D - 2 * wall), mat, -W / 2 + wall / 2, -top / 2, 0));
      // studs on top
      for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++)
        b.add(mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.1, 10), mat, (i - (nx - 1) / 2) * u, h / 2 + 0.05, (j - (nz - 1) / 2) * u));
      // tubes underneath, between the studs
      const tubeMat = M(color, { side: THREE.DoubleSide });
      for (let i = 0; i < nx - 1; i++) for (let j = 0; j < nz - 1; j++)
        b.add(mesh(new THREE.CylinderGeometry(0.15, 0.15, h - top, 10, 1, true), tubeMat, (i - (nx - 2) / 2) * u, -top / 2, (j - (nz - 2) / 2) * u));
      b.position.set(x, y, z); return b;
    }
    g.add(brick(4, 2, 0x3a6fe0, -0.19, -0.18, -0.19));
    g.add(brick(2, 4, 0xf5c542, 0.19, h - 0.18, 0.19));
    g.position.y = 0; g.rotation.y = 0.6; g.rotation.x = 0.45;
    return g;
  }

  function clementine() {
    const g = new THREE.Group();
    const body = mesh(new THREE.IcosahedronGeometry(0.82, 2), M(0xf0821f), 0, 0, 0); body.scale.set(1, 0.86, 1); g.add(body);
    g.add(mesh(new THREE.CylinderGeometry(0.045, 0.07, 0.16, 5), M(0x6b4a2b), 0, 0.76, 0));
    const leaf = new THREE.Shape(); leaf.moveTo(0, 0); leaf.quadraticCurveTo(0.25, 0.18, 0.55, 0.02); leaf.quadraticCurveTo(0.25, -0.16, 0, 0);
    const leafGeo = new THREE.ExtrudeGeometry(leaf, { depth: 0.03, bevelEnabled: false, curveSegments: 3 });
    const l1 = mesh(leafGeo, M(0x5fa85a), 0.03, 0.78, 0); l1.rotation.x = -Math.PI / 2 + 0.3; l1.rotation.z = 0.2; g.add(l1);
    const l2 = mesh(leafGeo, M(0x4d9149), -0.03, 0.78, 0); l2.rotation.x = -Math.PI / 2 - 0.2; l2.rotation.z = Math.PI - 0.5; g.add(l2);
    g.rotation.x = 0.2;
    return g;
  }

  function bouquet() {   /* low-poly blossom tree (home) */
    const g = new THREE.Group();
    const bark = M(0x4a2e27), bark2 = M(0x5a3a30);
    const pinks = [0xf4a9c9, 0xe98ab5, 0xf8c1d8, 0xe27aaa, 0xf0a0c4];
    // trunk: tapered, flared at the root, few facets
    g.add(mesh(new THREE.CylinderGeometry(0.16, 0.24, 1.3, 6), bark, 0, -0.55, 0));
    g.add(mesh(new THREE.CylinderGeometry(0.24, 0.38, 0.28, 6), bark2, 0, -1.2, 0));
    // branches: each one runs from the top of the trunk to a point inside the canopy
    const top = new THREE.Vector3(0, 0.1, 0), up = new THREE.Vector3(0, 1, 0);
    [[0.55, 0.75, 0.1], [-0.6, 0.7, 0.0], [0.2, 0.7, -0.55], [-0.2, 0.75, 0.5], [0, 1.0, 0]].forEach(t => {
      const end = new THREE.Vector3(...t), dir = end.clone().sub(top), len = dir.length();
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.1, len, 5), bark);
      b.position.copy(top).add(dir.multiplyScalar(0.5)); b.quaternion.setFromUnitVectors(up, end.clone().sub(top).normalize()); g.add(b);
    });
    // canopy: chunky faceted blobs, each a little squashed and turned differently
    const blobs = [[0, 0.95, 0, 0.7], [0.68, 0.7, 0.15, 0.54], [-0.7, 0.65, 0.05, 0.56], [0.3, 0.55, -0.62, 0.5], [-0.3, 0.6, 0.6, 0.5], [0.7, 1.05, -0.3, 0.42], [-0.58, 1.1, -0.35, 0.44], [0.1, 1.4, 0.2, 0.46], [0.55, 0.4, 0.58, 0.4], [-0.68, 0.38, -0.48, 0.4]];
    blobs.forEach((p, i) => {
      const b = mesh(new THREE.IcosahedronGeometry(p[3], 0), M(pinks[i % pinks.length]), p[0], p[1], p[2]);
      b.scale.set(1, 0.9, 1); b.rotation.set(i * 0.7, i * 1.1, i * 0.4); g.add(b);
    });
    g.position.y = 0.05; g.scale.setScalar(0.8);
    const w = new THREE.Group(); w.add(g); w.rotation.x = 0.15; w.rotation.z = -0.05;
    return w;
  }

  function camera() {
    const g = new THREE.Group();
    const black = M(0x1b1b1f), black2 = M(0x2b2b31), grey = M(0x6a6a72), glass = M(0x1e3a5a, { roughness: 0.3 }), silver = M(0xcfcfd4, { metalness: 0.4, roughness: 0.4 });
    g.add(mesh(new THREE.BoxGeometry(2.0, 1.25, 0.48), black, 0, 0, 0));                       // body
    g.add(mesh(new THREE.BoxGeometry(0.55, 1.2, 0.16), black2, -0.72, -0.03, 0.3));           // grip
    g.add(mesh(new THREE.BoxGeometry(0.9, 0.22, 0.42), black2, 0.05, 0.72, -0.01));            // top hump
    g.add(mesh(new THREE.BoxGeometry(0.4, 0.14, 0.24), black, 0.05, 0.9, -0.01));              // hot shoe / viewfinder
    g.add(mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.06, 10), silver, -0.6, 0.66, 0));     // shutter button
    g.add(mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 12), black2, 0.7, 0.66, -0.05));     // mode dial
    const lens = mesh(new THREE.CylinderGeometry(0.46, 0.5, 0.4, 14), black2, 0.15, -0.05, 0.44); lens.rotation.x = Math.PI / 2; g.add(lens);
    const ring = mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.08, 14), grey, 0.15, -0.05, 0.68); ring.rotation.x = Math.PI / 2; g.add(ring);
    const glassM = mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.04, 14), glass, 0.15, -0.05, 0.72); glassM.rotation.x = Math.PI / 2; g.add(glassM);
    g.add(mesh(new THREE.BoxGeometry(0.3, 0.14, 0.04), silver, -0.45, 0.42, 0.25));            // flash
    g.add(mesh(new THREE.BoxGeometry(1.1, 0.75, 0.03), M(0x3a3f4a), 0.1, -0.1, -0.25));        // rear screen
    g.scale.setScalar(0.72);
    const w = new THREE.Group(); w.add(g); w.rotation.x = 0.3; w.rotation.y = -0.6; w.rotation.z = -0.1;
    return w;
  }

  const BUILDERS = { home: bouquet, blog: statueHead, articles: guitar, projects: rocket, favorites: legos, random: clementine, photos: camera };

  /* mount(options): { canvas, labelHost, items:[{key,href,ext,plain}], arrange(aspect,n)->[{x,y}] , onPick(item) } */
  window.mountLowPoly = function (opt) {
    const canvas = opt.canvas;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 50); camera.position.set(0, 0, 20);
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const sun = new THREE.DirectionalLight(0xffffff, 0.95); sun.position.set(3, 6, 5); scene.add(sun);
    const fill = new THREE.DirectionalLight(0xffffff, 0.3); fill.position.set(-4, -2, 3); scene.add(fill);

    const nodes = opt.items.map((item, i) => {
      const root = new THREE.Group(); const spin = new THREE.Group();
      const model = BUILDERS[item.key](opt); spin.add(model); root.add(spin);
      root.userData = { item, spin, phase: i * 1.3, autoY: i * 1.3, userX: 0, userY: 0, flame: model.userData.flame };
      if (model.userData.viewTilt) { root.rotation.x = model.userData.viewTilt.x; root.rotation.z = model.userData.viewTilt.z; }
      scene.add(root);
      root.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(root);
      root.userData.labelY = bb.min.y - 0.3; root.userData.top = bb.max.y; root.userData.bottom = bb.min.y - 0.75; // label sits in that 0.75
      const label = document.createElement('a'); label.className = 'lp-label'; label.href = '#' + (item.key === 'home' ? '' : item.key);
      label.textContent = item.label;
      label.addEventListener('click', e => { e.preventDefault(); opt.onPick(item); });
      opt.labelHost.appendChild(label);
      return { root, label, item };
    });

    let positions = [];
    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      const aspect = w / h;
      const lay = opt.arrange(aspect, nodes.length);          // {axis, span, points} or {axis:'y', stack:true, gap, xs}
      if (lay.stack) {
        // real heights decide the spacing, so the gap between every model and the next is the same;
        // a fixed span keeps the models at full size and lets the gap go slightly negative (neighbours sit on opposite sides, so they don't collide)
        const heights = nodes.reduce((s, n) => s + (n.root.userData.top - n.root.userData.bottom), 0);
        const gap = lay.span ? (lay.span - heights) / (nodes.length - 1) : lay.gap;
        const total = lay.span || heights + gap * (nodes.length - 1);
        lay.span = total; let cursor = total / 2;
        lay.points = nodes.map((n, i) => { const d = n.root.userData; const y = cursor - d.top; cursor = y + d.bottom - gap; return { x: lay.xs(i, total / 2 * aspect), y }; });
      }
      positions = lay.points;
      const half = lay.span / 2;
      if (lay.axis === 'y') { camera.top = half; camera.bottom = -half; camera.left = -half * aspect; camera.right = half * aspect; }
      else { camera.left = -half; camera.right = half; camera.top = half / aspect; camera.bottom = -half / aspect; }
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize); resize();

    const ray = new THREE.Raycaster(); const ptr = new THREE.Vector2(-9, -9); let hovered = null;
    let drag = null;   // { node, x, y, moved }
    function toNDC(e) { const r = canvas.getBoundingClientRect(); ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); }
    function pick() {
      ray.setFromCamera(ptr, camera);
      const hit = ray.intersectObjects(nodes.map(n => n.root), true)[0];
      let r = hit ? hit.object : null; while (r && !r.userData.item) r = r.parent;
      hovered = r; canvas.style.cursor = drag ? 'grabbing' : r ? 'grab' : 'default';
      nodes.forEach(n => n.label.classList.toggle('is-hover', n.root === (drag ? drag.node.root : r)));
    }
    canvas.addEventListener('pointermove', e => {
      toNDC(e);
      if (drag) {
        const d = drag.node.root.userData;
        d.userY += (e.clientX - drag.x) * 0.012; d.userX = Math.max(-1.2, Math.min(1.2, d.userX + (e.clientY - drag.y) * 0.012));
        if (Math.abs(e.clientX - drag.x0) + Math.abs(e.clientY - drag.y0) > 5) drag.moved = true;
        drag.x = e.clientX; drag.y = e.clientY;
      }
    });
    canvas.addEventListener('pointerleave', () => { if (!drag) ptr.set(-9, -9); });
    canvas.addEventListener('pointerdown', e => {
      toNDC(e); pick(); if (!hovered) return;
      drag = { node: nodes.find(n => n.root === hovered), x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, moved: false };
      canvas.setPointerCapture(e.pointerId); e.preventDefault();
    });
    canvas.addEventListener('pointerup', e => {
      if (!drag) return; const d = drag; drag = null; canvas.releasePointerCapture(e.pointerId);
      if (!d.moved) opt.onPick(d.node.item);
    });
    canvas.addEventListener('pointercancel', () => { drag = null; });

    const v = new THREE.Vector3(); const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    function frame(t) {
      t *= 0.001; pick();
      nodes.forEach((n, i) => {
        const d = n.root.userData, p = positions[i];
        const bob = reduce ? 0 : Math.sin(t * 1.1 + d.phase) * 0.12;
        n.root.position.set(p.x, p.y + bob, 0);
        if (!reduce && !(drag && drag.node === n)) d.autoY += 0.0075;
        d.spin.rotation.y = d.autoY + d.userY; d.spin.rotation.x = d.userX;
        const target = (hovered === n.root || (drag && drag.node === n)) ? 1.12 : 1;
        n.root.scale.setScalar(n.root.scale.x + (target - n.root.scale.x) * 0.15);
        if (d.flame && !reduce) d.flame.scale.set(1, 0.85 + Math.sin(t * 18 + i) * 0.15, 1);
        v.set(p.x, p.y + d.labelY, 0).project(camera);
        n.label.style.left = ((v.x + 1) / 2 * canvas.clientWidth) + 'px';
        n.label.style.top = ((1 - v.y) / 2 * canvas.clientHeight) + 'px';
      });
      renderer.render(scene, camera);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return { setCurrent(key) { nodes.forEach(n => n.label.classList.toggle('is-current', n.item.key === key)); } };
  };
})();