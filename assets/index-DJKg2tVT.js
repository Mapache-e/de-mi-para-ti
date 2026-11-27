(function() {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const r of document.querySelectorAll('link[rel="modulepreload"]')) o(r);
  new MutationObserver(r => {
    for (const i of r) {
      if (i.type === "childList") {
        for (const a of i.addedNodes) {
          a.tagName === "LINK" && a.rel === "modulepreload" && o(a);
        }
      }
    }
  }).observe(document, { childList: !0, subtree: !0 });

  function n(r) {
    const i = {};
    return r.integrity && (i.integrity = r.integrity),
      r.referrerPolicy && (i.referrerPolicy = r.referrerPolicy),
      r.crossOrigin === "use-credentials" ? i.credentials = "include" :
      r.crossOrigin === "anonymous" ? i.credentials = "omit" :
      i.credentials = "same-origin", i;
  }

  function o(r) {
    if (r.ep) return;
    r.ep = !0;
    const i = n(r);
    fetch(r.href, i);
  }
})();

const Zt = "modulepreload",
  Qt = function(e, t) {
    return new URL(e, t).href;
  },
  qt = {},
  Yt = function(t, n, o) {
    let r = Promise.resolve();
    if (n && n.length > 0) {
      let b = function(m) {
        return Promise.all(m.map(v => Promise.resolve(v).then(
          w => ({ status: "fulfilled", value: w }),
          w => ({ status: "rejected", reason: w })
        )));
      };
      const a = document.getElementsByTagName("link"),
        l = document.querySelector("meta[property=csp-nonce]"),
        M = l?.nonce || l?.getAttribute("nonce");
      r = b(n.map(m => {
        if (m = Qt(m, o), m in qt) return;
        qt[m] = !0;
        const v = m.endsWith(".css"),
          w = v ? '[rel="stylesheet"]' : "";
        if (o) {
          for (let A = a.length - 1; A >= 0; A--) {
            const g = a[A];
            if (g.href === m && (!v || g.rel === "stylesheet")) return;
          }
        } else if (document.querySelector(`link[href="${m}"]${w}`)) return;
        const S = document.createElement("link");
        if (S.rel = v ? "stylesheet" : Zt, v || (S.as = "script"), S.crossOrigin = "", S.href = m, M && S.setAttribute("nonce", M), document.head.appendChild(S), v) {
          return new Promise((A, g) => {
            S.addEventListener("load", A);
            S.addEventListener("error", () => g(new Error(`Unable to preload CSS for ${m}`)));
          });
        }
      }));
    }

    function i(a) {
      const l = new Event("vite:preloadError", { cancelable: !0 });
      if (l.payload = a, window.dispatchEvent(l), !l.defaultPrevented) throw a;
    }
    return r.then(a => {
      for (const l of a || []) l.status === "rejected" && i(l.reason);
      return t().catch(i);
    });
  },
  at = { connect: 11, rise: 37, chorus: 63 },
  R = {
    electric: [5676287, 8750591, 11236351, 7653887],
    copper: 11761737,
    rings: 9,
    towers: [
      { height: 3.07, size: .95, portrait: [-1.02, 1.85], wide: [-3.62, 1.35] },
      { height: 4.76, size: 1.03, portrait: [-.7, -1.85], wide: [-1.48, -1.3] },
      { height: 3.84, size: .92, portrait: [1, -1.4], wide: [3.38, -1.75] },
      { height: 2.55, size: .93, portrait: [.86, 2.68], wide: [1.57, 2.05] }
    ],
    route: [[0, 1], [1, 2], [2, 3], [3, 0], [2, 0], [1, 3]],
    afterglow: 1.25,
    maxBranches: 6,
    maxRatio: 1.8
  },
  N = (e, t = 0, n = 1) => Math.min(n, Math.max(t, e)),
  Z = (e, t, n) => e + (t - e) * n;

function _(e, t, n) {
  const o = N((n - e) / (t - e));
  return o * o * (3 - 2 * o);
}

function Pt(e) {
  let t = e >>> 0;
  return () => (t = Math.imul(1664525, t) + 1013904223 >>> 0, t / 4294967296);
}

function te(e) {
  const t = _(.53, 1.58, e),
    n = Z(.76, 1, _(.3, .46, e));
  return R.towers.map(({ height: o, size: r, portrait: i, wide: a }) => ({
    x: Z(i[0] * n, a[0], t),
    z: Z(i[1], a[1], t),
    h: o,
    r
  }));
}

function Wt(e) {
  return e >= at.chorus ? 3 : e >= at.rise ? 2 : e >= at.connect ? 1 : 0;
}

function yt(e, t, n) {
  let o = 0, r = e.length;
  for (; o < r;) {
    const i = o + r >>> 1;
    n(e[i]) <= t ? o = i + 1 : r = i;
  }
  return o;
}

const Ft = e => e.t,
  ee = e => e[0],
  ne = [[0, 2, 1, 3], [0, 1, 2, 3], [2, 0, 4, 1, 5, 3], [1, 2, 0, 3, 5, 4]];

