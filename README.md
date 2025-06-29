<div id="pwn"></div>
<script>
  const s = document.querySelector('#pwn').attachShadow({mode:'open'});
  s.innerHTML = `<img src onerror=alert('shadowXSS')>`;
</script>
