<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>RISE Inauguration System</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root{
    --navy-950:#05070f;
    --navy-900:#0b1330;
    --navy-800:#111d40;
    --navy-700:#1c2b56;
    --gold:#f0a93d;
    --gold-light:#ffd76a;
    --orange:#e8790a;
    --cream:#f5f1e8;
    --ink-dim:#a9b3d1;
  }
  *{box-sizing:border-box}
  html,body{height:100%}
  body{
    margin:0;
    min-height:100vh;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    position:relative;
    overflow:hidden;
    background:
      radial-gradient(circle at 50% 118%, rgba(240,169,61,.35), transparent 42%),
      radial-gradient(circle at 50% 130%, rgba(232,121,10,.28), transparent 55%),
      linear-gradient(180deg, var(--navy-950) 0%, var(--navy-900) 55%, var(--navy-800) 100%);
    font-family:'Inter',Arial,sans-serif;
    color:var(--cream);
    padding:28px 20px 0;
  }
  .sun{
    position:absolute;
    left:50%;
    bottom:-18vw;
    transform:translateX(-50%);
    width:38vw;
    height:38vw;
    max-width:420px;
    max-height:420px;
    min-width:220px;
    min-height:220px;
    border-radius:50%;
    background:radial-gradient(circle, var(--gold-light) 0%, var(--gold) 45%, var(--orange) 78%, transparent 82%);
    filter:blur(2px);
    opacity:.85;
    z-index:0;
  }
  .ridge{
    position:absolute;
    left:0; right:0; bottom:0;
    height:14vh;
    background:linear-gradient(180deg, transparent, var(--navy-950) 78%);
    z-index:1;
  }
  main{position:relative;z-index:2;width:min(94%,640px);text-align:center;}
  .eyebrow{
    display:inline-flex;
    align-items:center;
    gap:8px;
    padding:6px 16px;
    border:1px solid rgba(240,169,61,.4);
    border-radius:999px;
    background:rgba(240,169,61,.08);
    color:var(--gold-light);
    font-size:12px;
    font-weight:600;
    letter-spacing:.14em;
    text-transform:uppercase;
  }
  .eyebrow svg{width:13px;height:13px;fill:var(--gold-light)}
  h1{
    font-family:'Sora',sans-serif;
    font-weight:800;
    font-size:clamp(2.2rem,7vw,3.6rem);
    letter-spacing:-.01em;
    margin:18px 0 6px;
    color:var(--cream);
  }
  h1 span{
    background:linear-gradient(120deg, var(--gold-light), var(--orange));
    -webkit-background-clip:text;
    background-clip:text;
    color:transparent;
  }
  .tagline{
    margin:0 0 6px;
    color:var(--ink-dim);
    font-size:15px;
  }
  .theme{
    margin:0 0 34px;
    font-size:13px;
    color:var(--gold-light);
    font-style:italic;
  }
  .cards{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:16px;
  }
  a.card{
    position:relative;
    display:flex;
    flex-direction:column;
    align-items:flex-start;
    gap:10px;
    padding:24px 20px;
    border-radius:18px;
    text-decoration:none;
    color:var(--cream);
    background:linear-gradient(160deg, var(--navy-800), var(--navy-700));
    border:1px solid rgba(255,255,255,.08);
    text-align:left;
    transition:transform .18s ease, border-color .18s ease;
  }
  a.card:hover{transform:translateY(-3px);border-color:rgba(240,169,61,.5);}
  a.card .icon{
    width:38px;height:38px;
    border-radius:10px;
    display:grid;place-items:center;
    background:linear-gradient(135deg, var(--gold), var(--orange));
    font-size:18px;
  }
  a.card .label{font-family:'Sora',sans-serif;font-weight:700;font-size:16px;}
  a.card .desc{font-size:12.5px;color:var(--ink-dim);line-height:1.4;}
  footer{
    position:relative;
    z-index:2;
    margin:34px 0 20px;
    font-size:11.5px;
    color:var(--ink-dim);
    letter-spacing:.04em;
  }
  @media(max-width:520px){
    .cards{grid-template-columns:1fr}
  }
</style>
</head>
<body>
  <main>
    <span class="eyebrow">
      <svg viewBox="0 0 24 24"><path d="M2 21l20-9L2 3v7l14 2-14 2z"/></svg>
      RISE &middot; Research &amp; Innovation Society for Emerging Intelligence
    </span>
    <h1>RISE <span>Inauguration System</span></h1>
    <p class="tagline">Curtain-reveal display + mobile control panel, synced live over Firebase.</p>
    <p class="theme">Theme: Rising Sun — From Ideas to Impact</p>

    <div class="cards">
      <a class="card" href="display.html">
        <span class="icon">🖥️</span>
        <span class="label">Open Display</span>
        <span class="desc">Full-screen stage for the projector or large screen.</span>
      </a>
      <a class="card" href="controller.html">
        <span class="icon">📱</span>
        <span class="label">Open Controller</span>
        <span class="desc">Remote control from your phone — curtain, posters, effects.</span>
      </a>
    </div>
  </main>
  <footer>Sanjivani University &middot; School of Engineering &amp; Technology &middot; Dept. of Integrated B.Tech</footer>
  <div class="sun"></div>
  <div class="ridge"></div>
</body>
</html>