function oe(e) {
  const t = [],
    n = new Set(e.beats.map(a => Math.round(a[0] * 1e3)));
  let o = -10, r = -1, i = 0;
  for (let a = 0; a < e.events.length; a++) {
    const l = e.events[a],
      M = Wt(l.t),
      b = n.has(Math.round(l.t * 1e3));
    r !== M && (r = M, i = 0, o = -10);
    const m = l.t - o,
      v = [1.12, .36, .255, .205][r],
      w = .52 * l.power + .36 * l.electric + .12 * Number(b),
      S = [.37, .31, .37, .29][r];
    if (m < v || w < S && m < v * 2.5) continue;
    const A = ne[r],
      g = A[i % A.length],
      [z, d] = r ? R.route[g] : [g, -1];
    if (t.push({
      t: l.t,
      from: z,
      to: d,
      stage: r,
      strength: w,
      bright: l.bright,
      seed: 9321 + a * 971,
      life: [.22, .49, .51, .58][r] + w * [.06, .21, .23, .26][r]
    }), r === 3 && (i % 3 === 0 || l.power > .88)) {
      const [h, s] = R.route[(g + 2) % 4];
      if (t.push({
        t: l.t + .055,
        from: h,
        to: s,
        stage: r,
        strength: w * .74,
        bright: l.bright,
        seed: 1537 + a * 571,
        life: .61
      }), i % 3 === 0) {
        const [p, x] = R.route[(g + 1) % 4];
        t.push({
          t: l.t + .119,
          from: p,
          to: x,
          stage: r,
          strength: w * .66,
          bright: l.bright,
          seed: 7103 + a * 443,
          life: .53
        });
      }
    }
    i++, o = l.t;
  }
  return t.sort((a, l) => a.t - l.t);
}

class re {
  constructor(t) {
    this.score = t,
      this.cues = oe(t),
      this.features = new Float32Array(10),
      this.rings = new Float32Array(4 * R.rings),
      this.towerPower = new Float32Array(4),
      this.liveMix = new Float32Array(6);
    const n = t.tail.lastOnset ?? t.duration;
    this.decayStart = Math.max(t.duration - 1.15, Math.min(t.duration - .47, n - .38));
  }

  at(t, n, o = !1) {
    const r = this.score,
      i = Wt(t),
      a = N(t / r.frameStep, 0, r.frames.length - 1),
      l = Math.floor(a),
      M = Math.min(l + 1, r.frames.length - 1);
    for (let u = 0; u < 10; u++) this.features[u] = Z(r.frames[l][u], r.frames[M][u], a - l) / r.scale;
    for (let u = 0; u < 6; u++) this.liveMix[u] = n?.valid ? Z(this.features[4 + u], n.bands[u], .34) : this.features[4 + u];
    const [b, m, v, w, S, A] = this.liveMix,
      g = (1 - .57 * _(this.decayStart, r.duration, t)) * (1 - _(r.duration, r.duration + R.afterglow, t)),
      z = _(.06, 3.45, t),
      d = [.27, .46, .64, .85][i],
      h = N((d + .13 * this.features[0] + .065 * b) * g),
      s = yt(r.beats, t, ee) - 1,
      p = r.beats[s],
      x = p ? Math.exp(-Math.max(0, t - p[0]) / .19) * (.35 + .65 * p[1]) : 0;
    this.towerPower.fill(0);
    const f = yt(this.cues, t - 1, Ft),
      k = [],
      c = o ? 2 : [1, 2, 3, 4][i];
    for (let u = yt(this.cues, t, Ft) - 1; u >= f && k.length < c; u--) {
      const y = this.cues[u],
        P = t - y.t;
      if (P >= y.life) continue;
      const L = P / y.life,
        I = (1 - _(.32, 1, L)) * (.3 + .7 * _(0, .048, P)) * (.53 + .47 * y.strength) * (.82 + .18 * w) * g * (o ? .62 : 1);
      if (I < .018) continue;
      const O = o ? 1 : Math.min(R.maxBranches, Math.round(1 + y.stage * .7 + 1.3 * S + y.bright));
      k.push({ e: y, age: P, amp: I, branches: O }),
        this.towerPower[y.from] = Math.max(this.towerPower[y.from], I),
        y.to >= 0 && (this.towerPower[y.to] = Math.max(this.towerPower[y.to], I * .91));
    }
    for (let u = 0; u < 4; u++) {
      for (let y = 0; y < R.rings; y++) {
        const P = y / (R.rings - 1),
          L = at.connect + u * .36 + P * .46,
          I = _(L, L + .69, t),
          O = .5 + .5 * Math.cos((t - at.connect) * (1.4 + u * .06) + (u % 2 ? 1 : -1) * P * 3.6 + u * .85),
          B = i === 3 ? .72 : i === 2 ? .31 : .11,
          F = (.12 * x * m + .14 * O * v + .27 * this.towerPower[u]) * (o ? .53 : 1);
        this.rings[u * R.rings + y] = N((B + F + .08 * v) * I * g);
      }
    }
    return {
      t,
      stage: i,
      reveal: z,
      strength: h,
      tail: g,
      beat: x,
      bass: m,
      mid: w,
      high: A,
      highmid: S,
      sub: b,
      reduced: o,
      active: k,
      room: (.39 + .34 * h + .05 * b) * g * z,
      sparkle: (.25 + .51 * A + .2 * (n?.transient || 0)) * g,
      rings: this.rings,
      towerPower: this.towerPower
    };
  }
}

