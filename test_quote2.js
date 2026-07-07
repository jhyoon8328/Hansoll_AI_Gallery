const str = "Chico's CPO파일 비교";
const res2 = str.replace(/'/g, "\\'");
const res4 = str.replace(/'/g, "\\\\'");
console.log("With 2 backslashes:", res2);
console.log("With 4 backslashes:", res4);
