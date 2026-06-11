const url = '/Project files/IT부/IT부 뉴스레터/IT부 뉴스레터.txt?t=123';
try {
  new URL(url, 'http://localhost');
  console.log("URL parsing works");
} catch(e) {
  console.error("URL parsing fails:", e);
}

try {
  fetch(url).catch(e => console.error("fetch async error:", e));
  console.log("fetch sync works");
} catch(e) {
  console.error("fetch sync error:", e);
}