class se {
  constructor(t, n) {
    this.media = t,
      this.ranges = n,
      this.values = new Float32Array(6),
      this.mean = new Float32Array(6).fill(.32),
      this.spread = new Float32Array(6).fill(.21),
      this.state = { bands: this.values, transient: 0, valid: !1 };
  }

  unlock() {
    const t = window.AudioContext || window.webkitAudioContext;
    if (!t) return Promise.resolve();
    try {
      if (!this.context) {
        const n = new t;
        this.context = n;
        const o = n.createAnalyser();
        o.fftSize = 2048, o.smoothingTimeConstant = .42, o.minDecibels = -92, o.maxDecibels = -14;
        const r = n.createMediaElementSource(this.media);
        r.connect(n.destination), r.connect(o), this.source = r, this.analyser = o, this.fft = new Uint8Array(o.frequencyBinCount);
        const i = n.sampleRate / o.fftSize;
        this.bins = this.ranges.map(([a, l]) => [
          Math.max(1, Math.ceil(a / i)),
          Math.min(this.fft.length, Math.max(Math.ceil(a / i) + 1, Math.ceil(l / i)))
        ]);
      }
      if (this.context.state !== "running") return this.context.resume();
    } catch {}
    return Promise.resolve();
  }

  reset() {
    this.values.fill(0), this.mean.fill(.32), this.spread.fill(.21), this.state.valid = !1, this.state.transient = 0;
  }

  sample(t) {
    if (!this.analyser || this.context.state !== "running") return this.state.valid = !1, this.state;
    this.analyser.getByteFrequencyData(this.fft), t = N(t, 0, .1);
    const n = 1 - Math.exp(-t / 1.8);
    let o = 0, r = 0;
    for (let i = 0; i < this.bins.length; i++) {
      const [a, l] = this.bins[i];
      let M = 0;
      for (let S = a; S < l; S++) M += (this.fft[S] / 255) ** 2;
      const b = Math.sqrt(M / Math.max(1, l - a));
      r += b;
      const m = b - this.mean[i];
      this.mean[i] += n * m, this.spread[i] += n * (Math.abs(m) - this.spread[i]);
      const v = N(.54 * b + .46 * N(.42 + m / Math.max(.23, this.spread[i] * 3.3))),
        w = 1 - Math.exp(-t / (v > this.values[i] ? .046 : .19));
      i > 2 && (o = Math.max(o, N((v - this.values[i] - .055) * 4.1))), this.values[i] += (v - this.values[i]) * w;
    }
    return this.state.transient = o, this.state.valid = r > .012, this.state;
  }

  dispose() {
    this.source?.disconnect(), this.analyser?.disconnect(), this.context?.close().catch(() => {});
  }
}

function xt(e, t, n, o, r) {
  let i = [e, t], a = o;
  for (let l = 0; l < n; l++) {
    const M = [i[0]];
    for (let b = 1; b < i.length; b++) {
      const m = i[b - 1], v = i[b], w = .4 + .2 * r();
      M.push([
        m[0] + (v[0] - m[0]) * w,
        m[1] + (v[1] - m[1]) * w + (r() + r() - 1) * a,
        m[2] + (v[2] - m[2]) * w + (r() + r() - 1) * a * .97
      ], v);
    }
    i = M, a *= .55;
  }
  return i;
}

const ot = new Map;

function ie(e) {
  if (ot.has(e.seed)) return ot.get(e.seed);
  const t = Pt(e.seed),
    n = xt([0, 0, 0], [1, 0, 0], 5, .19, t),
    o = .085 + .105 * t();
  n.forEach(a => a[2] += Math.sin(a[0] * Math.PI) * o);
  const r = [{ points: n, width: 1, branch: 0 }];
  for (let a = 0; a < 6; a++) {
    const l = n[4 + Math.floor(t() * 23)],
      M = a % 2 ? 1 : -1,
      b = .1 + .13 * t(),
      m = [l[0] + b * (t() > .16 ? 1 : -.55), l[1] + M * (.077 + .105 * t()), l[2] + (t() - .54) * .28],
      v = xt(l, m, 3, b * .39, t);
    if (r.push({ points: v, width: .33 + .17 * t(), branch: a + 1 }), a === 0 || a === 2) {
      const w = v[3];
      r.push({ points: xt(w, [w[0] + b * .42, w[1] - M * .067, w[2] + .068], 2, .035, t), width: .21, branch: a + 1 });
    }
  }
  const i = { paths: r, drift: t() * 6.28, dir: t() > .5 ? 1 : -1 };
  return ot.size > 22 && ot.delete(ot.keys().next().value), ot.set(e.seed, i), i;
}

function _t(e, t, n) {
  for (const o of e.active) {
    const { e: r, age: i, amp: a } = o,
      l = t[r.from],
      M = ie(r);
    let b;
    r.to < 0 ? b = {
      x: l.x + (l.x < 0 ? 1 : -1) * (.38 + .3 * r.strength),
      h: l.h + .23 + .29 * r.bright,
      z: l.z + M.dir * .39
    } : b = t[r.to];
    const m = b.x - l.x,
      v = b.h - l.h,
      w = b.z - l.z,
      S = Math.hypot(m, w) || .001,
      A = Math.hypot(S, v),
      g = -w / S,
      z = m / S,
      d = N(.23 + i / (e.reduced ? .1 : .063)),
      h = M.drift;
    for (const s of M.paths) {
      if (s.branch > o.branches) continue;
      const p = [];
      for (const x of s.points) {
        if (x[0] > d && p.length > 1) break;
        const f = x[0],
          k = Math.sin(Math.PI * N(f)),
          c = e.reduced ? 0 : k * .009 * Math.sin(h + i * 21 + f * 17),
          u = (x[1] + c) * A;
        p.push([l.x + m * f + u * g, l.h + v * f + A * (x[2] + c * .55), l.z + w * f + u * z]);
      }
      p.length > 1 && n(p, s.width, a * (s.branch ? .75 : 1), r, !!s.branch);
    }
    if (!e.reduced && e.sparkle > .43 && i < .27 && r.stage > 0) {
      const s = 1 + Math.floor(e.sparkle * 3);
      for (let p = 0; p < s; p++) {
        const x = h + p * 2.38,
          f = (.04 + i * .51) * (1 + p * .21),
          k = l.x + Math.cos(x) * f,
          c = l.z + Math.sin(x) * f,
          u = l.h + f * (1.07 - p * .25) - i * i * .64;
        n([[k, u, c], [k + Math.cos(x) * .029, u + .023, c + Math.sin(x) * .029]], .23, a * .68, r, !0);
      }
    }
  }
}

function jt(e) {
  const t = e.getContext("2d", { alpha: !1 });
  let n = 1, o = 1, r = 1, i = [], a, l = 1, M = 1;
  const b = Pt(707),
    m = Array.from({ length: 65 }, () => [b(), b(), b()]);

  function v(g, z) {
    n = g, o = z, M = n / o,
      r = Math.min(window.devicePixelRatio || 1, 1.45, Math.sqrt(12e5 / (n * o))),
      e.width = Math.max(1, Math.round(n * r)),
      e.height = Math.max(1, Math.round(o * r)),
      i = te(M),
      l = Math.min(o * .159, n * .212),
      a = document.createElement("canvas"),
      a.width = e.width,
      a.height = e.height;
    const d = a.getContext("2d");
    d.scale(r, r);
    const h = d.createLinearGradient(0, 0, 0, o);
    h.addColorStop(0, "#080e1b"), h.addColorStop(.47, "#1a2436"), h.addColorStop(1, "#141823"),
      d.fillStyle = h, d.fillRect(0, 0, n, o);
    const s = Math.min(o * .138, n * .27), p = o * .27;
    for (let f = -5; f <= 5; f++) {
      const k = n * .5 + f * s * 1.3, c = s * .48, u = o * .195,
        y = d.createLinearGradient(k - c, 0, k + c, 0);
      y.addColorStop(0, "#263347"), y.addColorStop(.55, "#435169"), y.addColorStop(1, "#29364d"),
        d.fillStyle = y, d.beginPath(), d.arc(k, p, c, Math.PI, 0),
        d.lineTo(k + c, p + u), d.lineTo(k - c, p + u), d.closePath(), d.fill(),
        d.strokeStyle = "#111824", d.lineWidth = 4, d.stroke();
      for (let P = -2; P <= 2; P++) {
        const L = P * c / 3;
        d.fillStyle = "#202938", d.fillRect(k + L - 1, p - Math.sqrt(c * c - L * L), 2, u + Math.sqrt(c * c - L * L));
      }
      for (let P = 0; P < 5; P++) d.fillStyle = "#202938", d.fillRect(k - c, p + P * u / 5, 2 * c, 2);
    }
    for (let f = 0; f < 3; f++) d.fillStyle = f === 0 ? "#1b2230" : "#2a3547", d.fillRect(0, o * (.5 + f * .015), n, f === 0 ? 6 : 1);
    const x = d.createLinearGradient(0, o * .57, 0, o);
    x.addColorStop(0, "#252b37"), x.addColorStop(.48, "#171e29"), x.addColorStop(1, "#0a101b"),
      d.fillStyle = x, d.fillRect(0, o * .57, n, o * .43),
      d.strokeStyle = "rgba(152,157,179,.11)", d.lineWidth = 1;
    for (let f = -9; f <= 9; f++) d.beginPath(), d.moveTo(n * .5 + f * n * .025, o * .57), d.lineTo(n * .5 + f * n * .255, o), d.stroke();
    for (let f = 0; f < 8; f++) {
      const k = o * (.575 + .006 * f * f);
      d.beginPath(), d.moveTo(0, k), d.lineTo(n, k), d.stroke();
    }
  }

  function w(g, z, d, h, s) {
    const p = 7.9 / (8.1 - d * .56) * (1 + .025 * _(0, 12, h) * s);
    return [n * .5 + (g + .035 * Math.sin(h * .07) * s) * l * p, o * .54 - (z - 2.2) * l * p + d * l * .14];
  }

  function S(g, z, d, h, s) {
    d <= 0 || h <= 0 || (t.fillStyle = s, t.beginPath(), t.ellipse(g, z, d, h, 0, 0, Math.PI * 2), t.fill());
  }

  function A(g, z, d, h) {
    const [s, p] = w(g.x, 0, g.z, d.t, h),
      [x, f] = w(g.x, g.h, g.z, d.t, h),
      k = p - f,
      c = k / g.h * .54 * g.r,
      u = t.createLinearGradient(s - c, 0, s + c, 0);
    for (const [L, I] of [[0, "#26323e"], [.13, "#6f7c8c"], [.32, "#c1bec1"], [.44, "#565666"], [.75, "#77849a"], [.92, "#373e51"], [1, "#252a34"]]) u.addColorStop(L, I);
    const y = p - k * .1, P = f + k * .11;
    S(s, p + 2, c * 1.48, c * .31, "#0c1019"),
      S(s, p - 2, c * 1.12, c * .32, "#3b414d"),
      t.fillStyle = u, t.fillRect(s - c * .83, p - c * .4, c * 1.66, c * .26),
      S(s, p - c * .4, c * .83, c * .22, u),
      t.fillStyle = u, t.fillRect(s - c * .38, P, c * .76, y - P);
    for (let L = 0; L < 21; L++) S(s, Z(y, P, L / 20), c * .49, c * .115, L % 2 ? "#596170" : "#9a8f83");
    for (let L = 0; L < R.rings; L++) {
      const I = Z(y - 2, P + 2, L / (R.rings - 1)),
        O = d.rings[z * R.rings + L],
        B = t.createLinearGradient(s - c, 0, s + c, 0);
      B.addColorStop(0, "#684638"),
        B.addColorStop(.34, "rgb(" + Math.round(167 + O * 82) + "," + Math.round(111 + O * 55) + "," + Math.round(72 + O * 29) + ")"),
        B.addColorStop(.75, "#bc885c"),
        B.addColorStop(1, "#684535"),
        t.strokeStyle = B,
        t.lineWidth = Math.max(1.4, c * .08),
        t.shadowColor = "rgba(244,148,59," + O + ")",
        t.shadowBlur = O * 7,
        t.beginPath(),
        t.ellipse(s, I, c * .66, c * .17, 0, 0, Math.PI * 2),
        t.stroke(),
        t.shadowBlur = 0;
    }
    S(x, f + c * .45, c * .59, c * .18, "#30343e"),
      S(s, f + c * .29, c, c * .3, u),
      S(s, f + c * .2, c * .95, c * .23, u),
      S(s, f + c * .14, c * .46, c * .105, "#343c4b"),
      S(s, f + c * .105, c * .15, c * .083, "#b3b0b0"),
      t.fillStyle = "#bac0c9",
      t.fillRect(s - c * .036, f, c * .072, c * .16);
  }

  return {
    kind: "canvas",
    resize: v,
    draw(g) {
      t.setTransform(r, 0, 0, r, 0, 0), t.drawImage(a, 0, 0, n, o);
      const z = g.reduced ? 0 : 1;
      for (const [d, h, s] of m) t.fillStyle = "rgba(164,183,216," + s * .4 * g.sparkle + ")", t.fillRect(d * n, (h * o + g.t * s * .62 * z) % o, 1.3, 1.3);
      [1, 2, 0, 3].forEach(d => A(i[d], d, g, z)),
        t.lineJoin = "round", t.lineCap = "round",
        _t(g, i, (d, h, s, p, x) => {
          t.beginPath(), d.forEach((k, c) => {
            const [u, y] = w(...k, g.t, z);
            c ? t.lineTo(u, y) : t.moveTo(u, y);
          });
          const f = p.from % 2 ? "137,99,255" : "94,158,255";
          for (const [k, c] of [[8, "rgba(" + f + "," + .12 * s + ")"], [3.1, "rgba(" + f + "," + .69 * s + ")"], [1.1, "rgba(222,237,255," + s + ")"]]) {
            t.strokeStyle = c, t.lineWidth = Math.max(.42, k * h * (x ? .74 : 1)), t.stroke();
          }
        });
    },
    dispose() { a = null; }
  };
}

const Mt = e => new URL("plates/" + e, document.baseURI).href,
  It = e => new Promise((t, n) => {
    const o = new Image;
    o.onload = () => t(o), o.onerror = n, o.src = e;
  });

function ae() {
  const e = document.createElement("canvas");
  e.width = e.height = 96;
  const t = e.getContext("2d"),
    n = t.createRadialGradient(48, 48, 0, 48, 48, 48);
  for (const [o, r] of [[0, "#d1ddff"], [.12, "#847fff"], [.44, "#423eb1"], [1, "rgba(19,41,135,0)"]]) n.addColorStop(o, r);
  return t.fillStyle = n, t.fillRect(0, 0, 96, 96), e;
}

function vt(e, t, n, o) {
  const [r, i, a] = e,
    l = 1 / (t[3] * r + t[7] * i + t[11] * a + t[15]);
  return [
    (.5 + .5 * (t[0] * r + t[4] * i + t[8] * a + t[12]) * l) * n,
    (.5 - .5 * (t[1] * r + t[5] * i + t[9] * a + t[13]) * l) * o
  ];
}

function Ot(e) {
  const t = e.getContext("2d", { alpha: !1 });
  let n = e.clientWidth || innerWidth,
    o = e.clientHeight || innerHeight,
    r = 1, i, a, l = "", M, b = !1, m;
  const v = ae(),
    w = Pt(1092),
    S = Array.from({ length: 83 }, () => [w(), w(), w()]);

  async function A() {
    if (!i || b) return;
    const h = n / o,
      s = i.views.reduce((p, x) => Math.abs(Math.log(p.w / p.h / h)) < Math.abs(Math.log(x.w / x.h / h)) ? p : x);
    if (l !== s.id) {
      l = s.id;
      try {
        const [p, x] = await Promise.all([It(Mt(s.id + "-cold.webp")), It(Mt(s.id + "-hot.webp"))]);
        !b && l === s.id && (a = { ...s, cold: p, hot: x }, m && z(m));
      } catch {
        !a && !M && !b && (M = jt(e), M.resize(n, o), m && M.draw(m));
      }
    }
  }

  function g(h, s) {
    n = h, o = s,
      r = Math.min(window.devicePixelRatio || 1, 1.55, Math.sqrt(125e4 / (n * o))),
      e.width = Math.max(1, Math.round(n * r)),
      e.height = Math.max(1, Math.round(o * r)),
      M?.resize(n, o), i && A();
  }

  function z(h) {
    if (m = h, !a) {
      M && M.draw(h);
      return;
    }
    const s = a, p = s.matrix;
    t.setTransform(r, 0, 0, r, 0, 0), t.globalAlpha = 1, t.globalCompositeOperation = "source-over";
    const x = Math.max(n / s.w, o / s.h),
      f = Math.min(...s.margins.map(C => C[0])),
      k = Math.max(...s.margins.map(C => C[0] + C[2])),
      c = Math.min(...s.margins.map(C => C[1])),
      u = Math.max(...s.margins.map(C => C[1] + C[3])),
      y = .027,
      P = Math.min(n * (1 - 2 * y) / (k - f), o * (1 - 2 * y) / (u - c)),
      L = _(0, 15, h.t),
      I = _(37, 60, h.t),
      O = _(62, 64, h.t),
      B = h.reduced ? 0 : 1,
      F = Math.min(P, x * (1 + B * (.009 + .023 * L - .015 * I + .013 * O))),
      Kt = (n - s.w * F) / 2 + Math.sin(h.t * .072) * n * .009 * B,
      Jt = (o - s.h * F) / 2 + Math.sin(h.t * .051) * o * .004 * B,
      Vt = Math.min(n * (1 - y) - k * F, Math.max(n * y - f * F, Kt)),
      Xt = Math.min(o * (1 - y) - u * F, Math.max(o * y - c * F, Jt));
    t.drawImage(s.cold, (n - s.w * x) / 2, (o - s.h * x) / 2, s.w * x, s.h * x),
      t.translate(Vt, Xt), t.scale(F, F),
      t.drawImage(s.cold, 0, 0),
      t.fillStyle = "rgba(2,4,10," + Math.max(0, .25 - .23 * h.strength) + ")",
      t.fillRect(0, 0, s.w, s.h);
    for (const C of [1, 2, 0, 3]) {
      for (let q = 0; q < R.rings; q++) {
        const D = h.rings[C * R.rings + q];
        if (D < .012) continue;
        const [G, nt, $, H] = s.rings[C][q];
        t.globalAlpha = D ** 1.26, t.drawImage(s.hot, G, nt, $, H, G, nt, $, H);
      }
    }
    t.globalAlpha = 1, t.globalCompositeOperation = "screen";
    for (let C = 0; C < 4; C++) {
      const q = s.towers[C], D = h.towerPower[C];
      if (D < .01) continue;
      const [G, nt] = vt([q.x, q.h, q.z], p, s.w, s.h),
        [$, H] = vt([q.x, .03, q.z + .27], p, s.w, s.h),
        W = Math.min(s.w, s.h) * (.036 + .04 * D);
      t.globalAlpha = D * .83, t.drawImage(v, G - W / 2, nt - W / 2, W, W),
        t.globalAlpha = D * .19, t.drawImage(v, $ - W, H - W * .14, W * 2, W * .35);
    }
    t.globalAlpha = 1, t.lineCap = "round", t.lineJoin = "round",
      _t(h, s.towers, (C, q, D, G, nt) => {
        t.beginPath(), C.forEach((H, W) => {
          const [mt, Tt] = vt(H, p, s.w, s.h);
          W ? t.lineTo(mt, Tt) : t.moveTo(mt, Tt);
        });
        const $ = G.from % 2 ? "139,95,255" : "85,155,255";
        for (const [H, W, mt] of [[10, .1, $], [5, .23, $], [2.6, .93, $], [1.14, .98, "221,232,255"]]) {
          t.strokeStyle = "rgba(" + mt + "," + D * W + ")",
            t.lineWidth = Math.max(.42, H * q * (nt ? .89 : 1)) / F,
            t.stroke();
        }
      });
    for (let C = 0; C < (h.reduced ? 26 : 83); C++) {
      const [q, D, G] = S[C];
      t.fillStyle = "rgba(191,201,237," + G * .55 * h.sparkle + ")",
        t.fillRect(q * s.w, (D * s.h + B * h.t * (.37 + G)) % s.h, (.4 + G) / F, (.4 + G) / F);
    }
    t.globalAlpha = 1, t.globalCompositeOperation = "source-over";
  }

  return g(n, o), {
    kind: "canvas",
    ready: fetch(Mt("projection.json")).then(h => {
      if (!h.ok) throw Error("plates");
      return h.json();
    }).then(h => (i = h, A())).catch(() => {
      b || (M = jt(e), M.resize(n, o));
    }),
    resize: g,
    draw: z,
    dispose() { b = !0, M?.dispose(), a = null, m = null; }
  };
}

const U = e => document.querySelector(e),
  tt = U("#film"),
  ut = U("#stage"),
  Q = U("#intro"),
  zt = U("#outro"),
  K = U("#start"),
  Dt = U("#replay"),
  At = U("#toggle"),
  St = U("#full"),
  rt = U("#controls"),
  T = U("#sound"),
  le = matchMedia("(prefers-reduced-motion: reduce)");

let E = "intro", j, lt, V, st, dt = 0, ct = 0, ht = 0, gt = 0, Y = 0, Ct, kt = !1, Et = !1, J = ut.querySelector("canvas");
const wt = e => { E = e, document.body.dataset.state = e; };

function ft() {
  const e = tt.getBoundingClientRect();
  j?.resize(e.width, e.height), V && j && E === "paused" && et(T.currentTime, 0);
}

function et(e, t) {
  const n = E === "playing" ? st.sample(t) : null,
    o = V.at(e, n, le.matches);
  ut.style.opacity = String(N(o.reveal * Math.sqrt(o.tail))),
    j.draw(o, t),
    j.overloaded && Nt();
}

function Rt() { cancelAnimationFrame(dt), dt = 0, ct = 0; }

function it() { !dt && !document.hidden && (dt = requestAnimationFrame(ce)); }

function ce(e) {
  if (dt = 0, document.hidden || !j || !V) return;
  const t = ct ? (e - ct) / 1e3 : 0;
  if (ct = e, E === "playing") {
    const n = T.currentTime;
    (n !== ht || !n) && et(n, t), ht = n, n > .49 && (Q.hidden = !0, Q.classList.remove("leaving")), it();
  } else E === "ending" && (
    Y = Math.max(0, (e - gt) / 1e3),
    et(lt.duration + Math.min(R.afterglow, Y), 0),
    Y >= R.afterglow + .27 ? (ut.style.opacity = "0", wt("ended"), zt.hidden = !1, Dt.focus({ preventScroll: !0 }), Rt()) : it()
  );
}

function X(e = !1) {
  E !== "playing" && E !== "paused" || (
    rt.hidden = !1,
    rt.classList.add("shown"),
    clearTimeout(Ct),
    !e && E === "playing" && (Ct = setTimeout(() => rt.classList.remove("shown"), 2400))
  );
}

function Gt() { clearTimeout(Ct), rt.hidden = !0, rt.classList.remove("shown"); }

function de() {
  const e = document.createElement("canvas");
  return J.replaceWith(e), J = e, J;
}

let Lt = !1;

function Nt() {
  if (Lt || j?.kind === "canvas") return;
  Lt = !0;
  const e = j,
    t = document.createElement("canvas"),
    n = Ot(t),
    o = tt.getBoundingClientRect();
  n.resize(o.width, o.height), n.ready.then(() => {
    J.replaceWith(t), J = t, j = n, ut.dataset.renderer = n.kind, Lt = !1, ft(),
      (E === "playing" || E === "paused") && et(T.currentTime, 0),
      E === "ending" && et(lt.duration + Y, 0),
      e?.dispose(),
      (E === "playing" || E === "ending") && it();
  });
}

async function Ut() {
  if (!Et) {
    Et = !0, K.disabled = !0;
    try {
      const e = await fetch(new URL("data/score.json", document.baseURI));
      if (!e.ok) throw Error("score");
      lt = await e.json(), V = new re(lt), st = new se(T, lt.bandHz);
      try {
        const t = J.getContext("webgl2", { alpha: !1, antialias: !0, powerPreference: "high-performance" });
        if (!t) throw Error("webgl2");
        const n = t.getExtension("WEBGL_debug_renderer_info");
        if (n && /swiftshader|llvmpipe|softpipe|lavapipe|software rasterizer|basic render driver/i.test(t.getParameter(n.UNMASKED_RENDERER_WEBGL))) {
          throw t.getExtension("WEBGL_lose_context")?.loseContext(), Error("software renderer");
        }
        const { makeLaboratory: o } = await Yt(async () => {
          const { makeLaboratory: r } = await import("./laboratory-RYR1fYGS.js");
          return { makeLaboratory: r };
        }, [], import.meta.url);
        j = await o(J), J.addEventListener("webglcontextlost", r => { r.preventDefault(), Nt(); }, { once: !0 });
      } catch {
        j = Ot(de()), await j.ready;
      }
      ut.dataset.renderer = j.kind, ft(), et(0, 0), K.querySelector(".label").textContent = "Comenzar", K.disabled = !1;
    } catch {
      V = null, K.querySelector(".label").textContent = "Reintentar", K.disabled = !1;
    } finally {
      Et = !1;
    }
  }
}

function pt() {
  E === "playing" && (wt("paused"), T.pause(), Rt(), Q.hidden = !0, At.setAttribute("aria-label", "Reproducir"), X(!0));
}

async function bt() {
  if (kt) return;
  if (!V) { await Ut(), V && K.focus(); return; }
  kt = !0;
  const e = E;
  T.error && T.load(), e === "ended" && (T.currentTime = 0, ht = -1, st.reset());
  try {
    const t = st.unlock(), n = T.play();
    if (await Promise.all([n, t]), document.hidden) { T.pause(); return; }
    wt("playing"), zt.hidden = !0, e === "intro" && (Q.classList.add("leaving"), Q.inert = !0),
      At.setAttribute("aria-label", "Pausar"),
      e === "paused" ? X() : (Gt(), rt.hidden = !1),
      ht = -1, ct = 0, it();
  } catch {
    T.pause(), e === "intro" && (Q.inert = !1, K.querySelector(".label").textContent = "Reintentar"), e === "paused" && X(!0);
  } finally {
    kt = !1;
  }
}

K.addEventListener("click", bt);
Dt.addEventListener("click", bt);
At.addEventListener("click", () => E === "playing" ? pt() : bt());
T.addEventListener("pause", () => { !T.ended && E === "playing" && pt(); });
T.addEventListener("error", () => { E === "playing" && pt(); });
T.addEventListener("seeked", () => { st?.reset(), ht = -1, E === "paused" && et(T.currentTime, 0); });
T.addEventListener("ended", () => { V && (wt("ending"), Gt(), Q.hidden = !0, zt.hidden = !0, Y = 0, gt = performance.now(), it()); });
tt.addEventListener("pointerdown", e => { document.body.classList.remove("keyboard"), e.target.closest("button") || X(E === "paused"); });
tt.addEventListener("pointermove", e => { e.pointerType === "mouse" && X(E === "paused"); });
document.addEventListener("keydown", e => {
  document.body.classList.add("keyboard"),
    e.key === "Tab" ? X(E === "paused") :
    e.code === "Space" && !e.target.closest("button") && (E === "playing" || E === "paused") && (e.preventDefault(), E === "playing" ? pt() : bt());
});

const Bt = tt.requestFullscreen || tt.webkitRequestFullscreen;
if (Bt && (document.fullscreenEnabled || document.webkitFullscreenEnabled)) {
  St.hidden = !1, St.addEventListener("click", async () => {
    try {
      document.fullscreenElement || document.webkitFullscreenElement
        ? await (document.exitFullscreen || document.webkitExitFullscreen).call(document)
        : await Bt.call(tt);
    } catch {
      X(!0);
    }
  });
  const e = () => St.setAttribute("aria-label", document.fullscreenElement || document.webkitFullscreenElement ? "Salir de pantalla completa" : "Pantalla completa");
  document.addEventListener("fullscreenchange", e), document.addEventListener("webkitfullscreenchange", e);
}

function $t() { E === "playing" ? pt() : E === "ending" && (Y = (performance.now() - gt) / 1e3, Rt()); }
function Ht() { E === "paused" ? X(!0) : E === "ending" && (gt = performance.now() - Y * 1e3, it()), ft(); }

document.addEventListener("visibilitychange", () => document.hidden ? $t() : Ht());
window.addEventListener("pagehide", e => { $t(), e.persisted || (j?.dispose(), st?.dispose()); });
window.addEventListener("pageshow", e => { e.persisted && Ht(); });
window.addEventListener("resize", ft, { passive: !0 });
window.visualViewport?.addEventListener("resize", ft, { passive: !0 });
Ut();

export { R as A, N as c, _ as e, te as l, Z as m, Pt as r, _t as w };